const {CommentPost, Post, User} = require("../models");
const cloudinary = require("cloudinary");

const catchAsyncErrors = require('../middleware/catchAsyncError.js')
const ErrorHandler = require('../utils/errorHandler.js')
const {logger} = require("../middleware/logger");
const commentPostController = {}

commentPostController.create = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).lean()
  if (!post) return next(new ErrorHandler('Post not found', 404))
  const user = await User.findById(req.user.id).lean()
  if (!user) return next(new ErrorHandler('not found user', 404))
  if (!user?.avatar) {
    req.body.imgs = undefined
  } else {

    req.body.imgs = {
      public_id: user.avatar.public_id,
      url: user.avatar.url
    }
  }
  const newPost = await new CommentPost(
    {
      ...req.body,
      postId: req.params.postId,
      userId: user?._id,
      username: user?.username,
    }
  )

  await newPost.save()
  res.status(200).json({
    message: 'create comment successfully',
    success: true,
    newPost
  })
})


commentPostController.getCommentsByIdPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).lean()
  if (!post) return next(new ErrorHandler('Post not found', 404))

  const count = req.query.count || 15
  const page = req.query.page > 0 ? req.query.page : 1
  const skip = count * (page - 1);
  const commentPost = await CommentPost.find({
    postId: req.params.postId
  }).limit(count).skip(skip).lean()

  res.status(200).json({
    commentPost,
    success: true,
    message: 'get comment'
  })
})

commentPostController.delete = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
  if (!post) return next(new ErrorHandler('Post not found', 404))

  const user = await User.findById(req.user.id)
  if (!user) return next(new ErrorHandler('not found user', 404))

  const comment = await CommentPost.findById(req.body?.commentId)
  if (!comment) return next(new ErrorHandler('error not found', 404))

  if (post?.id !== comment.postId.toString() || user?.id !== comment.userId.toString()) return next(new ErrorHandler('Forbidden', 403))

  await comment.remove();
  res.status(200).json({
    message: 'delete successfully',
    success: true
  })
})

module.exports = commentPostController