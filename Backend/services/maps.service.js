// // const axios = require('axios');
// // const captainModel = require('../model/captain.model');
// // module.exports.getAddressCoordinate = async (address) => {
// //     const apiKey = process.env.GOOGLE_MAPS_API;
// //     const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

// //     try {
// //         const response = await axios.get(url);
// //         if (response.data.status.code === 200) {
// //             const location = response.data.results[0].geometry;
// //             return {
// //                 ltd: location.lat,
// //                 lng: location.lng
// //             };
// //         } else {
// //             throw new Error('Unable to fetch coordinates');
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         throw error;
// //     }
// // }





// // module.exports.getDistanceTime = async (origin, destination) => {
// //     if (!origin || !destination) {
// //         throw new Error('Origin and destination are required');
// //     }

// //     const apiKey = process.env.ORS_API_KEY;

// //     const getCoords = async (place) => {
// //         const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
// //             params: {
// //                 q: place,
// //                 format: 'json',
// //                 limit: 1
// //             },
// //             headers: {
// //                 'User-Agent': 'uber-clone/1.0'
// //             }
// //         });

// //         if (!response.data || response.data.length === 0) {
// //             throw new Error(`Location not found: ${place}`);
// //         }

// //         const { lat, lon } = response.data[0];
// //         return [parseFloat(lon), parseFloat(lat)];
// //     };

// //     const formatDistance = (meters) => {
// //         return meters >= 1000
// //             ? `${(meters / 1000).toFixed(1)} km`
// //             : `${meters.toFixed(0)} m`;
// //     };

// //     const formatDuration = (seconds) => {
// //         const hrs = Math.floor(seconds / 3600);
// //         const mins = Math.floor((seconds % 3600) / 60);

// //         if (hrs > 0) {
// //             return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
// //         } else {
// //             return `${mins} min${mins !== 1 ? 's' : ''}`;
// //         }
// //     };

// //     try {
// //         const [originCoords, destinationCoords] = await Promise.all([
// //             getCoords(origin),
// //             getCoords(destination)
// //         ]);

// //         const orsUrl = `https://api.openrouteservice.org/v2/matrix/driving-car`;

// //         const matrixResponse = await axios.post(orsUrl, {
// //             locations: [originCoords, destinationCoords],
// //             metrics: ['distance', 'duration']
// //         }, {
// //             headers: {
// //                 'Authorization': apiKey,
// //                 'Content-Type': 'application/json'
// //             }
// //         });

// //         const distance = matrixResponse.data.distances[0][1]; // meters
// //         const duration = matrixResponse.data.durations[0][1]; // seconds

// //         return {
// //             distance: {
// //                 value: distance,
// //                 text: formatDistance(distance)
// //             },
// //             duration: {
// //                 value: duration,
// //                 text: formatDuration(duration)
// //             }
// //         };

// //     } catch (err) {
// //         console.error(err);
// //         throw err;
// //     }
// // };





// // module.exports.getAutoCompleteSuggestions = async (input) => {
// //     if (!input) {
// //         throw new Error('Input query is required');
// //     }

// //     const apiKey = process.env.ORS_API_KEY;  // Or you can use Nominatim without an API key

// //     try {
// //         const url = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(input)}`;

// //         // Call OpenRouteService or Nominatim's search endpoint
// //         // const url = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(input)}&boundary.country=US`;

// //         const response = await axios.get(url, {
// //             headers: {
// //                 'Authorization': apiKey
// //             }
// //         });

// //         if (response.data.features && response.data.features.length > 0) {
// //             return response.data.features.map(feature => feature.properties.label).filter(value => value);
// //         } else {
// //             throw new Error('No suggestions found');
// //         }
// //     } catch (err) {
// //         console.error(err);
// //         throw err;
// //     }
// // };




// // module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

// //     // radius in km


// //     const captains = await captainModel.find({
// //         location: {
// //             $geoWithin: {
// //                 $centerSphere: [ [ ltd, lng ], radius / 6371 ]
// //             }
// //         }
// //     });

// //     return captains;


// // }



const axios = require('axios');
const captainModel = require('../model/captain.model');

// Get the coordinates of a given address using OpenCage API
// module.exports.getAddressCoordinate = async (address) => {
//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status.code === 200) {
//             const location = response.data.results[0].geometry;
//             return {
//                 ltd: location.lat,
//                 lng: location.lng
//             };
//         } else {
//             throw new Error('Unable to fetch coordinates');
//         }
//     } catch (error) {
//         console.error("Error in getAddressCoordinate:", error.message);
//         throw new Error('Failed to fetch address coordinates');
//     }
// };



// Replace this with your actual API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address,
                key: GOOGLE_MAPS_API_KEY,
            },
        });

        const data = response.data;

        if (data.status !== 'OK' || data.results.length === 0) {
            throw new Error('No results found for the given address');
        }

        const location = data.results[0].geometry.location;

        return {
            lat: location.lat,
            lng: location.lng,
        };
    } catch (error) {
        console.error('Google Maps API error:', error.message);
        throw new Error('Unable to fetch coordinates');
    }
};


// Get distance and time between origin and destination using OpenRouteService API
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.ORS_API_KEY;

    const getCoords = async (place) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: { q: place, format: 'json', limit: 1 },
                headers: { 'User-Agent': 'uber-clone/1.0' }
            });

            if (!response.data || response.data.length === 0) {
                throw new Error(`Location not found: ${place}`);
            }

            const { lat, lon } = response.data[0];
            return [parseFloat(lon), parseFloat(lat)];
        } catch (err) {
            console.error(`Error fetching coordinates for ${place}:`, err.message);
            throw new Error(`Error fetching coordinates for ${place}`);
        }
    };

    const formatDistance = (meters) => meters >= 1000
        ? `${(meters / 1000).toFixed(1)} km`
        : `${meters.toFixed(0)} m`;

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return hrs > 0
            ? `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`
            : `${mins} min${mins !== 1 ? 's' : ''}`;
    };

    try {
        const [originCoords, destinationCoords] = await Promise.all([
            getCoords(origin),
            getCoords(destination)
        ]);

        const orsUrl = `https://api.openrouteservice.org/v2/matrix/driving-car`;
        const matrixResponse = await axios.post(orsUrl, {
            locations: [originCoords, destinationCoords],
            metrics: ['distance', 'duration']
        }, {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        });

        const distance = matrixResponse.data.distances[0][1]; // meters
        const duration = matrixResponse.data.durations[0][1]; // seconds

        return {
            distance: {
                value: distance,
                text: formatDistance(distance)
            },
            duration: {
                value: duration,
                text: formatDuration(duration)
            }
        };
    } catch (err) {
        console.error("Error in getDistanceTime:", err.message);
        throw new Error('Failed to fetch distance and time');
    }
};

// Get autocomplete suggestions for a given input using OpenRouteService API
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Input query is required');
    }

    const apiKey = process.env.ORS_API_KEY;

    try {
        const url = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(input)}`;
        const response = await axios.get(url, {
            headers: { 'Authorization': apiKey }
        });

        if (response.data.features && response.data.features.length > 0) {
            return response.data.features.map(feature => feature.properties.label).filter(value => value);
        } else {
            throw new Error('No suggestions found');
        }
    } catch (err) {
        console.error("Error in getAutoCompleteSuggestions:", err.message);
        throw new Error('Failed to fetch autocomplete suggestions');
    }
};




















// Get captains in the given radius using geo-spatial query
// module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
//     if (!ltd || !lng || !radius) {
//         throw new Error('Latitude, longitude, and radius are required');
//     }

//     try {
//         const captains = await captainModel.find({
//             location: {
//                 $geoWithin: {
//                     $centerSphere: [[ltd, lng], radius / 6371]
//                 }
//             }
//         });
//         return captains;
//     } catch (err) {
//         console.error("Error in getCaptainsInTheRadius:", err.message);
//         throw new Error('Failed to fetch captains within radius');
//     }
// };







// const axios = require('axios');
// const captainModel = require('../model/captain.model');

// // Get the coordinates of a given address using OpenCage API
// // module.exports.getAddressCoordinate = async (address) => {
// //     const apiKey = process.env.GOOGLE_MAPS_API;
// //     const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

// //     try {
// //         const response = await axios.get(url);
// //         if (response.data.status.code === 200) {
// //             const location = response.data.results[0].geometry;
// //             return {
// //                 ltd: location.lat,
// //                 lng: location.lng
// //             };
// //         } else {
// //             throw new Error('Unable to fetch coordinates');
// //         }
// //     } catch (error) {
// //         console.error("Error in getAddressCoordinate:", error.message);
// //         throw new Error('Failed to fetch address coordinates');
// //     }
// // };




// module.exports.getAddressCoordinate = async (address) => {
//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status.code === 200) {
//             const location = response.data.results[0].geometry;
//             return {
//                 lat: location.lat,
//                 lng: location.lng
//             };
//         } else {
//             throw new Error('Unable to fetch coordinates');
//         }
//     } catch (error) {
//         console.error("Error in getAddressCoordinate:", error.message);
//         throw new Error('Failed to fetch address coordinates');
//     }
// };
// // Get distance and time between origin and destination using OpenRouteService API
// module.exports.getDistanceTime = async (origin, destination) => {
//     if (!origin || !destination) {
//         throw new Error('Origin and destination are required');
//     }

//     const apiKey = process.env.ORS_API_KEY;

//     const getCoords = async (place) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
//                 params: { q: place, format: 'json', limit: 1 },
//                 headers: { 'User-Agent': 'uber-clone/1.0' }
//             });

//             if (!response.data || response.data.length === 0) {
//                 throw new Error(`Location not found: ${place}`);
//             }

//             const { lat, lon } = response.data[0];
//             return [parseFloat(lon), parseFloat(lat)];
//         } catch (err) {
//             console.error(`Error fetching coordinates for ${place}:`, err.message);
//             throw new Error(`Error fetching coordinates for ${place}`);
//         }
//     };

//     const formatDistance = (meters) => meters >= 1000
//         ? `${(meters / 1000).toFixed(1)} km`
//         : `${meters.toFixed(0)} m`;

//     const formatDuration = (seconds) => {
//         const hrs = Math.floor(seconds / 3600);
//         const mins = Math.floor((seconds % 3600) / 60);
//         return hrs > 0
//             ? `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`
//             : `${mins} min${mins !== 1 ? 's' : ''}`;
//     };

//     try {
//         const [originCoords, destinationCoords] = await Promise.all([
//             getCoords(origin),
//             getCoords(destination)
//         ]);

//         const orsUrl = `https://api.openrouteservice.org/v2/matrix/driving-car`;
//         const matrixResponse = await axios.post(orsUrl, {
//             locations: [originCoords, destinationCoords],
//             metrics: ['distance', 'duration']
//         }, {
//             headers: {
//                 'Authorization': apiKey,
//                 'Content-Type': 'application/json'
//             }
//         });

//         const distance = matrixResponse.data.distances[0][1]; // meters
//         const duration = matrixResponse.data.durations[0][1]; // seconds

//         return {
//             distance: {
//                 value: distance,
//                 text: formatDistance(distance)
//             },
//             duration: {
//                 value: duration,
//                 text: formatDuration(duration)
//             }
//         };
//     } catch (err) {
//         console.error("Error in getDistanceTime:", err.message);
//         throw new Error('Failed to fetch distance and time');
//     }
// };

// // Get autocomplete suggestions for a given input using OpenRouteService API
// module.exports.getAutoCompleteSuggestions = async (input) => {
//     if (!input) {
//         throw new Error('Input query is required');
//     }

//     const apiKey = process.env.ORS_API_KEY;

//     try {
//         const url = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(input)}`;
//         const response = await axios.get(url, {
//             headers: { 'Authorization': apiKey }
//         });

//         if (response.data.features && response.data.features.length > 0) {
//             return response.data.features.map(feature => feature.properties.label).filter(value => value);
//         } else {
//             throw new Error('No suggestions found');
//         }
//     } catch (err) {
//         console.error("Error in getAutoCompleteSuggestions:", err.message);
//         throw new Error('Failed to fetch autocomplete suggestions');
//     }
// };

// // 🔥 Updated: Get captains in the given radius using geo-spatial query
// module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
//     if (!ltd || !lng || !radius) {
//         throw new Error('Latitude, longitude, and radius are required');
//     }

//     try {
//         const captains = await captainModel.find({
//             'location.type': 'Point', // Make sure location type is 'Point'
//             'location.coordinates': { $exists: true, $ne: [] }, // Coordinates must exist and not empty
//             location: {
//                 $geoWithin: {
//                     $centerSphere: [[lng, ltd], radius / 6371] // Radius in km
//                 }
//             }
//         });
//         return captains;
//     } catch (err) {
//         console.error("Error in getCaptainsInTheRadius:", err.message);
//         throw new Error('Failed to fetch captains within radius');
//     }
// };
