const express = require('express')
const {reportPostCategoryController} = require('../controllers')
const {isAuthenticated, authorizeRoles} = require('../middleware/auth')
const reportPostCategoryRoute = express.Router()

reportPostCategoryRoute.get('/', reportPostCategoryController.getAll)
reportPostCategoryRoute.get('/:id', reportPostCategoryController.getById)
reportPostCategoryRoute.post('/', isAuthenticated, authorizeRoles('admin'), reportPostCategoryController.create)
reportPostCategoryRoute.delete('/:id', isAuthenticated, authorizeRoles('admin'), reportPostCategoryController.delete)

module.exports = reportPostCategoryRoute
