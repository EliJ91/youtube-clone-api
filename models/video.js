const mongoose = require('mongoose')

const NewVideoSchema = new mongoose.Schema({
      video:{
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: false
        },
        videoURL: {
          type: String,
          required: true,
          unique: true
        },
        uploadDate: {
          type: String,
          required: true
        },
        thumbnail: {
          type: String,
          required: false
        },
        views:{
          type: Number,
          required: false,
          default:0
        },
        likes:{
          type: Array,
          required: false
        },
        dislikes:{
          type: Array,
          required: false
        },
        genre:{
          type: String,
          required: false
        },
        ETag:{
          type: String,
          required: true
        }
      },
      authorId:{
          type: String,
          required: true
        },
      comments:[]
    })
    const videoModel = mongoose.model('NewVideo', NewVideoSchema)
    module.exports = videoModel
