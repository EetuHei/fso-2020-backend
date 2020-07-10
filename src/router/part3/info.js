const { Router } = require('express')
const Persons = require('../../models/part3/persons')

const infoRouter = new Router()

const getAll = async (req, res, next) => {
  try {
    Persons.find({}).then((result) => {
      res.send(
        `Phonebook has info for ${result.length} people <br/> ${Date()}`
      )
    })
  } catch (e) {
    console.error(e)
    return next(e)
  }
}

infoRouter.get('/info', getAll)

module.exports = infoRouter
