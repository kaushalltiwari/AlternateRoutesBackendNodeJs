// const fetch = require('node-fetch');
const mongoose = require('mongoose');

class ExtractStationInfo {
    constructor() {
        this.headers = {
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.indiantrain.in/",
            "sec-ch-ua-mobile": "?0",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
            "sec-ch-ua-platform": "\"Windows\""
        };

        this.url = ['https://api.indiantrain.in/trains/FullStationList.json', 'https://api.indiantrain.in/api.asmx/ListofTrainPassingThroughStationDetailsInfo'];
        this.db = mongoose.connection;
    }

    async connectDb() {
        await mongoose.connect('mongodb://127.0.0.1:27017/Alternateroutes');
        const stationSchema = new mongoose.Schema({
            StationCode: String,
            StationName: String,
            numberOfTrains: Number
        });
        this.Station = mongoose.model('stations', stationSchema);
    }

    async communicateWithSiteAndStoreInDB() {
        try {
            const response = await fetch(this.url[0], { headers: this.headers });
            const data = await response.json();
            await this.Station.insertMany(data);
        } catch (error) {
            console.error('Error fetching or storing data:', error);
        }
    }

    async retrieveNumberOfTrainsInfoAndStore() {
        try {
            const stations = await this.Station.find();
            for (const data of stations) {
                const param = new URLSearchParams({ "StationCode": data.StationCode });
                const response = await fetch(`${this.url[1]}?${param.toString()}`);
                const responseData = await response.json();
                const numberOfTrains = responseData.TrainInfo ? responseData.TrainInfo.length : 0;
                await this.Station.updateOne({ _id: data._id }, { $set: { numberOfTrains } });
                console.log(`Updated id ${data._id}`);
            }
        } catch (error) {
            console.error('Error retrieving or updating data:', error);
        }
    }
}

(async () => {
    const extract = new ExtractStationInfo();
    await extract.connectDb();
    await extract.communicateWithSiteAndStoreInDB();
    await extract.retrieveNumberOfTrainsInfoAndStore();
    mongoose.connection.close();
})();
