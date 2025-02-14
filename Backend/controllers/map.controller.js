// const mapService = require('../services/maps.service');
// const { validationResult } = require('express-validator');


// module.exports.getCoordinates = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }


//     const { address } = req.query;

//     try {
//         const coordinates = await mapService.getAddressCoordinate(address);
//         res.status(200).json(coordinates);
//     } catch (error) {
//         res.status(404).json({ message: 'Coordinates not found' });
//     }
// }


// module.exports.getDistanceTime = async (req, res, next) => {

//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { origin, destination } = req.query;

//         const distanceTime = await mapService.getDistanceTime(origin, destination);

//         res.status(200).json(distanceTime);

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }



const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    // Validate the input using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        // Call the service to get coordinates for the address
        const coordinates = await mapService.getAddressCoordinate(address);
        if (coordinates) {
            res.status(200).json(coordinates); // Send the coordinates in the response
        } else {
            res.status(404).json({ message: 'Coordinates not found' });
        }
    } catch (error) {
        console.error('Error getting coordinates:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getDistanceTime = async (req, res) => {
    // Validate the input using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    try {
        // Ensure origin and destination are provided
        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        // Get the distance and time between origin and destination
        const distanceTime = await mapService.getDistanceTime(origin, destination);

        if (distanceTime) {
            res.status(200).json(distanceTime); // Send the distance and time in the response
        } else {
            res.status(404).json({ message: 'Unable to calculate distance and time' });
        }
    } catch (error) {
        console.error('Error calculating distance and time:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
