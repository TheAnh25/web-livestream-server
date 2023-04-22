const express = require('express');
const reportPostController = require("../controllers/reportPost.controller");
const {isAuthenticated, authorizeRoles} = require('../middleware/auth')
const reportPostRoute = express.Router()

reportPostRoute.get('/', reportPostController.getAllReportPost)
reportPostRoute.get('/:id', reportPostController.getByIdPost)
reportPostRoute.post('/:idPost', isAuthenticated, reportPostController.create)

module.exports = reportPostRoute