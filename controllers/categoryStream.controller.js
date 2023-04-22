const cloudinary = require('cloudinary')

const catchAsyncError = require('../middleware/catchAsyncError.js')
const ErrorHandler = require('../middleware/errorHandler')
const {CategoryStream} = require('../models')

const categoryStreamerController = {}

categoryStreamerController.create = catchAsyncError(async (req, res, next) => {
  if (!req.body.thumbnail)
    next(new ErrorHandler('thumbnail is not available', 400))

  const myCloud = await cloudinary.v2.uploader.upload(req.body.thumbnail, {
    folder: 'category-streammer',
  })

  if (req.body.categoryStreamId) {
    req.body.categoryStreamId = [req.body.categoryStreamId]
  }
  console.log(req.body.categoryStreamId)

  const newCategoryStream = await CategoryStream.create({
    ...req.body,
    thumbnail: {
      public_id: myCloud.public_id,
      url: myCloud.url,
    },
    authorId: req.user.id,
  })

  res.status(200).json({
    success: true,
    message: 'Create category streammer successfully',
    newCategoryStream,
  })
})

categoryStreamerController.getCategoriesStreammer = catchAsyncError(
  async (req, res, next) => {
    const categories = await CategoryStream.find({}).lean()
    const categoriesCount = categories.length

    res.status(200).json({
      categories,
      message: 'get categories successfully',
      success: true,
      categoriesCount,
    })
  }
)

categoryStreamerController.getCategoryById = catchAsyncError(
  async (req, res, next) => {
    const category = await CategoryStream.findById(req.params.id).lean()
    if (!category) next(new ErrorHandler('category not found', 404))
    res.status(200).json({
      success: true,
      message: 'get category by id successfully',
      category,
    })
  }
)

categoryStreamerController.updateCategory = catchAsyncError(
  async (req, res, next) => {
    const category = await CategoryStream.findById(req.params.id)

    if (!category) next(new ErrorHandler('category not found', 404))

    if (req.body.thumbnail) {
      await cloudinary.v2.uploader.destroy()
      const myClound = await cloudinary.v2.uploader.upload(req.body.thumbnail, {
        folder: 'category-streammer',
      })

      req.body.thumbnail = {public_id: myClound.public_id, url: myClound.url}
    } else {
      req.body.thumbnail = {
        public_id: category.thumbnail.public_id,
        url: category.thumbnail.url,
      }
    }

    const updateCategory = await CategoryStream.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true, runValidators: true}
    )

    if (!updateCategory) next(new ErrorHandler('updateCateogry not found', 404))

    await updateCategory.save()

    res.status(200).json({
      success: true,
      updateCategory,
      message: 'update category successfully',
    })
  }
)

module.exports = categoryStreamerController
