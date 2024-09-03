const express = require("express");
const app = express();

app.get("/", function (req, res, next) {
  res.status(200).sendFile(__dirname + "/index.html");
});

app.get("/portfolio", function (req, res, next) {
  res.status(200).sendFile(__dirname + "/portfolio.html");
});

app.get("*", function (req, res, next) {
  res.status(404).sendFile(__dirname + "/404.html");
});

app.listen(8000, function () {
  console.log("== Server is listening on port 8000");
});
