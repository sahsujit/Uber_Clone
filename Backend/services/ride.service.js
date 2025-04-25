// const rideModel = require("../model/ride.model");
// const { create } = require("../model/user.model");
// const mapService = require("../services/maps.service");

// const crypto = require('crypto');

// async function getFare(pickup, destination) {
//   if (!pickup || !destination) {
//     throw new Error("Pickup and destination are required");
//   }

//   const distanceTime = await mapService.getDistanceTime(pickup, destination);

//   const baseFare = {
//     auto: 30,
//     car: 50,
//     moto: 20,
//   };

//   const perKmRate = {
//     auto: 10,
//     car: 15,
//     moto: 8,
//   };

//   const perMinuteRate = {
//     auto: 2,
//     car: 3,
//     moto: 1.5,
//   };

//   const fare = {
//     auto: Math.round(
//       baseFare.auto +
//         (distanceTime.distance.value / 1000) * perKmRate.auto +
//         (distanceTime.duration.value / 60) * perMinuteRate.auto
//     ),
//     car: Math.round(
//       baseFare.car +
//         (distanceTime.distance.value / 1000) * perKmRate.car +
//         (distanceTime.duration.value / 60) * perMinuteRate.car
//     ),
//     moto: Math.round(
//       baseFare.moto +
//         (distanceTime.distance.value / 1000) * perKmRate.moto +
//         (distanceTime.duration.value / 60) * perMinuteRate.moto
//     ),
//   };
//   console.log("Fare: ", fare);

//   return fare;
// }
// module.exports.getFare = getFare;

// function getOtp(num) {
//     function generateOtp(num) {
//         const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
//         return otp;
//     }
//     return generateOtp(num);
// }

// module.exports.createRide = async ( {user, pickup, destination, vehicleType}) => {

//     if (!user || !pickup || !destination || !vehicleType) {
//         throw new Error('All fields are required');
//     }

//     const fare = await getFare(pickup, destination);
//     const ride = await rideModel.create({
//         user,
//         pickup,
//         destination,
//         otp: getOtp(6),
//         fare: fare[vehicleType],
       
//     });

//     return ride;

// };













const rideModel = require("../model/ride.model");
const mapService = require("../services/maps.service");
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    try {
        const distanceTime = await mapService.getDistanceTime(pickup, destination);

        const baseFare = {
            auto: 30,
            car: 50,
            moto: 20,
        };

        const perKmRate = {
            auto: 10,
            car: 15,
            moto: 8,
        };

        const perMinuteRate = {
            auto: 2,
            car: 3,
            moto: 1.5,
        };

        // Calculate fares for each vehicle type
        const fare = {
            auto: Math.round(
                baseFare.auto +
                (distanceTime.distance.value / 1000) * perKmRate.auto +
                (distanceTime.duration.value / 60) * perMinuteRate.auto
            ),
            car: Math.round(
                baseFare.car +
                (distanceTime.distance.value / 1000) * perKmRate.car +
                (distanceTime.duration.value / 60) * perMinuteRate.car
            ),
            moto: Math.round(
                baseFare.moto +
                (distanceTime.distance.value / 1000) * perKmRate.moto +
                (distanceTime.duration.value / 60) * perMinuteRate.moto
            ),
        };
        
        console.log("Fare: ", fare);
        return fare;
    } catch (err) {
        console.error("Error calculating fare: ", err);
        throw new Error("Unable to calculate fare");
    }
}

module.exports.getFare = getFare;

// OTP generation function
function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

// Ride creation
module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    try {
        const fare = await getFare(pickup, destination);

        if (!fare[vehicleType]) {
            throw new Error('Invalid vehicle type');
        }

        const otp = getOtp(6);

        const ride = await rideModel.create({
            user: user._id, // Assuming user is an object with _id
            pickup,
            destination,
            otp,
            fare: fare[vehicleType],
            vehicleType
        });

        return ride;
    } catch (err) {
        console.error("Error creating ride: ", err);
        throw new Error("Unable to create ride");
    }
};
