const axios = require('axios');
module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status.code === 200) {
            const location = response.data.results[0].geometry;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const geocode = async (place) => {
    const apiKey = process.env.HERE_MAPS_API; // Ensure your HERE API Key is in the environment variables
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(place)}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const location = response.data.items[0];  // Get the first result

        if (location) {
            return {
                lat: location.position.lat,
                lng: location.position.lng
            };
        } else {
            throw new Error(`Unable to geocode the place: ${place}`);
        }
    } catch (err) {
        console.error('Geocoding error:', err.message);
        throw err;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // Get the coordinates for both origin and destination
        const originCoordinates = await geocode(origin);
        const destinationCoordinates = await geocode(destination);

        if (!originCoordinates || !destinationCoordinates) {
            throw new Error('Unable to get coordinates for one or both places.');
        }

        // Now call the existing getDistanceTime with the coordinates
        return (
            `${originCoordinates.lat},${originCoordinates.lng}`, 
            `${destinationCoordinates.lat},${destinationCoordinates.lng}`
        );
    } catch (err) {
        console.error('Error in distance and time calculation:', err.message);
        throw err;
    }
};









