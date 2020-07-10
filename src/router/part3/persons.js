const { Router } = require("express");
const Persons = require("../../models/part3/persons");

const personsRouter = new Router();

const getAll = async (req, res, next) => {
  const allPersons = await Persons.find({});
  res.json(allPersons).end();
};

const getById = async (req, res, next) => {
  const findPerson = await Persons.findOne({ _id: req.params.id });
  if (findPerson) {
    res.json(findPerson.toJSON());
  } else {
    res.status(404).end();
  }
};

const deleteById = async (req, res, next) => {
  await Persons.deleteOne({ _id: req.params.id });
  res.status(204).end();
};

const addPerson = async (req, res, next) => {
  const body = req.body;
  const person = new Persons({
    name: body.name,
    number: body.number,
  });
  const addPerson = await person.save();
  res.json(addPerson.toJSON()).end();
};

const update = async (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  const updatePerson = await Persons.findByIdAndUpdate(
    { _id: req.params.id, new: true },
    person
  );
  res.json(updatePerson.toJSON()).end();
};

personsRouter.get("/persons", getAll);
personsRouter.get("/persons/:id", getById);
personsRouter.delete("/persons/delete/:id/", deleteById);
personsRouter.post("/persons/add", addPerson);
personsRouter.put("/persons/:id", update);

module.exports = personsRouter;
