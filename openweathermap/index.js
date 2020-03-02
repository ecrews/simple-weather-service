/*
 * Client proxy for OpenWeatherMap.
 */

"use strict";

const axios = require("axios");
const express = require("express");
require("express-async-errors");

// Constants
const PORT = parseInt(process.env.PORT);
const HOST = "0.0.0.0";
const API_KEY = process.env.API_KEY;

// App
const app = express();

// Set OpenWeatherMap API base URL
const instance = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5"
});

/*
 * Append API key to query params for each request.
 * https://openweathermap.org/appid#use
 */
instance.interceptors.request.use(function(config) {
  config.params.appid = API_KEY;
  return config;
});

/*
 * Use Weather endpoint to get current weather data for location by
 * geographical coordinates.
 * https://openweathermap.org/current#geo
 */
app.get("/", async (req, res, next) => {
  try {
    let weather_res = await instance.get("/weather", {
      params: {
        lat: req.query.lat,
        lon: req.query.lon
      }
    });
    res.send(weather_res.data);
  } catch (err) {
    next(err);
  }
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

// Catch-all for undefined routes
app.get("*", function(req, res, next) {
  let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// Generic error handler
app.use(function(err, req, res, next) {
  if (err.isAxiosError) {
    err = err.toJSON();
  }
  console.log(err);
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(err.message);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
