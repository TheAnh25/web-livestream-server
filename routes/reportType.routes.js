const express = require('express')
const reportTypeRoute = express.Router()
const { isAuthenticated, authorizeRoles } = require('../middleware/auth.js')

const reportTypeController = require('../controllers/reportType.controller.js')

reportTypeRoute.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  reportTypeController.create
)

reportTypeRoute.get(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  reportTypeController.getAllReportTypes
)

reportTypeRoute.get(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  reportTypeController.getReportTypeById
)

reportTypeRoute.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  reportTypeController.update
)

module.exports = reportTypeRoute
