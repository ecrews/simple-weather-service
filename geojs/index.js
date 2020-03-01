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
  let geo = await axios.get(`https://get.geojs.io/v1/ip/geo/${req.query.ip}.json`);
  res.send(geo.data);
  } catch (err) {
    next(err);
  }
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
