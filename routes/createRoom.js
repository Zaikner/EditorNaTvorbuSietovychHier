const cons = require('consolidate');
const express = require('express');
const path = require('path');
const GameManager = require('../backEnd/Game/GameManager.js');
const AccountManager = require('../backEnd/Accounts/AccountManager.js');
const Player = require('../backEnd/Game/Player.js');

const { AccountFinder } = require('../services/db/RDG/AccountFinder');
const { GameFinder } = require('../services/db/RDG/GameFinder_db');
let router = express.Router()

router
.route("/name/:name")
.get(async (request,res) =>
{   
    let acc = AccountManager.getAccountByClientId(request.cookies.id)
    if (acc == undefined){
        res.redirect('/')
    }
    console.log(request.params)
    let games =  await GameFinder.getIntance().findByName(request.params.name)
    console.log(games)
    let game = games[0]
    GameManager.reloadTables()
    let room = await GameManager.createRoom(request.params.name,game.getNumOfPlayers(),acc.getId())
    //room.join(new Player(acc,'Player 1'))
  
    res.redirect("/room?id="+await room.getId()+"&name="+request.params.name)
  
});

module.exports = router;