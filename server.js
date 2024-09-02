const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(8000, function () {
  console.log("== Server is listening on port 8000");
});
