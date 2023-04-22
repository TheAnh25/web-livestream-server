const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoryStream = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    categoryStreamId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoryStream',
      },
    ],
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [30, 'description > 30 '],
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
  },
  { timestamps: true }
)

module.exports = mongoose.model('categoryStream', categoryStream)
