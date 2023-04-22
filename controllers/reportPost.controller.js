const catchAsyncErrors = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const { ReportPost, Post } = require('../models')
const reportPostController = {}

reportPostController.getAllReportPost = catchAsyncErrors(
  async (req, res, next) => {
    const reportPosts = await ReportPost.find({}).lean()
    const reportPostsCount = reportPosts.length || 0
    res.status(200).json({
      message: 'get all report posts',
      data: {
        reportPosts,
        reportPostsCount,
      },
      success: true,
    })
  }
)

reportPostController.getByIdPost = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.id)
    return next(new ErrorHandler('Params missing required', 400))
  const reportPostById = await ReportPost.find({
    idPost: req.params.id,
  }).lean()

  const count = reportPostById.length
  res.status(200).json({
    message: 'get report post by id',
    success: true,
    data: {
      reportPostById,
      count,
    },
  })
})

reportPostController.create = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.idPost)
    return next(new ErrorHandler('Params missing required', 400))
  if (!req.body.idCategory)
    return next(new ErrorHandler('Params missing required', 401))

  const post = await Post.findById(req.params.idPost)
  if (!post) return next(new ErrorHandler('Post not found', 404))
  post.countReport = post.countReport ? post.countReport + 1 : 1
  await post.save()

  const reportPost = await new ReportPost({
    ...req.body,
    idPost: req.params.idPost,
    idUser: req.user.id,
  })
  await reportPost.save()
  res.status(200).json({
    reportPost,
    success: true,
    message: 'Create reportPost successfully',
  })
})

module.exports = reportPostController
