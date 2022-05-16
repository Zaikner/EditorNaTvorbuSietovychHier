const express = require('express');
const path = require('path');
const { TextsFinder } = require('../services/db/RDG/TextFinder.js');
let router = express.Router()

router
.route("/")
.get(async(request,res) =>
{   console.log(request.params)
    let text;
    if (request.cookies.language == 'SK'){
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    }
    else{
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getEN())
    }
    res.render('gamePreview',{root:'./editor/views',texts:text});
});


module.exports = router;