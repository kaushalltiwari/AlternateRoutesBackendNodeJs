const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Alternateroutes');

const { Schema } = mongoose;

const generateRandomTrainNumbers = () => {
    const trainNumbers = Math.floor(Math.random() * 300) + 1;
    return trainNumbers;
};

const stationsSchema = new Schema({
    StationCode: String,
    StationName: String,
    trainNumbers: {
        type: Number,
        default: generateRandomTrainNumbers
    }
});

const station = mongoose.model('stations', stationsSchema);

const connectDb = async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/Alternateroutes');
        console.log("Connection successful to db")
    } catch (error) {
        console.error("Connection to db was unsuccessful")
        ProcessingInstruction.exit(0)
    }
};

const insertAllStations = async (data) => {
    try {
        const docs = await station.insertMany(data);
        console.log('Multiple documents inserted:', docs);
        return "All Stations Added";
      } catch (err) {
        console.error('Error inserting documents:', err);
        return "Error in adding stations";
      }
};

const searchStation = async (stationCode) => {

    try {
        const stations = await station.find({ StationCode: stationCode }).select('trainNumbers -_id');
        console.log(stations);
        return stations;
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error if needed
    }
};

module.exports = { connectDb, insertAllStations, searchStation };