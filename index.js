const express = require('express');
const app = express();
const { connectDb, insertAllStations, searchStation } = require('./db')
const {insertAllStationsToElasticsearch, autoSearch} = require('./elasticDb')
const TravelRoutes = require('./getStationDetails')
const cors = require('cors');
const port = 3000;

// Define a whitelist of allowed origins (e.g., your frontend URL)
const whitelist = ['http://localhost:5173','http://localhost:3000']; // Add your frontend URL here

// Configure CORS options
app.use(cors({
    origin: whitelist,
    credentials: true, // Set this to true if you need to handle cookies or authentication
}));

// Use the CORS middleware with the specified options
// app.use(cors(corsOptions));

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

async function fetchStationsFromrailyatri() {
    const response = await fetch('https://food1.railyatri.in/api/common_city_station_search.json', {
      method: 'GET',
      headers: {
        "origin": "https://www.railyatri.in",
        "referer": "https://www.railyatri.in/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"  
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
        // const status = await insertAllStations(data)
        const status = await insertAllStationsToElasticsearch(data)
        res.send(status);
    } catch (error) {
        res.status(500).send('Error fetching/Storing data');
    }
});

//The following is used to fetch and store data in elastic search from 
app.get('/fetchAllStationsFromRailYatriAndStore', async (req, res) => {
    try {
        const data = await fetchStationsFromrailyatri();
        // const status = await insertAllStations(data)
        const status = await insertAllStationsToElasticsearch(data)
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

//Here Elastic search is used
app.get('/searchSation', async (req, res ) => {
    const stationName = req.query.stationName.toString().toLowerCase()
    const stations = await autoSearch(stationName);
    res.send(stations)
})



// connectDb().then (() => {
    app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    });
// })