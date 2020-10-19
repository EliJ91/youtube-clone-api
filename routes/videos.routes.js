
const express = require('express');
const router = express.Router();
const axios = require('axios');
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
})
  async function saveVideo(req, res, next){
    console.log('saved video hit')
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
          req.videoUrl = data.Location
          next()
          res.status(200)
     })
   }

 







router.post('/upload', saveVideo, async (req, res ) =>{
  let videoURL = req.videoURL
  let title = req.body.title
  let description = req.body.description
  console.log(req.body.title)
  console.log(req.body.description)
  console.log(req.videoUrl)
  res.status(200).send("Video Uploaded")
    
})


module.exports = router

