const { HttpsProxyAgent } = require('https-proxy-agent');

class TravelRoutes {
    constructor() {
        this.headers = [
            {
                "greq": "1718043848392",
                "Content-Type": "application/json; charset=UTF-8",
                "User-Agent" : ""
            },
            {
                "greq": "1718544636628",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            {
                "greq": "1720879916906",
                "Content-Type": "application/json; charset=UTF-8",
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

        this.useragent = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0"
        ]

        this.proxies = [
            'http://104.207.46.35:3128',
            'http://104.207.52.124:3128',
            'http://104.207.41.94:3128',
            'http://104.167.29.14:3128',
            'http://104.207.49.82:3128',
            'http://104.207.47.153:3128',
            'http://104.207.39.130:3128',
            'http://104.207.55.24:3128',
            'http://104.207.37.169:3128',
            'http://104.207.33.135:3128',
            'http://104.207.51.24:3128',
            'http://104.167.26.86:3128',
            'http://104.207.34.15:3128',
            'http://104.207.45.199:3128',
            'http://104.167.24.138:3128',
            'http://104.167.30.75:3128',
            'http://104.207.33.65:3128',
            'http://104.207.42.138:3128',
            'http://104.207.38.169:3128',
            'http://104.167.30.253:3128',
            'http://104.207.32.62:3128',
            'http://104.207.50.101:3128',
            'http://104.207.42.154:3128',
            'http://104.207.43.39:3128',
            'http://104.207.38.113:3128',
            'http://104.207.57.221:3128',
            'http://104.207.47.17:3128',
            'http://104.207.33.198:3128',
            'http://104.207.49.108:3128',
            'http://104.207.53.32:3128',
            'http://104.207.60.208:3128',
            'http://104.207.52.112:3128',
            'http://104.207.59.90:3128',
            'http://104.207.46.80:3128',
            'http://104.207.41.60:3128',
            'http://104.167.26.148:3128',
            'http://104.207.59.13:3128',
            'http://104.207.39.43:3128',
            'http://104.207.39.177:3128',
            'http://104.207.49.62:3128',
            'http://104.207.33.157:3128',
            'http://104.207.40.126:3128',
            'http://104.207.63.249:3128',
            'http://104.167.24.100:3128',
            'http://104.167.29.140:3128',
            'http://104.207.40.43:3128',
            'http://104.207.37.226:3128',
            'http://104.167.27.136:3128',
            'http://104.207.44.92:3128',
            'http://104.167.26.52:3128',
            'http://104.207.62.126:3128',
            'http://104.167.29.61:3128',
            'http://104.207.33.239:3128',
            'http://104.207.35.100:3128',
            'http://104.207.61.251:3128',
            'http://104.207.33.54:3128',
            'http://104.207.62.64:3128',
            'http://104.167.27.187:3128',
            'http://104.207.54.199:3128',
            'http://104.207.53.247:3128',
            'http://104.207.55.103:3128',
            'http://104.207.48.233:3128',
            'http://104.207.62.15:3128',
            'http://104.207.37.57:3128',
            'http://104.207.50.155:3128',
            'http://104.207.35.175:3128',
            'http://104.207.40.250:3128',
            'http://104.207.32.195:3128',
            'http://104.207.36.230:3128',
            'http://104.167.29.92:3128',
            'http://104.167.31.33:3128',
            'http://104.207.37.229:3128',
            'http://104.207.39.52:3128',
            'http://104.207.42.184:3128',
            'http://104.207.60.180:3128',
            'http://104.207.44.234:3128',
            'http://104.167.24.156:3128',
            'http://104.207.48.22:3128',
            'http://104.207.39.158:3128',
            'http://104.167.31.139:3128',
            'http://104.207.36.138:3128',
            'http://104.207.51.141:3128',
            'http://104.207.42.47:3128',
            'http://104.207.48.199:3128',
            'http://104.207.58.73:3128',
            'http://104.207.44.42:3128',
            'http://104.207.56.169:3128',
            'http://104.167.29.238:3128',
            'http://104.167.30.107:3128',
            'http://104.207.38.72:3128',
            'http://104.207.48.239:3128',
            'http://104.207.59.209:3128',
            'http://104.207.54.29:3128',
            'http://104.207.47.147:3128',
            'http://104.167.24.219:3128',
            'http://104.207.43.33:3128',
            'http://104.207.53.146:3128',
            'http://104.207.47.232:3128',
            'http://104.207.46.4:3128',
            'http://104.207.40.60:3128'
        ]

    }

    async fetchAllTrainsOnRoute(source, destination, journeyDate) {
        try {
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
            this.headers[0].greq = (Number(this.headers[0].greq) + 1).toString();
            this.headers[0]['User-Agent'] = this.useragent[Math.floor(Math.random() * this.useragent.length)];
            const agent = new HttpsProxyAgent(this.proxies[Math.floor(Math.random() * this.proxies.length)]);

            // console.log(this.headers[0].greq.toString())
            const response = await fetch(this.url[0], {
                method: 'POST',
                headers: this.headers[0],
                body: JSON.stringify(body),
                // agent: new (require('https').Agent)({ rejectUnauthorized: false })
                agent: agent
            });
            
            console.log("fetchAllTrainsOnRoute ->" + response.status)
            // const responseData = await response.json();
            // console.log(`Response Data of Get All Direct Trains: ${JSON.stringify(responseData)}`);
            // return responseData;


            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json();
                console.log(`Response Data of Get All Direct Trains: ${JSON.stringify(responseData)}`);
                return responseData;
            } else {
                const text = await response.text();
                console.error('Unexpected response format:', text);
                return { error: 'Failed to fetch data', details: 'Unexpected response format' };
            }


        } catch (e) {
            console.log(e.message);
            return { error: 'Failed to fetch data', details: e.message };
        }
    }

    async perTrainDetails(trainNumber, date, from, to, travelClass, quota, status) {
        const body = {
            "paymentFlag": "N",
            "concessionBooking": false,
            "ftBooking": false,
            "loyaltyRedemptionBooking": false,
            "ticketType": "E",
            "quotaCode": quota,
            "moreThanOneDay": true,
            "trainNumber": trainNumber,
            "fromStnCode": from,
            "toStnCode": to,
            "isLogedinReq": false,
            "journeyDate": date,
            "classCode": travelClass
        };
        try {
            const finalUrl = `${this.url[3]}/${trainNumber}/${date}/${from}/${to}/${travelClass}/${quota}/${status}`
            // console.log(finalUrl)
            this.headers[2]['User-Agent'] = this.useragent[Math.floor(Math.random() * this.useragent.length)];
            this.headers[2].greq = (Number(this.headers[2].greq) + 1).toString()
            const agent = new HttpsProxyAgent(this.proxies[Math.floor(Math.random() * this.proxies.length)]);
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: this.headers[2],
                body: JSON.stringify(body),
                // agent: new (require('https').Agent)({ rejectUnauthorized: false })
                agent : agent
            });

            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(`Response Data of PerTrainTicket: ${JSON.stringify(responseData)}`);
            return responseData;
        } catch (e) {
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
            this.headers[1]['User-Agent'] = this.useragent[Math.floor(Math.random() * this.useragent.length)];
            this.headers[1].greq = (Number(this.headers[1].greq) + 1).toString()
            const agent = new HttpsProxyAgent(this.proxies[Math.floor(Math.random() * this.proxies.length)]);
            const response = await fetch(`${this.url[1]}/${tn}`, {
                method: 'GET',
                headers: this.headers[1],
                // agent: new (require('https').Agent)({ rejectUnauthorized: false })
                agent : agent
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
