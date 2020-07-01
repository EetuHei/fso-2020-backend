const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const personsRouter = require("./src/router/persons");
const infoRouter = require("./src/router/info");
const app = express();

morgan.token("type", function (request) {
  return JSON.stringify(request.body);
});
app.use([
  cors(),
  express.urlencoded({ extended: true }),
  express.json(),
  express.static("build"),
  morgan(":method :url :status :res[content-length] - :response-time ms :type"),
]);

app.use("/api/v1/", personsRouter);
app.use("/", infoRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
