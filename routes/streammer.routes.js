const express = require('express')
const streammerRouter = express.Router()
const { isAuthenticated, authorizeRoles } = require('../middleware/auth.js')
const streammerController = require('../controllers/streammer.controller.js')

streammerRouter.get('/', streammerController.getAllStreammer)
streammerRouter.get('/:id', streammerController.getDetailsById)

module.exports = streammerRouter