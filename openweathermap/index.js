"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = parseInt(process.env.PORT);
const HOST = "0.0.0.0";
const API_KEY = process.env.API_KEY;

// App
const app = express();

axios.interceptors.request.use(function(config) {
  config.params.appid = API_KEY;
  return config;
});

app.get("/", async (req, res) => {
  let weather = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat: req.query.lat,
        lon: req.query.lon
      }
    }
  );
  res.send(weather.data);
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.get("*", function(req, res, next) {
  let err = new Error(
    `${req.header("x-forwarded-for")} tried to reach ${req.originalUrl}`
  );
  err.statusCode = 404;
  next(err);
});

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
