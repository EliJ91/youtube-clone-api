const multer = require('multer');
const express = require('express');
const router = express.Router();


//GET AUTH TOKEN\

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null,'public')
  },
  filename: function (req, file, cb){
    const newFileName = `${file.fieldname}`

    cb(null, newFileName)
  }
})

const upload = multer({storage}).single("video")

 


router.post('/upload',upload, async (req, res ) =>{
  
  console.log("hi")


  // if(req.file){
  //   const filename = req.file.filename;
  //   const {title,description} = req.body;

  //   console.log(filename)
  // }
  
  
  // let  path  = req.body;
    // console.log(req.API_AUTH_TOKEN)
    // let file = path.file
    
    // axios.post('http://sandbox.api.video/videos',
    //     {
    //         "title":path.title,
    //         "description":path.description,
    //         "source":path.movie[0].path
    //     },{headers: {
    //         'Authorization': `Bearer ${req.API_AUTH_TOKEN}`,
    //         'content-type': 'application/json' 
    //       }
    //     })
    //     .then(function (response) {
    //         console.log(response);
    //         console.log("GOOD")
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //         console.log("ERROR")
    //       });


    
    
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