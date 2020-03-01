"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = parseInt(process.env.PORT);
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", async (req, res, next) => {
  try {
    let geo = await axios.get(`https://get.geojs.io/v1/ip/geo/geo.json`, {
      params: {
        ip: req.query.ip
      }
    });
    res.send(geo.data);
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
