const cloudinary = require('cloudinary')

const catchAsyncError = require('../middleware/catchAsyncError.js')
const ErrorHandler = require('../utils/errorHandler')
const {CategoryPost, Post} = require('../models')

const categoryPostController = {}

categoryPostController.craete = catchAsyncError(async (req, res, next) => {
  {
    const {thumbnail} = req.body

    if (!thumbnail) next(new ErrorHandler('thumbnail is required', 400))

    const myCloud = await cloudinary.v2.uploader.upload(req.body.thumbnail, {
      folder: 'category-post-thumbnail',
    })

    const newCategoryPost = await CategoryPost.create({
      ...req.body,
      thumbnail: {
        public_id: myCloud.public_id,
        url: myCloud.url,
      },
      userId: req.user.id,

    })

    res.status(200).json({
      message: 'create category post successfully',
      success: true,
      newCategoryPost,
    })
  }
})

categoryPostController.getCategoriesPost = catchAsyncError(
  async (req, res, next) => {
    const categories = await CategoryPost.find({}).lean()


    res.status(200).json({
      categories,
      success: true,
      message: 'get categories post successfully',
      categoriesCount: categories.length,
    })
  }
)

categoryPostController.getCategpryPostById = catchAsyncError(
  async (req, res, next) => {
    const category = await CategoryPost.findById(req.params.id).lean()

    if (!category) next(new ErrorHandler('category post not found', 404))

    const posts = await Post.find({categoryPostId: category._id}).limit(20).skip(1).lean()

    res.status(200).json({
      message: 'get categories post by id successfully',
      success: true,
      category,
      posts
    })
  }
)

categoryPostController.update = catchAsyncError(async (req, res, next) => {
  const category = await CategoryPost.findById(req.params.id).lean()
  if (!category) next(new ErrorHandler('category not found', 404))

  if (req.body.thumbnail) {
    await cloudinary.v2.uploader.destroy(req.body.thumbnail)
    const myCloud = await cloudinary.v2.uploader.upload(req.body.thumbnail, {
      folder: 'category-post-thumbnail',
    })

    req.body.thumbnail = {public_id: myCloud.public_id, url: myCloud.url}
  }

  const updateCategory = await CategoryPost.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!updateCategory) next(new ErrorHandler('category not found', 404))

  await updateCategory.save()

  res.status(200).json({
    success: true,
    message: 'update category post successfully',
    updateCategory,
  })
})

module.exports = categoryPostController
