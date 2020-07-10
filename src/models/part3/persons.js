const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const config = require("../../config/config");
const logger = require("../../config/logger");

logger.info("connecting to persons mongodb", config.MONGODB_URI);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    minlength: 6,
  },
  versionKey: false,
});


personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Persons", personSchema);
