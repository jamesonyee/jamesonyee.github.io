const express = require("express");
const app = express();

app.get("/", function (req, res, next) {
  res.status(200).sendFile(__dirname + "/public/index.html");
});

app.get("/portfolio", function (req, res, next) {
  res.status(200).sendFile(__dirname + "/public/portfolio.html");
});

app.get("*", function (req, res, next) {
  res.status(404).sendFile(__dirname + "/public/404.html");
});

app.listen(8000, function () {
  console.log("== Server is listening on port 8000");
});
