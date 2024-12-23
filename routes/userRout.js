const express = require('express')

const router = express.Router()

//user controllers
const {register,login,checkuser} = require('../controller/usercontroller')
//authuntication middle ware
const authmiddleware = require('../middleware/authmiddleware')

//register rout

router.post('/register',register)

//login user
router.post('/login',login)

// checke user
router.get('/check',authmiddleware,checkuser)

module.exports = router