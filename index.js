const app = require("./app");
const http = require("http");
const config = require("./src/config/config");
const logger = require("./src/config/logger");
const mongoose = require("mongoose")

const server = http.createServer(app);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
