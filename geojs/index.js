/*
 * Client proxy for GeoJS.
 */

"use strict";

const axios = require("axios");
const express = require("express");
require("express-async-errors");

// Constants
const PORT = parseInt(process.env.PORT);
const HOST = "0.0.0.0";

// App
const app = express();

// Set GeoJS API base URL
const instance = axios.create({
  baseURL: "https://get.geojs.io/v1"
});

/*
 * Use Geo endpoint to get geographical information about IP.
 * https://www.geojs.io/docs/v1/endpoints/geo/
 */
app.get("/", async (req, res, next) => {
  try {
    let geo_res = await instance.get(`/ip/geo/${req.query.ip}.json`);
    res.send(geo_res.data);
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
