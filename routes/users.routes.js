require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {auth} = require('../middleware/authorization.middleware')

//--------------------------------------------END OF IMPORTS----------------------------------------//


//==================================================================================================//
//--------------------------------------------USER ENDPOINTS----------------------------------------//
//==================================================================================================//


//-------------------------------------------USER REQUIREMENTS--------------------------------------//
const User = require('../models/user');



//--------------------------------------------CREATE NEW USER---------------------------------------//
router.post('/create', async (req, res) => {
  const {username, password, avatar} = req.body
  try {
    let createdUser = await User.findOne({
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
      createdUser = new User({
        username,
        password,
        avatar
      })
      const salt = await bcrypt.genSalt(10)

      createdUser.password = await bcrypt.hash(password, salt)

      await createdUser.save()
      res.status(201).json(req.body).end()
    }
  } catch (err) {
    console.log(err)
    
  }
})


//-----------------------------------------------LOGIN USER-----------------------------------------//
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
          res.cookie('token', accessToken, { sameSite: "None", secure: true})
          res.status(201).json(loginUser)
          res.end()
        })
      }
    }catch(err) {
      res.err
      console.log(err)
    }
  })
//-----------------------------------------------LOG OUT USER-----------------------------------------//
router.post('/logout', async (req,res)=>{
  res.clearCookie('token').end()
})
//-----------------------------------------------LOG OUT USER-----------------------------------------//
router.post('/stayLogged', auth, async (req,res)=>{
  
  const token = req.cookies.token
  const decoded = jwt.decode(token, process.env.JWT_SECRET)
  User.findOne({username:decoded}, function (err, user){
    if(err){res.send(err).end()}  
    res.send(user).end() 
  })
  
})

 
module.exports = router






