
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
var ObjectId = require('mongodb').ObjectID;
const {auth} = require('../middleware/authorization.middleware')

const mongoose = require('mongoose');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
})
  async function saveVideo(req, res, next){
    if(req.files === null){
       return res.status(400).json({msg: 'No file uploaded'})
     }
     const file = req.files.file
     let myFile = file.name.split(".")
     const fileType = myFile[myFile.length-1]
     const params = {
       Bucket: process.env.AWS_BUCKET,
       Key: `${uuidv4()}.${fileType}`,
       Body: file.data
     }

      s3.upload(params, (error,data)=>{
          if(error){res.status(500).send(error)}
          res.locals.videoUrl = data.Location
          next()
     })
   }

 

//-------------------------------------------UPLOAD REQUIREMENTS--------------------------------------//
const Video = require('../models/video')




router.post('/upload', [auth, saveVideo], async (req, res ) =>{
  let videoURL = res.locals.videoUrl
  const {title,description,thumbnail,genre,userId,userAvatar,username,subscribers} = req.body
  let date = new Date();

  let newVid = new Video({
    video:{
      title,
      videoURL,
      description,
      thumbnail,
      genre,
      uploadDate: date
    },    
    author:{
      userId,
      username,
      userAvatar,
      subscribers
    }
    
    
  })

  await newVid.save()
  
  res.status(200).json(newVid).end()
    
})


router.get('/allvideos', async (req,res)=>{
  Video.find({}, function (err, videos){
    res.send(videos).end() 
  });
})

router.get('/getVideo/', async (req,res)=>{
  console.log("/getVideo")
  Video.findOne({_id: ObjectId(req.query.movieId)}, function (err, video){    
    if(err){res.send(error).end()}
    res.send({video}).end() 
})

router.get('/addComment', auth, async (req,res)=>{
    console.log('good')
})
  
 
})

module.exports = router

