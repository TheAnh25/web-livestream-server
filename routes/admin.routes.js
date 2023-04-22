const express = require('express')
const adminRoute = express.Router()

const { adminController } = require('../controllers')

adminRoute.get('/test', adminController.test)
adminRoute.get('/index', adminController.dataIndex)

module.exports = adminRoute
