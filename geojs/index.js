"use strict";

const express = require("express");

// Constants
const PORT = 4040;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  res.send("I'm the GeoJS ambassador container!");
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);