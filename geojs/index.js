"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = 4040;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", async (req, res) => {
  console.log(req);
  let geo_data = await axios.get(`https://get.geojs.io/v1/ip/geo/${req.query.ip}.json`);
  console.log(geo_data);
  res.send(geo_data);
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
