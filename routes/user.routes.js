const express = require('express')

const {isAuthenticated, authorizeRoles} = require('../middleware/auth.js')
const userController = require('../controllers/user.controller.js')
const {streamerController} = require("../controllers");
const userRoute = express.Router()

userRoute.post('/register', userController.register)
userRoute.post('/unOrAddFollow', isAuthenticated, streamerController.addOrUnFollower)
userRoute.post('/login', userController.login)
userRoute.get('/logout', userController.logout)
userRoute.post('/change-password', userController.forgotPassword)
userRoute.put('/password/reset/:token', userController.resetPassword)
userRoute.get('/me', isAuthenticated, userController.getUserDetails)
userRoute.get('/streammer/me', isAuthenticated, userController.getStreammer)
userRoute.put(
  '/streammer/me',
  isAuthenticated,
  userController.updateProfileStreammer
)
userRoute.put(
  '/password/update',
  isAuthenticated,
  userController.updatePassword
)

userRoute.put('/me/update', isAuthenticated, userController.updateProfile)
userRoute.get(
  '/admin/users',
  isAuthenticated,
  authorizeRoles('admin'),
  userController.getAllUser
)

userRoute.get(
  '/admin/user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  userController.getUserDetails
)

userRoute.post(
  '/register/streammer/new',
  isAuthenticated,
  userController.registerStreammer
)

// userRoute.delete(
//   '/admin/user/:id',
//   isAuthenticated,
//   authorizeRoles('admin'),
//   userController.deleteUser
// )


module.exports = userRoute
