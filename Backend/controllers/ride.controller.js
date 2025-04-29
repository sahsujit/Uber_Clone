const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../model/ride.model');




// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);

//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);



//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         })

//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };






module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        // Create the ride
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride); // Send response early
        return;

        // Fetch pickup coordinates
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        if (!pickupCoordinates || !pickupCoordinates.ltd || !pickupCoordinates.lng) {
            console.error('Invalid pickup address. Unable to fetch coordinates.');
            return;
        }

        // Find captains in the radius
        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

        // Update ride and notify captains
        ride.otp = '';
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.forEach((captain) => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser,
            });
        });
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message });
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
}
















// const rideService = require('../services/ride.service');
// const { validationResult } = require('express-validator');
// const mapService = require('../services/maps.service');
// const { sendMessageToSocketId } = require('../socket');
// const rideModel = require('../model/ride.model');

// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { pickup, destination, vehicleType } = req.body;

//     try {
//         // 1. Create ride and respond early
//         const ride = await rideService.createRide({
//             user: req.user._id,
//             pickup,
//             destination,
//             vehicleType,
//         });

//         console.log("✅ Ride created by user:", req.user._id);
//         res.status(201).json(ride); // Respond early

//         // 2. Get pickup coordinates
//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

//         // Use correct key names (not `ltd`)
//         const lat = pickupCoordinates.lat || pickupCoordinates.ltd; // fallback if `ltd` still used
//         const lng = pickupCoordinates.lng;

//         if (!lat || !lng) {
//             throw new Error("Latitude, longitude, and radius are required");
//         }

//         console.log("📍 Pickup coordinates:", { lat, lng });

//         // 3. Get nearby captains
//         const captainsInRadius = await mapService.getCaptainsInTheRadius(lng, lat, 5);
//         console.log(
//             "🎯 Captains found in radius:",
//             captainsInRadius.map(c => ({ _id: c._id, socketId: c.socketId }))
//         );

//         // 4. Set OTP empty if needed and populate ride
//         ride.otp = "";
//         const rideWithUser = await rideModel.findById(ride._id).populate("user");

//         // 5. Emit ride data to all nearby captains
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
// };






