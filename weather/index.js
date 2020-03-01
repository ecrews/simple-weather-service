"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = 3030;
const HOST = "0.0.0.0";
const GEOJS_HOST = process.env.GEOJS_HOST
const OPENWEATHERMAP_HOST = process.env.OPENWEATHERMAP_HOST

// App
const app = express();
app.get("/", (req, res) => {
  let geo_data = await axios.get(`${GEOJS_HOST}?ip=${req.header('x-forwarded-for')}`);
  let weather_data = await axios.get(`${OPENWEATHERMAP_HOST}?lat=${geo_data.latitude}&lon=${geo_data.longitude}`);
  res.send(weather_data);
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
