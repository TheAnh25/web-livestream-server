const mongoose = require('mongoose');
const schema = mongoose.Schema

const reportPostCategory = new schema({
  idAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  typeReport: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('report-post-category', reportPostCategory)