/* Make API call using the apiKey and location variables 
to return a current weather info (temperature and weather description) for the given location*/
const fs = require('fs');
const coordinates = require('./utils/geocode')
const mapboxJson = require('./jsonFiles/mapbox.json');
const forecast = require('./utils/forecast');
const readline = require('readline');

function getUserInput(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("What's the city you wish to check, sailor? ", (answer) => {
        if (answer === ' ') {
            console.log('Please enter a valid city name');
            rl.close();
            getUserInput((city) => {
                connectToApi(city);
            })
        } else {
            console.log(`Ahoy, let's check the weather at ${answer}!`);
            callback(answer)
            rl.close();
        }
    });
};

function handleWeatherDataIfError(error, data) {
    if (error) {
        console.log(error, 'Error1');
    }
    else if (data === null) {
        console.log('Error1: No data found for the searched place. Please search again using another location')
    }
};
function connectToApi(city) {
    coordinates.getLonLat((error, data) => {
        if (error || data === null) {
            console.log('Error: No data found for the searched place. Please search again using another location');
        }
        else {
            console.log('Location retrived successfully for ' + data.location)
            forecast.forecast(handleWeatherDataIfError, [data.lon, data.lat]);
        }
    }, city)
};

getUserInput((city) => {
    connectToApi(city);
})