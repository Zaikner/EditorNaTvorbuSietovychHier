const express = require('express');
const path = require('path');
const { TextsFinder } = require('../services/db/RDG/TextFinder.js');

let router = express.Router()

router
.route("/")
.get( async (request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    res.render('main',{root:'./editor/views',texts:text});
});

router
.route("/id/:id")
.get((request,res) =>
{   console.log(request.params)
    res.render('main',{root:'./editor/views'});
});


module.exports = router;