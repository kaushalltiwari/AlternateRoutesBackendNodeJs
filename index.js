const express = require('express');
const app = express();
const { connectDb, insertAllStations, searchStation } = require('./db')
const TravelRoutes = require('./getStationDetails')
const port = 3000;

async function fetchWithOptions() {
    const response = await fetch('https://api.indiantrain.in/trains/FullStationList.json', {
      method: 'GET',
      headers: {
        "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.indiantrain.in/",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
        "sec-ch-ua-platform": "\"Windows\""
      }
    });
    const data = await response.json();
    return data;
}

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/',  (req, res) => {

    res.send("Welcome to Alternate Routes");
    
});

app.get('/searchStation',  async (req, res) => {
    
    const data = await searchStation('BUA')
    res.send(data);
    
});

app.get('/fetchAllStations', async (req, res) => {
    try {
        const data = await fetchWithOptions();
        const status = await insertAllStations(data)
        res.send(status);
    } catch (error) {
        res.status(500).send('Error fetching/Storing data');
    }
});

app.get('/getStationsDetails', async (req, res ) => {
    const routes = new TravelRoutes();
    const { source, destination, date } = req.body;
    // const source = "NDLS";
    // const destination = "DHN";
    // const allTrains = await routes.fetchAllTrainsOnRoute(source, destination, "20240630");
    const allTrains = await routes.fetchAllTrainsOnRoute(source, destination, date);
    const stationCodes = await routes.returnAllStationInBetween(allTrains, source, destination);
    console.log(stationCodes);
    stations = await routes.returnHighTrafficStations(stationCodes);
    res.send(stations)
})



connectDb().then (() => {
    app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    });
})