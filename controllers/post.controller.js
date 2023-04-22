const {Post, User} = require('../models')
const catchAsyncErrors = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const cloudinary = require('cloudinary')

const postController = {}

postController.getAllPost = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({}).lean()

  return res.status(200).json({
    message: 'get posts successfully',
    success: true,
    posts,
  })
})

postController.getListMe = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({userId: req.user.id}).lean()

  res.status(200).json({
    message: 'get list post successfully',
    posts,
    success: true,
  })
})

postController.getPostById = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.id) next(new ErrorHandler('Required Parameter ', 400))
  const post = await Post.findById(req.params.id).lean()

  if (!post) return next(new ErrorHandler('Not found post', 404))

  res.status(200).json({
    post,
    success: true,
    message: 'get post successfully',
  })
})

postController.createPost = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).lean()

  if (!user) next(new ErrorHandler('Forbidden', 403))
  if (!req.body.imgThumnail)
    next(new ErrorHandler('Thumbnails is required', 422))

  const thumbnailResultCloud = await cloudinary.v2.uploader.upload(
    req.body.imgThumnail,
    {
      folder: 'postThumbnail',
    }
  )

  req.body.imgThumnail = {
    public_id: thumbnailResultCloud.public_id,
    url: thumbnailResultCloud.url,
  }
  if (user.avatar) {
    req.body.avatarUser = {
      public_id: user.avatar.public_id,
      url: user.avatar.url,
    }
  }

  const newPost = await new Post({
    ...req.body,
    username: user.username,
    userId: user._id,
  })

  res.status(200).json({
    newPost: await newPost.save(),
    success: true,
    message: 'create post successfully',
  })
})

postController.updatePost = catchAsyncErrors(async (req, res, next) => {
  const postUpdate = await Post.findById(req.params.id)
  const user = await User.findById(req.user._id).lean()

  if (!user.roles.includes('admin')) {
    if (postUpdate.userId !== user._id) next(new ErrorHandler('Forbidden', 403))
  }

  if (req.body.imgThumnail) {
    await cloudinary.v2.uploader.destroy(postUpdate.imgThumnail.public_id)
    const postImgThumbnailResult = await cloudinary.v2.uploader.upload(
      req.body.imgThumnail,
      {
        folder: 'postThumbnail',
      }
    )

    req.body.imgThumnail = {
      public_id: postImgThumbnailResult.public_id,
      url: postImgThumbnailResult.url,
    }
  }

  if (user.avatar) {
    req.body.avatarUser = {
      public_id: user.avatar.public_id,
      url: user.avatar.url,
    }
  }

  const updatePost = await Post.findOneAndUpdate(
    postUpdate.id,
    {...req.body},
    {
      new: true,
      runValidators: true,
    }
  )

  await updatePost.save()

  res.status(200).json({
    updatePost,
    success: true,
    message: 'Updated post successfully',
  })
})

postController.deletePost = catchAsyncErrors(async (req, res, next) => {
  const postDelete = await Post.findById(req.params.id)
  const user = await User.findById(req.user._id).lean()

  if (!user.roles.includes('admin')) {
    if (postDelete.userId !== user._id) next(new ErrorHandler('Forbidden', 403))
  }

  await cloudinary.v2.uploader.destroy(postDelete.imgThumnail.public_id)
  await postDelete.remove()

  res.status(200).json({
    success: true,
    message: 'remove post successfully',
  })
})

postController.togglePublicPost = catchAsyncErrors(async (req, res, nest) => {
  if (!req.params.id)
    return next(ErrorHandler('Bad Request:::required param', 400))
  const post = await Post.findById(req.params.id)
  const user = await User.findById(req.user.id)
  if (!user.roles.includes('admin')) {
    if (user._id !== post.userId) return next(new ErrorHandler('Fibbiden', 403))
  }

  post.isPublish = !post.isPublish
  await post.save()

  res.status(200).json({
    success: true,
    post,
    message: 'toggle publish successfully',
  })
})

module.exports = postController
