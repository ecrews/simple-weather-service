"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = 3030;
const HOST = "0.0.0.0";
const GEOJS_URL = "http://localhost:4040";
const OPENWEATHERMAP_URL = "http://localhost:5050";

// App
const app = express();
app.get("/", (req, res) => {
  let geo_data = await axios.get(`${GEOJS_URL}?ip=${req.header('x-forwarded-for')}`);
  let weather_data = await axios.get(`${OPENWEATHERMAP_URL}?lat=${geo_data.latitude}&lon=${geo_data.longitude}`);
  res.send(weather_data);
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
