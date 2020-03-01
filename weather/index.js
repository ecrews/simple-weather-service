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
app.get("/", async (req, res, next) => {
  try {
    let geo = await axios.get(
      `${GEOJS_URL}?ip=${req.header("x-forwarded-for")}`
    );
    let weather = await axios.get(
      `${OPENWEATHERMAP_URL}?lat=${geo.data.latitude}&lon=${geo.data.longitude}`
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
  console.error(err);
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(err.message);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
