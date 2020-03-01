"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = parseInt(process.env.PORT);
const HOST = "0.0.0.0";
const API_KEY = process.env.API_KEY

// App
const app = express();
app.get("/", async (req, res) => {
  let weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${API_KEY}`);
  res.send(weather.data);
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
