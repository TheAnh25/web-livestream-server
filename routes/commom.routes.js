const express = require('express')

const commonController = require('../controllers/commom.controller.js')

const commonRoute = express.Router()

commonRoute.get('/getCurrentDateTime', commonController.getCurrentDateTime)
commonRoute.get('/getCurrentDate', commonController.getCurrentDate)
commonRoute.get('/getDataIndex', commonController.getDataIndex)

module.exports = commonRoute
