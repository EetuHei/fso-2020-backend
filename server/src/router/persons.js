const { Router } = require("express");
const data = require("../persons.json");

const personsRouter = new Router();

const getAll = async (req, res, next) => {
  try {
    res.json(data.persons);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const person = data.persons.find((person) => person.id === id);
    res.json(person);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const person = data.persons.find((person) => person.id === id);
    delete person;
    res.data({
      data: `${person.name} was successfully deleted from the server`,
    });
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const addPerson = async (req, res, next) => {
  const randomId = Math.floor(Math.random() * Math.floor(100000));

  try {
    if (data.persons.find((person) => person.name === req.body.name)) {
      res.send(400, { error: `name must be unique` });
    } else {
      const newPerson = [
        {
          name: req.body.name,
          number: req.body.number,
          id: randomId,
        },
      ];
      const newData = [...data.persons].concat(newPerson);
      res.json(newData);
    }
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

personsRouter.get("/persons", getAll);
personsRouter.get("/persons/:id", getById);
personsRouter.delete("/persons/delete/:id/", deleteById);
personsRouter.post("/persons/add", addPerson);

module.exports = personsRouter;
