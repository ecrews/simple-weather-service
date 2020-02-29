"use strict";

const express = require("express");

// Constants
const PORT = 3030;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  console.log(req.headers);
  res.send("I'm the main container!");
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
