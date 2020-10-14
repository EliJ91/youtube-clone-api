const mongoose = require('mongoose')

const NewVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: false
      },
      uploadDate: {
        type: string,
        required: true
      },
      authorId: {
        type: Number,
        required: true
      },
      thumbnail: {
        type: string,
        required: false
      },
      views,
      likes,
      disliked,
      metaData,
      comments:[{
          mongoId,
          username,
          comment,
          likes,
          dislikes,
          reply:[{
              mongoId,
              username,
              comment,
              likes,
              dislikes
          }]
      }]
    })
    const videoModel = mongoose.model('NewVideo', NewVideoSchema)
    module.exports = videoModel