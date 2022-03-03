const cons = require('consolidate');
const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')


let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    res.sendFile('room.html',{root:'./editor/views'});
});


module.exports = router;