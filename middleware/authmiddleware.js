//import status code for statuse code
const {StatusCodes} = require('http-status-codes')

//import jsonwebtoken for verification
const jwt = require('jsonwebtoken')

async function authmiddleware(req,res,next){
  const authheader = req.headers.authorization

  if(!authheader || !authheader.startsWith('Bearer')){
    return res.status(StatusCodes.UNAUTHORIZED).json({error:'authentication invalid'})
  }

  const token = authheader.split(' ')[1]
  console.log(authheader)
  console.log(token);
  

  try {
    const {username,userid} = jwt.verify(token,"secret")
    req.user = {username,userid}
    next()
    
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({error:'authentication invalid'})
  }
}

module.exports = authmiddleware