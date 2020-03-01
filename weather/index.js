"use strict";

const axios = require("axios");
const express = require("express");
require("express-async-errors");

// Constants
const PORT = parseInt(process.env.PORT);
const HOST = "0.0.0.0";
const GEOJS_SERVICE_HOST = process.env.GEOJS_SERVICE_HOST;
const OPENWEATHERMAP_SERVICE_HOST = process.env.OPENWEATHERMAP_SERVICE_HOST;

// App
const app = express();
const instance = axios.create();

app.get("/", async (req, res, next) => {
  try {
    let geo_res = await instance.get(GEOJS_SERVICE_HOST, {
      params: { ip: req.header("x-forwarded-for") }
    });
    let weather_res = await instance.get(OPENWEATHERMAP_SERVICE_HOST, {
      params: {
        lat: geo_res.data.latitude,
        lon: geo_res.data.longitude
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
  let err = new Error(
    `${req.header("x-forwarded-for")} tried to reach ${req.originalUrl}`
  );
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
