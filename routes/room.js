const cons = require('consolidate');
const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')


let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    // console.log(request.query)
    // console.log(request.params)
    if (request.query.name == undefined){
    //     request.query = {name: "hra", room:request.query.room}
           res.redirect("/room?room="+request.query.room+'&name=Hra2')
    }
    // console.log('sem ho poslal')
    res.sendFile('room.html',{root:'./editor/views'});
});


module.exports = router;