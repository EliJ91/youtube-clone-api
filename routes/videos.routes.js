const express = require('express');
const router = express.Router();
const axios =require('axios');
//GET AUTH TOKEN\


uploadAuth = async (req, res, next) => {
    axios.post('https://sandbox.api.video/auth/api-key', {
      "apiKey": "SkGQnAbt0xEwWBiglfTPtITEMQYY7fUZ8bQ95mfHKz"
    })
    .then(function (response) {
      req.API_AUTH_TOKEN = response.data.access_token
      next()
    })
    .catch(function (error) {
      console.log(error);
      console.log('ERROR')
    })
} 


router.post('/upload', uploadAuth, async (req, res ) =>{
    let  path  = req.body;
    
    axios.post('http://sandbox.api.video/videos',
        {
            "title":path.title,
            "description":path.description,
            "source":path.movie[0].path
        },{headers: {
            'Authorization': `Bearer ${res.req.API_AUTH_TOKEN}` 
          }
        })
        .then(function (response) {
            console.log(response);
            console.log("GOOD")
          })
          .catch(function (error) {
            console.log(error);
            console.log("ERROR")
          });


    
    
})



module.exports = router


// axios.post('https://sandboxsandbox.api.video/videos',
//         {
//             "title":res.a,
//             "description":"DECRIPSTIONSION",
//             "source":res.acceptedFiles
//         },{headers: {
//             'Authorization': `Bearer ${res.req.API_AUTH_TOKEN}` 
//           }
//         })