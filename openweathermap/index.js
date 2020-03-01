"use strict";

const axios = require("axios");
const express = require("express");

// Constants
const PORT = 5050;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", async (req, res) => {
  let weather = await axios.get("https://api.openweathermap.org/data/2.5/weather");
  res.send(weather.data);
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
