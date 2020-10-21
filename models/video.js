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
      videoURL: {
        type: String,
        required: true
      },
      uploadDate: {
        type: String,
        required: true
      },
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
        required: false,
        default:0
      },
      dislikes:{
        type: Array,
        required: false,
        default:0
      },
      genre:{
        type: String,
        required: false
      },
      comments:[{
          mongoId:{
            type: Number,
            required: false
          },
          username:{
            type: String,
            required: true
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
            required: false,
            default:0
          },
          dislikes:{
            type: Array,
            required: false,
            default:0
          },
          reply:[{
              mongoId:{
                type: String,
                required: true
              },
              username:{
                type: String,
                required: true
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
                required: false,
                default:0
              },
              dislikes:{
                type: Array,
                required: false,
                default:0
              }
          }]
      }]
    })
    const videoModel = mongoose.model('NewVideo', NewVideoSchema)
    module.exports = videoModel