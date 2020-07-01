const { Router } = require("express");
const fs = require("fs");
const data = require("../../persons.json");

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
      data: `User was successfully deleted from the server`,
    });
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const generateId = () => {
  const maxId =
    data.length > 0 ? Math.max(...data.map((person) => person.id)) : 0;
  return maxId + 1;
};

const addPerson = async (req, res, next) => {
  try {
    if (data.find((person) => person.name === req.body.name)) {
      res.send(400, { error: `name must be unique` });
    } else {
      const newPerson = [
        {
          name: req.body.name,
          number: req.body.number,
          id: generateId(),
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
      res.json(newData);
    }
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
