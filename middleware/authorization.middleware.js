const jwt = require('jsonwebtoken')
exports.auth = (req, res, next) => {
  if(!req.cookies.token){
    res.status(500).json({message: "Missing jwt token"}).end()
    console.log('JWT Missing.')
    return
  }
  const token = req.cookies.token
  try{
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  next()  
  }catch(err){
    res.status(400).json({message: "Did not decode"}).end()
  }
}
    
  
  


