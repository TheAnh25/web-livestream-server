const categoryStreamController = require('../controllers/categoryStream.controller.js')
const { isAuthenticated, authorizeRoles } = require('../middleware/auth.js')
const express = require('express')
const categoryStreamRouter = express.Router()

categoryStreamRouter.get('/', categoryStreamController.getCategoriesStreammer)
categoryStreamRouter.get('/:id', categoryStreamController.getCategoryById)
categoryStreamRouter.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  categoryStreamController.create
)
categoryStreamRouter.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  categoryStreamController.updateCategory
)

module.exports = categoryStreamRouter
