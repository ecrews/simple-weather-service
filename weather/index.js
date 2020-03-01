"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = parseInt(process.env.PORT);
const HOST = "0.0.0.0";
const GEOJS_SERVICE_HOST = process.env.GEOJS_SERVICE_HOST;
const OPENWEATHERMAP_SERVICE_HOST = process.env.OPENWEATHERMAP_SERVICE_HOST;

// App
const app = express();
app.get("/", async (req, res, next) => {
  try {
    let geo = await axios.get(
      `${GEOJS_SERVICE_HOST}?ip=${req.header("x-forwarded-for")}`
    );
    let weather = await axios.get(
      `${OPENWEATHERMAP_SERVICE_HOST}?lat=${geo.data.latitude}&lon=${geo.data.longitude}`
    );
    res.send(weather.data);
  } catch (err) {
    next(err);
  }
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
  console.log(err.toJSON());
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(err.message);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
