const cons = require('consolidate');
const express = require('express');
const path = require('path');

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    res.sendFile('main.html',{root:'./editor/views'});
})
.post((request,res) =>
{   
    res.redirect('/editor')
});

module.exports = router;