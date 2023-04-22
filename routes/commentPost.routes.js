const express = require('express')
const commentRoute = express.Router()
const commentPost = require('../controllers/commentPost.controller.js')
const {isAuthenticated} = require("../middleware/auth");


commentRoute.get('/comments-by-post-id/:postId', commentPost.getCommentsByIdPost);
commentRoute.post('/:postId', isAuthenticated, commentPost.create);
commentRoute.delete('/:postId', isAuthenticated, commentPost.delete);

module.exports = commentRoute