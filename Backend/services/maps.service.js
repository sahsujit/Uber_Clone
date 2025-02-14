// const axios = require('axios');
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
//         console.error(error);
//         throw error;
//     }
// }


// const geocode = async (place) => {
//     const apiKey = process.env.HERE_MAPS_API; // Ensure your HERE API Key is in the environment variables
//     const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(place)}&apiKey=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         const location = response.data.items[0];  // Get the first result

//         if (location) {
//             return {
//                 lat: location.position.lat,
//                 lng: location.position.lng
//             };
//         } else {
//             throw new Error(`Unable to geocode the place: ${place}`);
//         }
//     } catch (err) {
//         console.error('Geocoding error:', err.message);
//         throw err;
//     }
// };

// module.exports.getDistanceTimeFromNames = async (origin, destination) => {
//     if (!origin || !destination) {
//         throw new Error('Origin and destination are required');
//     }

//     try {
//         // Get the coordinates for both origin and destination
//         const originCoordinates = await geocode(origin);
//         const destinationCoordinates = await geocode(destination);

//         if (!originCoordinates || !destinationCoordinates) {
//             throw new Error('Unable to get coordinates for one or both places.');
//         }

//         // Now call the existing getDistanceTime with the coordinates
//         return await module.exports.getDistanceTime(
//             `${originCoordinates.lat},${originCoordinates.lng}`, 
//             `${destinationCoordinates.lat},${destinationCoordinates.lng}`
//         );
//     } catch (err) {
//         console.error('Error in distance and time calculation:', err.message);
//         throw err;
//     }
// };










const axios = require('axios');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status.code === 200 && response.data.results.length > 0) {
            const location = response.data.results[0].geometry;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error('Error in getAddressCoordinate:', error.message);
        throw error;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    // Assume this function is similar to the one you were working with for fetching distance and time
    try {
        // Distance calculation logic here
        return { distance: 1000, duration: 3600 }; // Example response
    } catch (error) {
        console.error('Error in getDistanceTime:', error.message);
        throw error;
    }
};
