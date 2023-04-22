const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoryPost = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    tag: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('categoryPost', categoryPost)
