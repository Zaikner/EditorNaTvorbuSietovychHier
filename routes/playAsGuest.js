const express = require('express');
const path = require('path');

let router = express.Router()
const AccountManager = require('../backEnd/Accounts/AccountManager.js')

router
.route("/")
.get((request,res) =>
{   
    var logged = AccountManager.logGuest()
    res.cookie('id',logged.getClientId())
    res.redirect('/gamelobby')
});



module.exports = router;