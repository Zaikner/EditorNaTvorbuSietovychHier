const express = require('express');
const path = require('path');
const  GameManager  = require('../backEnd/Game/GameManager.js');
const { TextsFinder } = require('../services/db/RDG/TextFinder.js');

let router = express.Router()

router
.route("/")
.get(async(request,res) =>
{   if (request.query.name == undefined || ! await GameManager.gameExists(request.query.name)){
        res.redirect('/gameLobby')
    }
    else{
        let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
        res.render('gamePreview',{root:'./editor/views',texts:text});
    }
});


module.exports = router;