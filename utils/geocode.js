const request = require('request');
const fs = require('fs');


//get lat and long from mapbox API of the city passed as argument and write it at mapbox.json
function getLonLat(callback, city) {
    console.log('geocode.js is working...');
    const access_token = process.env.mapboxAccessToken;
    const qs = {
        access_token: access_token,
        limit: '1',
    };
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json`;
    request({ url, qs, json: true }, (error, response, body) => {
        if (error || (body.features && body.features.length === 0)) {
            callback(error, null);
        } else {
            const coordinates = {
                lon: body.features[0].center[0],
                lat: body.features[0].center[1],
                location: body.features[0].place_name
            }
            try {
                const filePathMapbox = require('path').resolve(__dirname, '../jsonFiles/mapbox.json');
                const filePathCoordinates = require('path').resolve(__dirname, '../jsonFiles/latLong2.json');
                fs.writeFileSync(filePathMapbox, JSON.stringify(response.body));
                fs.writeFileSync(filePathCoordinates, JSON.stringify(coordinates));
                console.log('saved coordinates and city details in json');
                callback(null, coordinates)
            } catch (writeError) {
                console.error('Error writing to file:', writeError);
                callback(writeError, null);
            }
        }
    });
};


module.exports = {
    getLonLat: getLonLat,
};
