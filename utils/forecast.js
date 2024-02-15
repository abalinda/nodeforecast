const request = require('request');
const fs = require('fs');
const chalk = require('chalk');



//get weather forecast from WeatherStack API of the city (lat,lon) passed as argument and write it at weather.json
function forecast(callback, data) {
    console.log('forecast.js is working...');
    const qs = {
        access_key: process.env.weatherStackApi,
        query: data[1] + "," + data[0],
    };
    const url = "http://api.weatherstack.com/current";
    request({ url, json: true, qs }, (error, response, body) => {
        if (error) {
            callback(error, null);
        } else if (response.statusCode !== 200) {
            callback(null, error);
        } else {
            try {
                const filePathWeather = require('path').resolve(__dirname, '../jsonFiles/weather.json');
                fs.writeFileSync(filePathWeather, JSON.stringify(response));
                //if hot
                if (body.current.temperature > 20) {
                    console.log(("Current temperature at " + chalk.rgb(255, 127, 80).bold.underline(body.location.name + ', ' + body.location.country) + " is " + chalk.rgb(255, 127, 80).bold.underline(body.current.temperature + "°C") + " and it's " + chalk.rgb(255, 127, 80).underline(body.current.weather_descriptions[0].toLowerCase())));
                }
                // if cold
                else {
                    console.log(("Current temperature at " + chalk.rgb(168, 218, 255).bold.underline(body.location.name + ', ' + body.location.country) + " is " + chalk.rgb(168, 218, 255).bold.underline(body.current.temperature + "°C") + " and it's " + chalk.rgb(168, 218, 255).underline(body.current.weather_descriptions[0].toLowerCase())));
                }
            } catch (error) {
                callback(error, null);
            }
        }
        callback(null, body);
    })
};

module.exports = {
    forecast: forecast,
};
