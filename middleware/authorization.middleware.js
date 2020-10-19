require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken')
const cookieParser= require('cookie-parser')
var app = express()
app.use(cookieParser())

exports.auth = async (req, res, next) => {
  if(!req.cookies.token){
    res.status(500).json({message: "missing jwt token"})
  }
  let token = req.cookies.token
  token = ""
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("made it to decoder")
  }catch(err){
    res.status(400).json({message: "did not decode"})
    throw err
  }
  
  console.log("made it through decoder")
  console.log(token)

  next()
  
}


