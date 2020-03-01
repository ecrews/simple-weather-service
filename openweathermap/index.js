"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = 5050;
const HOST = "0.0.0.0";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// App
const app = express();
app.get("/", async (req, res) => {
  console.log(req);
  let weather = await axios.get(`api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${OPENWEATHER_API_KEY}`);
  res.send(weather.data);
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
