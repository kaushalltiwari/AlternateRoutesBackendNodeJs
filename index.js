const express = require('express');
const app = express();
const {insertAllStationsToElasticsearch, autoSearch} = require('./elasticDb')
const TravelRoutes = require('./getStationDetails')
const cors = require('cors');
const port = 3000;

// Define a whitelist of allowed origins (e.g., your frontend URL)
const whitelist = ['http://localhost:5173','http://localhost:3000']; // Add your frontend URL here

app.use(cors({
    origin: whitelist,
    credentials: true, // Set this to true if you need to handle cookies or authentication
}));


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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


app.get('/fetchAllStations', async (req, res) => {
    try {
        const data = await fetchWithOptions();
        // const status = await insertAllStations(data)
        const status = await insertAllStationsToElasticsearch(data);
        res.send(status);
    } catch (error) {
        res.status(500).send('Error fetching/Storing data');
    }
});

//Will Use the following function for other activity
app.get('/getStationsDetails', async (req, res ) => {
    const routes = new TravelRoutes();
    // const { source, destination, date } = req.body;
    const source = "NDLS";
    const destination = "DHN";
    const allTrains = await routes.fetchAllTrainsOnRoute(source, destination, "20240728");
    // const allTrains = await routes.fetchAllTrainsOnRoute(source, destination, date);
    // const stationCodes = await routes.returnAllStationInBetween(allTrains, source, destination);
    // console.log(stationCodes);
    // stations = await routes.returnHighTrafficStations(stationCodes);
    res.send(allTrains)
})

app.post('/getAllDirectTrains', async (req, res ) => {
    const routes = new TravelRoutes();
    const { source, destination, date, travelClass } = req.body;
    console.log(req.body)
    // console.log(`${source}--${destination}--${date}`)
    sleep(1000)
    const allTrains = await routes.fetchAllTrainsOnRoute(source, destination, date);
    // for (const train of allTrains.trainBtwnStnsList) {
    //     tickets = [];
    //     train.ticketOfClassAvailable = false;
    //     for (const tClass of train.avlClasses) {
    //         Getdetails = new TravelRoutes();
    //         let quota = "GN";
    //         let status = "N";
    //         const details = await Getdetails.perTrainDetails(train.trainNumber,date,train.fromStnCode,train.toStnCode,tClass,quota,status);
    //         if(tClass.toString() == travelClass.toString()) {
    //               if (details.avlDayList && details.avlDayList.length > 0) { 
    //                 if(details.avlDayList[0].availablityStatus.includes("AVAILABLE")) {
    //                 train.ticketOfClassAvailable = true
    //               }
    //             } else {
    //                 console.log(`False for ${train.trainName} and this is the response ${JSON.stringify(details, null, 2)}`)
    //             }
    //         }
    //         tickets.push({[tClass] : details});
    //     }
    //     train.ticketAviavlibility = tickets; 
    // }
    // console.log(allTrains)
    console.log(allTrains)
    res.send(allTrains)
})

app.get('/perTrainDetails/:trainNumber/:date/:from/:to/:travelClass/:quota/:status', async (req, res ) => {
    const Getdetails = new TravelRoutes();
    const {trainNumber,date,from,to,travelClass,quota,status} = req.params;
    sleep(1000)
    const details = await Getdetails.perTrainDetails(trainNumber,date,from,to,travelClass,quota,status);
    res.send(details);
})

/*
Here Elastic search is used
Search Station with domainname/searchStation?stationName=asa
*/
app.get('/searchSation', async (req, res ) => {
    const stationName = req.query.stationName.toString().toLowerCase()
    const stations = await autoSearch(stationName);
    res.send(stations)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});