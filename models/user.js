const mongoose = require('mongoose')

const NewUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      recentMetaData: {
        type: Array,
        required: false
      },
      subscribers: {
        type: Number,
        required: false
      },
      subscribedTo: {
        type: Array,
        required: false
      },
      avatar:{
        type: String,
        required: false
      }
      
    })
    const userModel = mongoose.model('NewUsers', NewUserSchema)
    module.exports = userModel