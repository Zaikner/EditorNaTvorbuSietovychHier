const express = require('express');
const path = require('path');

let router = express.Router()
const AccountManager = require('../backEnd/Accounts/AccountManager.js')

router
.route("/")
.get((request,res) =>
{   

    res.sendFile('loginOrGuest.html',{root:'./editor/views'});
});



module.exports = router;