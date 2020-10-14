const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

//CREATE USER REQUIREMENTS
const UserRegistration = require('../models/user')

///

//LOGIN USER REQUIREMENTS
const User = require('../models/user')
const jwt = require('jsonwebtoken')
///

//CREATE NEW USER
router.post('/create', async (req, res) => {
  const {email, password, owner} = req.body
  try {
    let createdUser = await UserRegistration.findOne({
      email
    })
    if (createdUser) {
      res.status(422).json({
        errors: [
          {
            msg: 'User already exists'
          }
        ]
      })
    } else {
      createdUser = new UserRegistration({
        email,
        password,
        owner
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
      const email = req.body.email
      const password = req.body.password
  
      if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter required fields' })
      }
      const loginUser = await User.findOne({
        email: email
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
            return res.status(422).json({ msg: 'Invalid credentials' })
          }
          loginUser.password = undefined
          const accessToken = jwt.sign(loginUser.email, process.env.JWT_SECRET)
          
          res.status(201).json({accessToken: accessToken,loginUser})
          
        })
      }
    } catch (err) {
      console.log(err)
    }
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