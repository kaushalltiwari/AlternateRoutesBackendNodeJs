const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

const client = new Client({
  node: 'https://localhost:9200', // Change this to your Elasticsearch server details
  auth: {
    username: 'elastic', // Your Elasticsearch username
    password: '*1hn76KpU9gLrF-38ogj', // Your Elasticsearch password
  },
  tls: {
    ca: fs.readFileSync('./http_ca.crt'),
    rejectUnauthorized: false
  }
});

const allStationIndex = "all_stations"
const allStationsNew = "all_stations_new"

async function createIndexIfNotExists() {
  await client.indices.create({
    index: allStationIndex,
    operations: {
      mappings: {
        properties: {
          stationCode: { type: 'text', fields: { keyword: { type: 'keyword' } } },
          stationName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
          stateName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
          cityName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
          NumbersOfTrains: { type: 'integer', fields: { keyword: { type: 'keyword' } } },
          Latitude: { type: 'double', fields: { keyword: { type: 'keyword' } } },
          Longitude: { type: 'double', fields: { keyword: { type: 'keyword' } } }
        }
      }
    }
  }, { ignore: [400] })

}

const insertAllStationsToElasticsearch = async (data) => {
  try {
    await createIndexIfNotExists()
    data = data.map(data => ({
      ...data,
      "stateName" : "TBD",
      "cityName" : "TBD",
      "NumbersOfTrains": 0,
      "Latitude": 0.0,
      "Longitude": 0.0
    }));
    const operations = data.flatMap(doc => [{ index: { _index: allStationIndex} }, doc])
    const bulkResponse = await client.bulk({ refresh: true, operations })
    if (bulkResponse.errors) {
      const erroredDocuments = []
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0]
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1]
          })
        }
      })
      console.log(erroredDocuments)
    }

    const count = await client.count({ index: 'all_stations' })
    return count;
  } catch (err) {
    return "Error in adding stations to Elasticsearch";
  }
};

const autoSearch = async (data) => {
  try {
    const result = await client.search({
      index: allStationIndex,
      body: {
        query: {
          bool: {
            must: [
              {
                wildcard: {
                  StationName: {
                    // value: `asa*`
                    value: data+'*'
                  }
                }
              }
            ]
          }
        },
        aggs: {
          auto_complete: {
            terms: {
              field: "StationName.keyword",
              order: {
                _count: "desc"
              },
              size: 10
            }
          }
        }
      }
    });
    return result
  } catch (err) {
    return "Error in adding stations to Elasticsearch";
  }
};


module.exports = { insertAllStationsToElasticsearch, autoSearch}