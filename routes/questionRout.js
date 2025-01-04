const express = require('express')

const router = express.Router()

//authuntication middle ware
const authmiddleware = require('../middleware/authmiddleware')

router.get('/all-questions',authmiddleware,(req,res)=>{
    res.send('all questions')
})

module.exports = router