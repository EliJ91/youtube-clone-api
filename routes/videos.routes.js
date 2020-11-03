
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
  function saveVideo(req, res, next){
    console.log("Called: saveVideo function")
    if(req.files === null){
       return res.status(400).json({msg: 'No file uploaded'}.end())
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
        if(error){
          console.log("error",error)
          res.status(500).send(error).end()
        }
        res.locals.videoUrl = data.Location
        next()
        })
      
  }    

 

//-------------------------------------------UPLOAD ENDPOINT-------------------------------------//

router.post('/upload', [auth, saveVideo], async (req, res ) =>{
  console.log('Creating Video Document')
  const defaultThumbnail = "https://smartsystemstx.com/images/yootheme/pages/features/panel01.jpg"
  let videoURL = res.locals.videoUrl
  const {title,description,thumbnail,genre,userId,userAvatar,username,subscribers} = req.body
  let date = new Date()
  let newVid = new Video({
    video:{
      title,
      videoURL,
      description,
      thumbnail: thumbnail ? thumbnail : defaultThumbnail,
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
  console.log(newVid)
  try{
    const newVideo = await newVid.save()
    if(newVideo){
      console.log('Created Video Document')
      res.status(200).json(newVid).end()
    }    
  }catch(err){
    console.log('Error Creating Video Document')
    res.send(err).end()
  }
  
})

//-------------------------------------------GET ALL VIDEOS ENDPOINT-------------------------------------//
router.get('/allvideos', async (req,res)=>{
  Video.find({}, function (err, videos){
    res.send(videos).end() 
  });
})
//-------------------------------------------GET ONE VIDEO ENDPOINT-------------------------------------//
router.get('/getVideo', async (req,res)=>{
  Video.findOne({_id: ObjectId(req.query.movieId)}, function (err, video){    
    if(err){res.send(err).end()}
    res.send(video).end() 
  })
})
//-------------------------------------------ADD COMMENT ENDPOINT-------------------------------------//
router.post('/addComment', auth, async (req,res)=>{
  if(!req.body.comment){
    res.status(404).json({message: "Missing message"}).end()
  }
  const newComment = {
    username: req.body.user.username,
    userAvatar: req.body.user.avatar,
    date: new Date(),
    comment:req.body.comment,
    likes:[],
    dislikes:[],
    replies:[],
    commentId: (uuidv4())
  }
  
  
  const video = await Video.findOneAndUpdate(
    { _id: req.body.movieId }, 
    { $push: { comments: newComment}},
    { useFindAndModify: false }
  )

  
  if(video){
    const moV = await Video.findOne({ _id: ObjectId(req.body.movieId)})
    res.send(moV).end() 
  }
  
  
})
//-------------------------------------------ADD COMMENT REPLY ENDPOINT-------------------------------------//  
router.post('/replyComment', auth, async (req,res)=>{
  if(!req.body.comment){
    res.status(404).json({message: "Missing message"}).end()
  }
  let comId = req.body.commentId ? req.body.commentId : req.body.replyId.split("_")[0]
  
  let date = new Date();
  let newReply = {
        username: req.body.user.username,
        userAvatar: req.body.user.avatar,
        date: date,
        comment:req.body.comment,
        likes:[],
        dislikes:[],
        replyId: comId+"_"+uuidv4()
      }
   
  const comments = await Video.findOneAndUpdate(
    {"comments.commentId": comId}, 
    {$push: { "comments.$.reply" : newReply}},
    { useFindAndModify: false }
  )

  if(comments){
    const moV = await Video.findOne({"comments.commentId": comId})
    res.send(moV.comments).end() 
  }
})

//-------------------------------------------INCREMENT VIDEO VIEWS ENDPOINT-------------------------------------//  
router.get('/addView', async (req,res)=>{
  
  const view = await Video.updateOne(
    { _id: ObjectId(req.query.movieId)}, 
    { $inc: { "video.views": 1} }) 
    if(view){
      const moV = await Video.findOne({ _id: ObjectId(req.query.movieId)})
      res.send(moV).end() 
    }
  
})
//-------------------------------------------LIKE VIDEO ENDPOINT-------------------------------------//  
router.post('/likeVideo', auth, async (req,res)=>{
  const movie = await Video.findOne({ _id: ObjectId(req.body.movieId)})
  if(movie.video.dislikes.includes(req.body.user.username)){
  await  Video.updateOne(
      { _id: ObjectId(req.body.movieId)}, 
      { $pull: { "video.dislikes": req.body.user.username} }
    )
  }
  if(movie.video.likes.includes(req.body.user.username)){
    res.send(movie).end()
  }else{
    const video = await Video.findOneAndUpdate(
      { _id: ObjectId(req.body.movieId)}, 
      { $push: { "video.likes": req.body.user.username} } ,
      { useFindAndModify: false }
    )
    if(video){
      const moV = await Video.findOne({ _id: ObjectId(req.body.movieId)})
      res.send(moV).end() 
    }
    
  }
  
  
})
//-------------------------------------------DISLIKE VIDEO ENDPOINT-------------------------------------//  
router.post('/dislikeVideo', auth, async (req,res)=>{

  const movie = await Video.findOne({ _id: ObjectId(req.body.movieId)})

  if(movie.video.likes.includes(req.body.user.username)){
  await Video.updateOne(
      { _id: ObjectId(req.body.movieId)}, 
      { $pull: { "video.likes": req.body.user.username} }
    )
  } 
  if(movie.video.dislikes.includes(req.body.user.username)){
    res.send(movie).end()
  }else{
    const video = await Video.findOneAndUpdate(
      { _id: ObjectId(req.body.movieId)}, 
      { $push: { "video.dislikes": req.body.user.username} } ,
      { useFindAndModify: false }
    )
    if(video){
      const moV = await Video.findOne({ _id: ObjectId(req.body.movieId)})
      res.send(moV).end() 
    }
  }

})
//-------------------------------------------LIKE COMMENT ENDPOINT-------------------------------------//  
router.post('/likeComment', auth, async (req,res)=>{
  if(req.body.commentId){
  const movie = await Video.findOne({ "comments.commentId": req.body.commentId}) 
  const index = movie.comments.map((el)=> el.commentId).indexOf(req.body.commentId)
  
  if(movie.comments[index].dislikes.includes(req.body.user.username)){
    const dislikeArray = `comments.${index}.dislikes`
  await Video.updateOne(
      {"comments.commentId": req.body.commentId}, 
      { $pull: { [dislikeArray]: req.body.user.username} }
    )
  } 
  if(movie.comments[index].likes.includes(req.body.user.username)){
    res.send(movie).end()
  }else{
    const likeArray = `comments.${index}.likes`
    const video = await Video.findOneAndUpdate(
      { "comments.commentId": req.body.commentId}, 
      { $push: {[likeArray]: req.body.user.username} } ,
      { useFindAndModify: false }
    )
    if(video){
      const moV = await Video.findOne({ "comments.commentId": req.body.commentId})
      res.send(moV).end() 
    }
  }
}else{
    const mainCommentId = req.body.replyId.split("_")[0]
    const movie = await Video.findOne({ "comments.commentId": mainCommentId}) 
    const index = movie.comments.map((el)=> el.commentId).indexOf(mainCommentId)
    const replyIndex = movie.comments[index].reply.map((el)=> el.replyId).indexOf(req.body.replyId)
    
    if(movie.comments[index].reply[replyIndex].dislikes.includes(req.body.user.username)){
      const dislikeArray = `comments.${index}.reply.${replyIndex}.dislikes`
    await Video.updateOne(
        {"comments.commentId": mainCommentId}, 
        { $pull: { [dislikeArray]: req.body.user.username} }
      )
    } 
  
    if(movie.comments[index].reply[replyIndex].likes.includes(req.body.user.username)){
      res.send(movie).end()
    }else{
      const likeArray = `comments.${index}.reply.${replyIndex}.likes`
      const video = await Video.findOneAndUpdate(
        { "comments.commentId": mainCommentId}, 
        { $push: {[likeArray]: req.body.user.username} } ,
        { useFindAndModify: false }
      )
      if(video){
        const moV = await Video.findOne({ "comments.commentId": mainCommentId})
        res.send(moV).end() 
      }
    }
  }

})
//-------------------------------------------DISLIKE COMMENT ENDPOINT-------------------------------------//  
router.post('/dislikeComment', auth, async (req,res)=>{
  if(req.body.commentId){
  const movie = await Video.findOne({ "comments.commentId": req.body.commentId}) 
  const index = movie.comments.map((el)=> el.commentId).indexOf(req.body.commentId)
  
  if(movie.comments[index].likes.includes(req.body.user.username)){
    const likeArray = `comments.${index}.likes`
  await Video.updateOne(
      {"comments.commentId": req.body.commentId}, 
      { $pull: { [likeArray]: req.body.user.username} }
    )
  } 

  if(movie.comments[index].dislikes.includes(req.body.user.username)){
    res.send(movie).end()
  }else{
    const dislikeArray = `comments.${index}.dislikes`
    const video = await Video.findOneAndUpdate(
      { "comments.commentId": req.body.commentId}, 
      { $push: {[dislikeArray]: req.body.user.username} } ,
      { useFindAndModify: false }
    )
    if(video){
      const moV = await Video.findOne({ "comments.commentId": req.body.commentId})
      res.send(moV).end() 
    }
  }
}else{
  const mainCommentId = req.body.replyId.split("_")[0]
  const movie = await Video.findOne({ "comments.commentId": mainCommentId}) 
  const index = movie.comments.map((el)=> el.commentId).indexOf(mainCommentId)
  const replyIndex = movie.comments[index].reply.map((el)=> el.replyId).indexOf(req.body.replyId)
  
  if(movie.comments[index].reply[replyIndex].likes.includes(req.body.user.username)){
    const likeArray = `comments.${index}.reply.${replyIndex}.likes`
  await Video.updateOne(
      {"comments.commentId": mainCommentId}, 
      { $pull: { [likeArray]: req.body.user.username} }
    )
  } 

  if(movie.comments[index].reply[replyIndex].dislikes.includes(req.body.user.username)){
    res.send(movie).end()
  }else{
    const dislikeArray = `comments.${index}.reply.${replyIndex}.dislikes`
    const video = await Video.findOneAndUpdate(
      { "comments.commentId": mainCommentId}, 
      { $push: {[dislikeArray]: req.body.user.username} } ,
      { useFindAndModify: false }
    )
    if(video){
      const moV = await Video.findOne({ "comments.commentId": mainCommentId})
      res.send(moV).end() 
    }
  }
}

})




module.exports = router

// db.nestedArrayDemo.update({"_id":ObjectId("5c6d73090c3d5054b766a76e"),"EmployeeDetails.EmployeeDepartment":"ComputerScience"}, {"$push":
//    {"EmployeeDetails.$.EmployeeProject": {"Technology":"Python", "Duration":4 }}});
   