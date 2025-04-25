// const mongoose = require("mongoose");

// function connectToDB(){


// mongoose.connect(process.env.DB_URL, {
   
//   }).then(() => {
//     console.log('Connected to MongoDB');
//   }).catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//   });
// }

// module.exports = connectToDB


// const mongoose = require("mongoose");
// const captainModel = require('../model/captain.model'); // Adjust the path to where your captain model is located

// function connectToDB() {
//   mongoose.connect(process.env.DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }).then(async () => {
//     console.log('Connected to MongoDB');


//     captainModel.find({ "location.coordinates": { $exists: true } }).then(captains => {
//       console.log(captains);
//   });
  
//     // Ensure that the 2dsphere index is created for the location field in the captain model
//     await captainModel.collection.createIndex({ location: '2dsphere' });
//     console.log("2dsphere index created for captain model");

//   }).catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//   });
// }

// module.exports = connectToDB;









const mongoose = require("mongoose");
const captainModel = require('../model/captain.model'); // Adjust the path to where your captain model is located

function connectToDB() {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log('Connected to MongoDB');

    // Ensure that the 2dsphere index is created for the location field in the captain model
    await captainModel.collection.createIndex({ location: '2dsphere' });
    console.log("2dsphere index created for captain model");

    // Example of using geoNear to find captains within a certain radius (in meters)
    const lat = 27.708317;  // example pickup latitude
    const lng = 85.3205817; // example pickup longitude
    const radius = 5000; // 5km radius

    captainModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "dist.calculated",
          maxDistance: radius,
          spherical: true
        }
      }
    ]).then(captains => {
      console.log("Captains found in radius:", captains);
    }).catch(err => {
      console.error("Error finding captains:", err);
    });
    
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });



}

module.exports = connectToDB;
