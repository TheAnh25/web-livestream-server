const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentPost = new Schema(
  {
    text: {
      type: String,
      required: [true, 'text is required'],
    },
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
    imgs: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  {timestamps: true}
)

module.exports = mongoose.model('commentPost', CommentPost)
