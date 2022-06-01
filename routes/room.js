const cons = require('consolidate');
const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')
const GameManager = require('../backEnd/Game/GameManager.js')
const { TextsFinder } = require('../services/db/RDG/TextFinder.js');
const ServerSocket = require('../services/socket/SocketServer.js')

let router = express.Router()

router
.route("/")
.get(async(request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    let r = GameManager.getActiveRooms().get(parseInt(request.query.id))
    GameManager.reloadTables()
  
    if (r== undefined){
        if (request.query.name == undefined){
            GameManager.reloadTables()
            res.redirect("/room?id="+request.query.room+'&name='+request.query.name)
            }
            else{
                res.redirect('/gameLobby')
            }
    }
    else if (r != undefined)
    {
        if ( r.getHasStarted()){
            res.redirect('/gameLobby?full=true')
        }
        else{
            if (request.query.name == undefined){
                 res.redirect("/room?id="+request.query.room+'&name='+request.query.name)
                 }
                 else{
                     GameManager.reloadTables()
                     res.render('room',{root:'./editor/views',texts:text,id:request.query.id,name:r.getGameName()});
                 }
        }
    }   
});

module.exports = router;