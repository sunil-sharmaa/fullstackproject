const express = require('express');
const router = express.Router();
const User = require('../models/user')


router.get('/data',async(req,res)=>{
    let getdata = await User.find();
    res.send(getdata)
})

module.exports = router