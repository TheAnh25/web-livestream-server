const express = require('express')
const postRoute = express.Router()
const postController = require('../controllers/post.controller')
const { isAuthenticated } = require('../middleware/auth')

postRoute.get('/', postController.getAllPost)
postRoute.get('/posts/me', isAuthenticated, postController.getListMe)
postRoute.post('/', isAuthenticated, postController.createPost)
postRoute.get('/:id', postController.getPostById)
postRoute.put('/:id', isAuthenticated, postController.updatePost)
postRoute.delete('/:id', isAuthenticated, postController.deletePost)

module.exports = postRoute
