const cons = require('consolidate');
const express = require('express');
const path = require('path');

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    console.log(request.body)
    console.log('vykonal get ')
    //console.log(request)
    res.sendFile('main.html',{root:'./editor/views'});
})
.post((request,res) =>
{   
    console.log(request.body)
    console.log('vykonal put ')
    res.redirect('/editor')
    //console.log(request)
    //res.sendFile('edit.html',{root:'./editor/views'});
});

module.exports = router;