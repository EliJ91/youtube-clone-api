const jwt = require('jsonwebtoken')

//--------------------------------------------END OF IMPORTS----------------------------------------//

exports.auth = async (req, res, next) => {
  if(!req.cookies.token){
    res.status(500).json({message: "missing jwt token"})
    return
  }
  const token = req.cookies.token
  
  try{
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  next()  
  }catch(err){
    res.status(400).json({message: "did not decode"})
  }
}
    
  
  


