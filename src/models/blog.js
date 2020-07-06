const mongoose = require("mongoose");
const logger = require("../config/logger");
const config = require("../config/config");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

logger.info("connecting to blogs mongodb", config.MONGODB_URI);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

module.exports = mongoose.model("Blog", blogSchema);
