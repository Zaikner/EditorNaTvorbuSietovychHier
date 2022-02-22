const express = require('express');
const path = require('path');

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    res.sendFile('main.html',{root:'./editor/views'});
});

router
.route("/id/:id")
.get((request,res) =>
{   console.log(request.params)
    res.sendFile('main.html',{root:'./editor/views'});
});


module.exports = router;