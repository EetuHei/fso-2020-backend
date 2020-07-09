const express = require("express");
const config = require("./src/config/config");
const logger = require("./src/config/logger");
const morgan = require("morgan");
const cors = require("cors");
const httpError = require("http-errors");
const commonResponse = require("./src/config/utils");
const middleware = require("./src/config/middleware");
require("express-async-errors");
const personsRouter = require("./src/router/persons");
const authRouter = require("./src/router/auth");
const infoRouter = require("./src/router/info");
const blogRouter = require("./src/router/blog");
const app = express();
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

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

app.use(middleware.requestLogger, middleware.tokenExtractor);

app.use("/api/v1/", personsRouter);
app.use("/", infoRouter);
app.use("/api/v1/", blogRouter);
app.use("/api/v1/", authRouter);

app.use(middleware.unknownEndpoint, middleware.errorHandler);

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
