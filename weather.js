const express = require('express');

const https = require('https');
const { dirname } = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/weather.html');
});

app.post('/', (request, response) => {
  const query = request.body.cityName;
  const unit = 'metric';
  const apiKey = '8e694bcaea608767af846c7d3d65fb11';
  const url = ` https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;
  https.get(url, (res) => {

    // handling the JSON data form the external server
    res.on('data', (data) => {
      const weatherData = JSON.parse(data);  // convert the string in JSON data
      // JSON.stringify(weatherData)   // Convert the JSON data into a string.
      const weatherDescription = weatherData.weather[0].description;

      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const imgUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      response.write(
        `<p>The Condition of Weather is ${weatherDescription}.</p>`
      );
      response.write(
        `<h2>The temparature of ${weatherData.name} is now ${temp}</h2>`
      );

      response.write(`<img src="${imgUrl}" alt="">`);

      response.send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
