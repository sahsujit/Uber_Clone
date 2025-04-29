
const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

// module.exports.getCoordinates = async (req, res) => {
//     // Validate the input using express-validator
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { address } = req.query;

//     try {
//         // Call the service to get coordinates for the address
//         const coordinates = await mapService.getAddressCoordinate(address);
//         if (coordinates) {
//             res.status(200).json(coordinates); // Send the coordinates in the response
//         } else {
//             res.status(404).json({ message: 'Coordinates not found' });
//         }
//     } catch (error) {
//         console.error('Error getting coordinates:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ message: 'Address query parameter is required' });
    }

    try {
        console.log('Received address:', address);

        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        res.status(404).json({ message: 'Coordinates not found', error: error.message });
    }
};


module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;
        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;
        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 