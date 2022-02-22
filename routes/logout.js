const cons = require('consolidate');
const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')


let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    
    AccountManager.logout(request.cookies.id)
    res.clearCookie("id");
    
    res.sendFile('logout.html',{root:'./editor/views'});
});


module.exports = router;