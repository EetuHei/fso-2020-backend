const app = require("./app");
const http = require("http");
const config = require("./src/config/config");
const logger = require("./src/config/logger");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
