const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.loginUser = async (req, res) => {
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
}