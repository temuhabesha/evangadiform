//import bcrypt for encryption
const bcrypt = require('bcrypt')

//import status code for statuse code
const {StatusCodes} = require('http-status-codes')

//import json web token for access control
const jwt = require('jsonwebtoken')

//dbconnection
const db_connection = require('../db/db.config')

async function register (req,res){
    const {username,firstname,lastname,email,password} = req.body;

    //check the value of all fields to save the data in to the database starting point
    if(!email || !password || !firstname || !lastname || !username){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'please provide all required fields'})
    }
    //ending point
    try {
        //check the user is register by this user name and email or not starting point
        const [user] = await db_connection.query('SELECT username,userid FROM users WHERE username = ? or email =?',[username,email])
        if(user.length>0){
           return res.status(StatusCodes.BAD_REQUEST).json({msg:"user already registered"})
        }
        //ending point

        //check the length of the password starting point

        if(password.length<8){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"password must be at least 8 characters"})
        }
       // ending point

           //encrypt the password starting point
           const salt = await bcrypt.genSalt(10)
           const hashedpassword = await bcrypt.hash(password,salt)
           //ending point of password encription

        //to insert the data in to the database starting point
        
            await db_connection.query('INSERT INTO users (username,firstname,lastname,email,password) VALUES (?,?,?,?,?)',[username,firstname,lastname,email,hashedpassword])
        return res.status(StatusCodes.CREATED).json({msg:'user registerd'})
        
        // ending point
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'somthin went wrong,try again later'})
        
    }
}
async function login (req,res){
    //distracture the users requst starting point
    const {email,password} = req.body;
    //ending point
    // check the value of all fields are full filled or not starting point
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"please enter all reqired fields"})
    }
     //ending point

    //communicate with database starting point
    try {
        //select the password and userid from the users table and save user variable starting point
        const [user] = await db_connection.query('SELECT username, userid,password FROM users WHERE email=?',[email])
        //endig point
        // check the user is registerd or not by this email
        if(user.length===0){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:'invalid credential'})
        }
        // ending point

        //decrypt the password which i get from the database and compare the password which comes from the user and comes from the database starting point
        const ismatch = await bcrypt.compare(password,user[0].password)
        if(!ismatch){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:'invalid credential'})
        }
        //ending point
        //access control starting point

        //distructure starting point
        const username =user[0].username
        const userid = user[0].userid
        //distructure ending point
        const token = jwt.sign({username,userid},"secret",{expiresIn:"1d"})
        return res.status(StatusCodes.OK).json({msg:"user login successfull",token})
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'somthin went wrong,try again later'})
    }

}
async function checkuser (req,res){
    const username = req.user.username
    const userid = req.user.userid
    res.status(StatusCodes.OK) .json({msg:"valid user",username,userid})
}

module.exports = {register,login,checkuser}