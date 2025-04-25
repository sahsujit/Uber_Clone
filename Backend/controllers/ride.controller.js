// const rideService = require('../services/ride.service');
// const { validationResult } = require('express-validator');
// const mapService = require('../services/maps.service');
// const { sendMessageToSocketId } = require('../socket');
// const rideModel = require('../model/ride.model');


// // module.exports.createRide = async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //         return res.status(400).json({ errors: errors.array() });
// //     }

// //     const { userId, pickup, destination, vehicleType } = req.body;

// //     try{
// //         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
// //         console.log("user", req.user._id);
// //         res.status(201).json(ride);
// //         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);



// //         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
// //         console.log("🎯 Captains found in radius:", captainsInRadius.map(c => ({ _id: c._id, socketId: c.socketId })));

// //         ride.otp = ""

// //         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
// //         captainsInRadius.map(captain => {

// //             sendMessageToSocketId(captain.socketId, {
// //                 event: 'new-ride',
// //                 data: rideWithUser
// //             })

// //         })
// //     }
// //     catch (error) {
// //         console.error('Error creating ride:', error.message);
// //         return res.status(500).json({ message: 'Internal server error' });
// //     }
// // }



// // module.exports.createRide = async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //         return res.status(400).json({ errors: errors.array() });
// //     }

// //     const { userId, pickup, destination, vehicleType } = req.body;

// //     try {
// //         // Create the ride and store it
// //         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
// //         console.log("user", req.user._id);

// //         // Fetch coordinates for the pickup location
// //         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
// //         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

// //         // OTP is being cleared (assuming it’s set later)
// //         ride.otp = "";

// //         // Find the ride again and populate the user
// //         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

// //         // Send the ride information to the client
// //         res.status(201).json(ride);

// //         // Now, send messages to all captains (async operation, after response is sent)
// //         captainsInRadius.forEach(captain => {
// //             sendMessageToSocketId(captain.socketId, {
// //                 event: 'new-ride',
// //                 data: rideWithUser
// //             });
// //         });

// //     } catch (error) {
// //         console.error('Error creating ride:', error.message);
// //         // Handle errors after ensuring the response was not already sent
// //         if (!res.headersSent) {
// //             return res.status(500).json({ message: 'Internal server error' });
// //         }
// //     }
// // }



// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { pickup, destination, vehicleType } = req.body;

//     try {
//         // 1. Create ride
//         const ride = await rideService.createRide({
//             user: req.user._id,
//             pickup,
//             destination,
//             vehicleType,
//         });
//         console.log("✅ Ride created by user:", req.user._id);

//         // 2. Respond early to the client
//         res.status(201).json(ride);

//         // 3. Get coordinates of pickup
//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
//         console.log("📍 Pickup coordinates:", pickupCoordinates);

//         // 👀 Fixing possible typo: pickupCoordinates.ltd → pickupCoordinates.lat
//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);


//         console.log(
//             "🎯 Captains found in radius:",
//             captainsInRadius.map(c => ({ _id: c._id, socketId: c.socketId }))
//         );

//         // 4. Update OTP (if needed) and populate ride with user
//         ride.otp = "";
//         const rideWithUser = await rideModel.findById(ride._id).populate("user");

//         // 5. Send ride info to captains via socket
//         captainsInRadius.forEach(captain => {
//             sendMessageToSocketId(captain.socketId, {
//                 event: "new-ride",
//                 data: rideWithUser,
//             });
//         });

//     } catch (error) {
//         console.error("❌ Error creating ride:", error.message);
//         if (!res.headersSent) {
//             return res.status(500).json({ message: "Internal server error" });
//         }
//     }
// };


// module.exports.getFare = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { pickup, destination } = req.query;

//     try {
//         const fare = await rideService.getFare(pickup, destination);
//         return res.status(200).json(fare);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }
















const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../model/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // 1. Create ride and respond early
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
        });

        console.log("✅ Ride created by user:", req.user._id);
        res.status(201).json(ride); // Respond early

        // 2. Get pickup coordinates
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        // Use correct key names (not `ltd`)
        const lat = pickupCoordinates.lat || pickupCoordinates.ltd; // fallback if `ltd` still used
        const lng = pickupCoordinates.lng;

        if (!lat || !lng) {
            throw new Error("Latitude, longitude, and radius are required");
        }

        console.log("📍 Pickup coordinates:", { lat, lng });

        // 3. Get nearby captains
        const captainsInRadius = await mapService.getCaptainsInTheRadius(lat, lng, 5);
        console.log(
            "🎯 Captains found in radius:",
            captainsInRadius.map(c => ({ _id: c._id, socketId: c.socketId }))
        );

        // 4. Set OTP empty if needed and populate ride
        ride.otp = "";
        const rideWithUser = await rideModel.findById(ride._id).populate("user");

        // 5. Emit ride data to all nearby captains
        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: "new-ride",
                data: rideWithUser,
            });
        });

    } catch (error) {
        console.error("❌ Error creating ride:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};


module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};






