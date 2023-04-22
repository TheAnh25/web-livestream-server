const express = require('express')

const {isAuthenticated, authorizeRoles} = require('../middleware/auth.js')
const streamController = require('../controllers/stream.controller.js')
const streamRoute = express.Router()

streamRoute.post(
  '/createstream',
  isAuthenticated,
  streamController.createStream
)

// Route to get stream by room id
streamRoute.get(
  '/find/:room_id',
  isAuthenticated,
  streamController.getStreamByRoomId
)
// Route to get all streams
streamRoute.get(
  '/all-stream',
  isAuthenticated,
  streamController.getAllStreams
)


module.exports = streamRoute
