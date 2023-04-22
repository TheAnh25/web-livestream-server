const express = require('express')
const categoryPostRoute = express.Router()
const { isAuthenticated, authorizeRoles } = require('../middleware/auth')
const categoryPostController = require('../controllers/categoryPost.controller')

categoryPostRoute.get(
  '/categoriesPosts',
  categoryPostController.getCategoriesPost
)

categoryPostRoute.get('/:id', categoryPostController.getCategpryPostById)
categoryPostRoute.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  categoryPostController.craete
)

categoryPostRoute.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  categoryPostController.update
)

module.exports = categoryPostRoute
