const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    body: {
      type: String,
      required: [true, 'body is required'],
    },
    username: {
      type: String,
      required: true,
    },
    imgThumnail: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    categoryPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categoryPost',
    },
    ratings: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
    },
    status: {
      type: String,
      default: 'NO_PUBLISH',
    },
    publishDate: {
      type: Date,
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    avatarUser: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      }
    },
    descriptionShort: {
      required: true,
      type: String
    },
    countReport: {
      type: Number,
      default: 0
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('post', Post)
