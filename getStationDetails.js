class TravelRoutes {
    constructor() {
        this.headers = [
            {
                "greq": "1718043848392",
                "Content-Type": "application/json; charset=UTF-8",
            },
            {
                "greq": "1718544636628",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            {
                "greq": "1720879916906",
                "Content-Type": "application/json; charset=UTF-8"
            }
        ];
        // this.client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
        // this.db = this.client.db('RailwayRoutes');
        // this.collection = this.db.collection('stations');
        this.url = [
            'https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC',
            'https://www.irctc.co.in/eticketing/protected/mapps1/trnscheduleenquiry',
            'https://api.indiantrain.in/api.asmx/ListofTrainPassingThroughStationDetailsInfo',
            'https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry'
        ];
    }

    async fetchAllTrainsOnRoute(source, destination, journeyDate) {
        try{
            const body = {
                "concessionBooking": "false",
                "srcStn": source,
                "destStn": destination,
                "jrnyClass": "",
                "jrnyDate": journeyDate,
                "quotaCode": "GN",
                "currentBooking": "false",
                "flexiFlag": "false",
                "handicapFlag": "false",
                "ticketType": "E",
                "loyaltyRedemptionBooking": "false",
                "ftBooking": "false"
            };
            const response = await fetch(this.url[0], {
                method: 'POST',
                headers: this.headers[0],
                body: JSON.stringify(body),
                agent: new (require('https').Agent)({ rejectUnauthorized: false })
            });
            return response.json();
       }catch(e) {
              return { error: 'Failed to fetch data', details: e.message };
       }
    }

    async perTrainDetails(trainNumber,date,from,to,travelClass,quota,status) {
        const body = {
            "paymentFlag":"N",
            "concessionBooking":false,
            "ftBooking":false,
            "loyaltyRedemptionBooking":false,
            "ticketType":"E",
            "quotaCode":quota,
            "moreThanOneDay":true,
            "trainNumber":trainNumber,
            "fromStnCode":from,
            "toStnCode":to,
            "isLogedinReq":false,
            "journeyDate":date,
            "classCode":travelClass
        };
        try {
            const finalUrl = `${this.url[3]}/${trainNumber}/${date}/${from}/${to}/${travelClass}/${quota}/${status}`
            console.log(finalUrl)
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: this.headers[2],
                body: JSON.stringify(body),
                agent: new (require('https').Agent)({ rejectUnauthorized: false })
            });

            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            return await response.json();
        } catch(e) {
            return { error: 'Failed to fetch data', details: e.message };
        }
        
    }

    async returnAllStationInBetween(allTrains, source, destination) {
        const trainNumbers = [];
        const stationCodes = new Set();
        for (const train of allTrains.trainBtwnStnsList) {
            trainNumbers.push(train.trainNumber);
        }

        for (const tn of trainNumbers) {
            let sourceSeen = false;
            let destSeen = false;
            const response = await fetch(`${this.url[1]}/${tn}`, {
                method: 'GET',
                headers: this.headers[1],
                agent: new (require('https').Agent)({ rejectUnauthorized: false })
            });
            const data = await response.json();
            for (const sb of data.stationList) {
                if (sb.stationCode === source) {
                    sourceSeen = true;
                    continue;
                } else if (sb.stationCode === destination) {
                    destSeen = true;
                }
                if (sourceSeen && !destSeen) {
                    stationCodes.add(sb.stationCode);
                }
            }
        }
        return Array.from(stationCodes);
    }

    async returnHighTrafficStations(stationCodes) {
        const highTrafficStationCodes = [];
        const codeAndNumTrains = {};
        for (const stationCode of stationCodes) {
            const response = await fetch(`${this.url[2]}?StationCode=${stationCode}`);
            const data = await response.json();
            codeAndNumTrains[stationCode] = data.TrainInfo.length;
        }

        // const sortedStations = Object.entries(codeAndNumTrains).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const sortedStations = Object.entries(codeAndNumTrains).sort((a, b) => b[1] - a[1]);
        for (const [key] of sortedStations) {
            highTrafficStationCodes.push(key);
        }
        return highTrafficStationCodes;
    }
}


module.exports = TravelRoutes;
