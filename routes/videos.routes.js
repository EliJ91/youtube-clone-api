
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { response } = require('express');
var fs = require('fs');


var middleware = {
  saveVideo: async (req, res, next) => {
console.log('saved video hit')
    if(req.files === null){
       return res.status(400).json({msg: 'No file uploaded'})
     }
     const file = req.files.file
     file.mv(`${__dirname}/uploads/${file.name}`, error => {
       if(error){
         console.error(error)
         return res.status(500).send(error)
       }
       req.fileName = file.name
       next()
     })
   
   },
   uploadVideo: async (req, res, next) => {
     console.log('upload video hit')
    axios.post('http://sandbox.api.video/videos',
    {
        "title":"test",
        "description":"testD",
        "source":`/uploads/${req.fileName}`
    }   
    ,
    {
      headers: {
        'Authorization': `Bearer ${res.req.API_AUTH_TOKEN}` 
      }
    })
    .then(function (response) {
      fs.writeFile("./good.txt", (response), (err) => {if (err) throw err;})
    })
    .catch(function (error) {
      fs.writeFile("./fuck.txt", (error), (err) => {if (err) throw err;})
    })
    next()
  }
}
 







router.post('/upload', [middleware.saveVideo, middleware.uploadVideo], async (req, res ) =>{

console.log(req)
console.log(res.route)
console.log('the fuck happened')


 
    
})


module.exports = router

