const mongoose = require('mongoose')

const NewVideoSchema = new mongoose.Schema({
      video:{
        title: {
          type: String,
          required: true,
          unique: true
        },
        description: {
          type: String,
          required: false
        },
        videoURL: {
          type: String,
          required: true
        },
        uploadDate: {
          type: String,
          required: true
        },
        thumbnail: {
          type: String,
          required: false,
          default: "https://smartsystemstx.com/images/yootheme/pages/features/panel01.jpg"
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
        }
      },
      author:{
        username: {
          type: String,
          required: true
        },
        userId: {
          type: String,
          required: true
        },
        userAvatar: {
          type: String,
          required: false,
          default: null
        },subscribers: {
          type: Array,
          required: false
        },
      },
      comments:[{
          username:{
            type: String,
            required: false
          },
          userAvatar:{
            type: String,
            required: false
          },
          comment:{
            type: String,
            required: false
          },
          likes:{
            type: Array,
            required: false
          },
          dislikes:{
            type: Array,
            required: false
          },
          date:{
            type: String,
            required: false
          },
          reply:[{
              username:{
                type: String,
                required: false
              },
              userAvatar:{
                type: String,
                required: false
              },
              comment:{
                type: String,
                required: false
              },
              likes:{
                type: Array,
                required: false
              },
              dislikes:{
                type: Array,
                required: false
              }
          }]
      }]
    })
    const videoModel = mongoose.model('NewVideo', NewVideoSchema)
    module.exports = videoModel