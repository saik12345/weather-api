const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
  // console.log(req.body.cityName);
});
app.post("/", function (req, res) {
  let cityName = req.body.cityName;
  // let cityNameLower= cityName.toUpperCase();
  let apiKey = "be6bafa08940140f53c10f2882e7d2ab";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  https.get(url, function (response) {
    console.log(response.statusCode);
    if (response.statusCode < 200 || response.statusCode > 299) {
      res.render("error", {});
    } else {
      response.on("data", function (data) {
        //  console.log(Object.values(JSON.parse(data)));
        const cityObject = JSON.parse(data);
        const cityTemp = cityObject.main.temp;
        const cityPressure = cityObject.main.pressure;
        const weatherDes = cityObject.weather[0].main;
        const cityHumidity = cityObject.main.humidity;
        const cityWind = cityObject.wind.speed;
        const visibility = cityObject.visibility;
        const cityWeatherIcon = `https://openweathermap.org/img/wn/${cityObject.weather[0].icon}@2x.png`;
        console.log(weatherDes);
        res.render("weather", {
          weatherImage: cityWeatherIcon,
          cityNameejs: cityName.toUpperCase(),
          weatherDescription: weatherDes,
          cityTemperature: cityTemp,
          weatherPressure: cityPressure,
          windSpeed: cityWind,
          weatherVisibility: visibility,
          weatherHumidity: cityHumidity,
        });
      });
    }
    console.log(cityName);
  });
});
app.get("/error", function (req, res) {
  res.render("error");
});
app.post("/error", function (req, res) {
  res.redirect("/");
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server running"));
