
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
var ObjectId = require('mongodb').ObjectID;
const {auth} = require('../middleware/authorization.middleware')
const Video = require('../models/video')

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

 

//-------------------------------------------UPLOAD ENDPOINT-------------------------------------//

router.post('/upload', [auth, saveVideo], async (req, res ) =>{
  let videoURL = res.locals.videoUrl
  const {title,description,thumbnail,genre,userId,userAvatar,username,subscribers} = req.body
  let date = new Date()
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

//-------------------------------------------GET ALL VIDEOS ENDPOINT-------------------------------------//
router.get('/allvideos', async (req,res)=>{
  Video.find({}, function (err, videos){
    res.send(videos).end() 
  });
})
//-------------------------------------------GET ONE VIDEO ENDPOINT-------------------------------------//
router.get('/getVideo', async (req,res)=>{
  console.log("/getVideo")
  Video.findOne({_id: ObjectId(req.query.movieId)}, function (err, video){    
    if(err){res.send(error).end()}
    res.send({video}).end() 
  })
})
//-------------------------------------------ADD COMMENT ENDPOINT-------------------------------------//
router.post('/addComment', auth, async (req,res)=>{
  if(!req.body.comment){
    res.status(404).json({message: "Missing message"}).end()
  }
  let newComment={}
  await Video.findById(req.body.movieId, function (err, result){    
    let date = new Date();
    newComment = {
      username: req.body.user.username,
      userAvatar: req.body.user.avatar,
      date: date,
      comment:req.body.comment,
      likes:[],
      dislikes:[],
      replies:[],
      commentId: (req.body.movieId+"-"+result.comments.length)
    }
  });
  Video.updateOne(
    { _id: req.body.movieId }, 
    { $push: { comments: newComment} },
    function (error, success) {
      if (error) {
          console.log(error);
      } else {
          console.log(success);
      }
  })

  await Video.findById(req.body.movieId, function (err, result){
    res.send(result).end()
  });
  
})
//-------------------------------------------ADD COMMENT REPLY ENDPOINT-------------------------------------//  
router.post('/replyComment', auth, async (req,res)=>{
  if(!req.body.comment){
    res.status(404).json({message: "Missing message"}).end()
  }
  let videoId = req.body.commentId.split("-")[0]
  let index = req.body.commentId.split("-")[1]
  let date = new Date();
  let newReply = {
        username: req.body.user.username,
        userAvatar: req.body.user.avatar,
        date: date,
        comment:req.body.comment,
        likes:[],
        dislikes:[],
        commentId: (req.body.commentId)
      }
  let array = `comments.${index}.reply`
    Video.updateOne(
      {_id: videoId}, 
      {$push: { [array] : newReply}} ,
      function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log(success);
        }
      })
  
      await Video.findById(videoId, function (err, result){
        //console.log(result.comments[index])
        res.send(result.comments[index]).end()
      });
})


module.exports = router

// db.nestedArrayDemo.update({"_id":ObjectId("5c6d73090c3d5054b766a76e"),"EmployeeDetails.EmployeeDepartment":"ComputerScience"}, {"$push":
//    {"EmployeeDetails.$.EmployeeProject": {"Technology":"Python", "Duration":4 }}});
   