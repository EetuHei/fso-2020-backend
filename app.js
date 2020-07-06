const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const httpError = require("http-errors");
const commonResponse = require("./src/config/utils");
const middleware = require("./src/config/middleware");

const personsRouter = require("./src/router/persons");
const infoRouter = require("./src/router/info");
const blogRouter = require("./src/router/blog");
const app = express();

morgan.token("type", function (request) {
  return JSON.stringify(request.body);
});
app.use([
  cors(),
  commonResponse,
  express.urlencoded({ extended: true }),
  express.json(),
  express.static("build"),
  morgan(":method :url :status :res[content-length] - :response-time ms :type"),
]);

app.use("/api/v1/", personsRouter);
app.use("/", infoRouter);
app.use("/api/v1/", blogRouter);

app.use(
  middleware.requestLogger,
  middleware.unknownEndpoint,
  middleware.errorHandler
);

app.use((err, req, res, next) => {
  console.error(err);

  if (!err.status) {
    const serverError = httpError(500);
    res.error(serverError.status, serverError);
  } else {
    res.error(err.status, err);
  }

  return next(err);
});

module.exports = app;
