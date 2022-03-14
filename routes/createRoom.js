const cons = require('consolidate');
const express = require('express');
const path = require('path');
const GameManager = require('../backEnd/Game/GameManager.js');
const Room = require('../backEnd/Game/Room');
const { AccountFinder } = require('../services/db/RDG/AccountFinder');
const { GameFinder } = require('../services/db/RDG/GameFinder_db');
let router = express.Router()

router
.route("/name/:name")
.get(async (request,res) =>
{   

    let games =  await GameFinder.getIntance().findByName(request.params.name)
    let game = games[0]
 
    let room = await GameManager.createRoom(request.params.name,game.getNumOfPlayers())
  
    res.redirect("/room?id="+await room.getId()+"&name="+request.params.name)
  
});

module.exports = router;