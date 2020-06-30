const { Router } = require("express");
const fs = require("fs");
const data = require("../../../persons.json");

const personsRouter = new Router();

const getAll = async (req, res, next) => {
  try {
    res.json(data);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const person = data.find((person) => person.id === id);
    res.json(person);
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
    if (data.find((person) => person.name === req.body.name)) {
      res.send(400, { error: `name must be unique` });
    } else {
      const newPerson = [
        {
          name: req.body.name,
          number: req.body.number,
          id: randomId,
        },
      ];

      const newData = [...data].concat(newPerson);
      const jsonStr = JSON.stringify(newData, null, 2);
      fs.writeFile("persons.json", jsonStr, finished);
      function finished(err) {
        if (err) {
          console.log("Error: " + err);
        } else {
          console.log("writeFile finished whitout erros...");
        }
      }
      console.log(newData);
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
