const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('connect db success'))
    .catch((err) => console.log('connect db error', err))
}

module.exports = connectDB
