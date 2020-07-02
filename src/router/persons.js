const { Router } = require("express");
const fs = require("fs");
const Persons = require("../models/persons");

const personsRouter = new Router();

const getAll = async (req, res, next) => {
  try {
    await Persons.find({}).then((result) => {
      res.json(result);
    });
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    await Persons.findOne({ _id: req.params.id }).then((person) =>
      res.json(person.toJSON())
    );
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const person = data.findIndex((person) => person.id === id);
    if (person > -1) {
      data.splice(person, 1);
    }
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFile("persons.json", jsonStr, finished);
    function finished(err) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("writeFile finished whitout erros...");
      }
    }
    res.send(200, {
      data: `User was successfully deleted from the server`,
    });
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const addPerson = async (req, res, next) => {
  try {
    const person = new Persons({
      name: req.body.name,
      number: req.body.number,
    });
    await person.save().then((savedPerson) => res.json(savedPerson.toJSON()));
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const update = async (req, res, next) => {
  const findPerson = data.find((person) => person.name === req.body.name);
  try {
    if (findPerson) {
      findPerson.number = req.body.number;

      const jsonStr = JSON.stringify(data, null, 2);
      fs.writeFile("persons.json", jsonStr, finished);
      function finished(err) {
        if (err) {
          console.log("Error: " + err);
        } else {
          console.log("writeFile finished whitout erros...");
        }
      }
      res.json(data);
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
personsRouter.put("/persons/:id", update);

module.exports = personsRouter;
