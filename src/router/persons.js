const { Router } = require('express')
const Persons = require('../models/persons')

const personsRouter = new Router()

const getAll = async (req, res, next) => {
  try {
    await Persons.find({}).then((result) => {
      res.json(result)
    })
  } catch (e) {
    console.error(e)
    return next(e)
  }
}

const getById = async (req, res, next) => {
  try {
    await Persons.findOne({ _id: req.params.id }).then((person) =>
      res.json(person)
    )
  } catch (e) {
    console.error(e)
    return next(e)
  }
}

const deleteById = async (req, res, next) => {
  try {
    await Persons.deleteOne({ _id: req.params.id }).then(
      res
        .status(200)
        .send('data: User was successfully deleted from the server')
    )
  } catch (e) {
    console.error(e)
    return next(e)
  }
}

const addPerson = async (req, res, next) => {
  const body = req.body

  try {
    const person = new Persons({
      name: body.name,
      number: body.number,
    })
    await person.save().then((savedPerson) => res.json(savedPerson))
  } catch (e) {
    console.error(e)
    if (e.message) {
      res.send(e)
    } else {
      return next(e)
    }
  }
}

const update = async (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  }

  try {
    await Persons.findByIdAndUpdate(
      { _id: req.params.id, new: true },
      person
    ).then((updatePerson) => {
      res.json(updatePerson)
    })
  } catch (e) {
    console.error(e)
    return next(e)
  }
}

personsRouter.get('/persons', getAll)
personsRouter.get('/persons/:id', getById)
personsRouter.delete('/persons/delete/:id/', deleteById)
personsRouter.post('/persons/add', addPerson)
personsRouter.put('/persons/:id', update)

module.exports = personsRouter
