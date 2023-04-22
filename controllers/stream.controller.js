const { createStream } = require('rotating-file-stream')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const { Stream, User, Streammer } = require('../models')
const cloudinary = require('cloudinary')

const streamController = {}

// Create a new stream
streamController.createStream = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).lean()
  if (!user) next(new ErrorHandler('not found user', 404))

  if (!user.isStreammer) return next(new ErrorHandler('Forbidden', 403))

  const streamer = await Streammer.findOne({ idUser: user._id }).lean()

  if (!streamer) next(new ErrorHandler('not found user', 404))

  if (!req.body.thumbnail) next(new ErrorHandler('Thumbnail is required', 422))

  const resultCloudThumbnail = await cloudinary.v2.uploader.upload(
    req.body.thumbnail,
    {
      folder: 'streamThumbnail',
    }
  )

  req.body.thumbnail = {
    public_id: resultCloudThumbnail.public_id,
    url: resultCloudThumbnail.url,
  }

  req.body.avatarStreamer = {
    public_id: streamer.imgs.public_id,
    url: streamer.imgs.url,
  }

  // Create a new stream object
  const stream = await new Stream({
    ...req.body,
    status: true,
  })

  req.stream = await stream.save()
  res
    .status(200)
    .json({
      stream: req.stream,
      message: 'create stream successfully',
      success: true,
    })
})

// Get stream by room_id
streamController.getStreamByRoomId = catchAsyncError(async (req, res, next) => {
  const { room_id } = req.params
  const stream = await Stream.findOne({ room_id }).lean()
  if (!stream) {
    return next(new ErrorHandler('Stream not found', 404))
  }
  res.status(200).json({
    success: true,
    data: stream,
  })
})

// Get all streams
streamController.getAllStreams = catchAsyncError(async (req, res, next) => {
  const streams = await Stream.find().lean()
  res.status(200).json({
    success: true,
    data: streams,
  })
})

module.exports = streamController
