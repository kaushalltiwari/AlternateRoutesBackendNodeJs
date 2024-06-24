const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/Alternateroutes"; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = 3000;


async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error(err);
    }
  }
  
run();

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
  //   console.log(data);
}

app.get('/', async (req, res) => {
    try {
        const data = await fetchWithOptions();
        res.send(data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});