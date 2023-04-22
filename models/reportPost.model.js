const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportPost = new Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    idPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
      required: true
    },
    idCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'report-post-category',
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('report-post', reportPost)
