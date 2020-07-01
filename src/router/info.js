const { Router } = require("express");
const data = require("../../persons.json");

const infoRouter = new Router();

const getAll = async (req, res, next) => {
  try {
    res.send(
      `Phonebook has info for ${data.length} people <br/> ${Date()}`
    );
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

infoRouter.get("/", getAll);

module.exports = infoRouter;
