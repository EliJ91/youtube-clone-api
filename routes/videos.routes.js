const express = require('express');
const router = express.Router();
const axios =require('axios');
const { request } = require('express');

let API_AUTH_TOKEN = ""


//GET AUTH TOKEN
router.post('/upload', async (req, res, next) =>{

        axios.post('https://sandbox.api.video/auth/api-key', {
            "apiKey": "SkGQnAbt0xEwWBiglfTPtITEMQYY7fUZ8bQ95mfHKz"
            })
        .then(function (response) {
            API_AUTH_TOKEN = response.data.access_token
            console.log(API_AUTH_TOKEN)
        })
        .catch(function (error) {
            console.log(error);
            console.log('ERROR')
        })

        console.log(req)
    
})



module.exports = router
///

//CREATE NEW USER
// router.post('/upload', async (req, res) => {
//     const {title, description, uploadDate, authorId, file} = req.body
//   try {
//     let createdUser = await UserRegistration.findOne({
//       email
//     })
//     if (createdUser) {
//       res.status(422).json({
//         errors: [
//           {
//             msg: 'User already exists'
//           }
//         ]
//       })
//     } else {
//       createdUser = new UserRegistration({
//         email,
//         password,
//         owner
//       })
//       const salt = await bcrypt.genSalt(10)

//       createdUser.password = await bcrypt.hash(password, salt)

//       await createdUser.save()
//       res.status(201).json(req.body)
//     }
//   } catch (err) {
//     console.log(err)
    
//   }
// })