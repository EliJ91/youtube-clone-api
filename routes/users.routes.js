require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {auth} = require('../middleware/authorization.middleware')


const cookieParser= require('cookie-parser')
var app = express()
app.use(cookieParser())


//CREATE USER REQUIREMENTS
const UserRegistration = require('../models/user')

///

//LOGIN USER REQUIREMENTS
const User = require('../models/user');

///

//CREATE NEW USER
router.post('/create', async (req, res) => {
  const {username, password} = req.body
  try {
    let createdUser = await UserRegistration.findOne({
      username
    })
    if (createdUser) {
      res.status(422).json({
        error: [
          {
            msg: 'User already exists'
          }
        ]
      })
    } else {
      createdUser = new UserRegistration({
        username,
        password
      })
      const salt = await bcrypt.genSalt(10)

      createdUser.password = await bcrypt.hash(password, salt)

      await createdUser.save()
      res.status(201).json(req.body)
    }
  } catch (err) {
    console.log(err)
    
  }
})


//LOGIN USER
router.post('/login', async (req, res) => {
    try {
      const username = req.body.username
      const password = req.body.password
  
      if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter required fields' })
      }
      const loginUser = await User.findOne({
        username: username
      })
      if (!loginUser) {
        res.status(422).json({
          errors: [
            {
              msg: 'User does not exist'
            }
          ]
        })
      } else {
        bcrypt.compare(password, loginUser.password).then((isMatch) => {
          if (!isMatch) {
            console.log('not a match')
            return res.status(401).json({ msg: 'Password is invalid.' })
          }
          loginUser.password = undefined
          const accessToken = jwt.sign(loginUser.username, process.env.JWT_SECRET)
          res.cookie('token', accessToken, { httpOnly: true })
          res.status(201).json({loginUser})
          
          
        })
      }
    } catch (err) {
      console.log(err)
    }
  })

 router.post("/testauth", auth, async (req,res)=>{
   console.log('made it to end point')
 })




 router.post("/deletecookie", async (req,res)=>{
   res.clearCookie('token')
})
router.post("/testcookie", async (req,res)=>{
  
  console.log(req.cookies.token)
  console.log(req.headers.cookie)
})
 
module.exports = router






// //get one
// router.get('/:id', (req,res)=>{
//     res.send(req.params.id)
// })
// //create one
// router.post('/', async (req,res)=>{
//     const user = new User({
//         email: req.body.email,
//         password: req.body.password,
//         adminAccount: req.body.adminAccount
//     })
//     try{
//         const newUser = await user.save()
//         res.status(201).json(newUser)
//     }catch (err){
//         res.status(400).json({message: err.message})
//     }
// })
// //update one
// router.patch('/:id', (req,res)=>{
    
// })
// //delete one
// router.delete('/:id', (req,res)=>{
    
// })