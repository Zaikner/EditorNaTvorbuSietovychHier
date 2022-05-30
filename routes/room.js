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
    console.log('zavolal room')
    console.log(request.query)
    let r = GameManager.getActiveRooms().get(parseInt(request.query.id))
    GameManager.reloadTables()
    // console.log(GameManager.getActiveRooms())
    // console.log(parseInt(request.query.room))
    // console.log(request.query.room)
    // console.log(r)
  
    if (r== undefined){
        console.log('nova hra')
        if (request.query.name == undefined){
            //     request.query = {name: "hra", room:request.query.room}
            GameManager.reloadTables()
            res.redirect("/room?id="+request.query.room+'&name='+request.query.name)
            }
            else{
                res.redirect('/gameLobby')
                //res.render('room',{root:'./editor/views',texts:text,id:request.query.id,name:r.getGameName()});
            }
            
            console.log('sem ho poslal')
    }
    else if (r != undefined)
    {
        if ( r.getHasStarted()){
            res.query
            res.redirect('/gameLobby?full=true')
            //res.redirect("/room?id="+request.query.room+'&name='+request.query.name)
        }
        else{
            // console.log('hra este nezacala!')
            if (request.query.name == undefined){
                 //     request.query = {name: "hra", room:request.query.room}
                 res.redirect("/room?id="+request.query.room+'&name='+request.query.name)
                 console.log('poslal tadeto a zavolal ' + "/room?id="+request.query.room+'&name='+request.query.name)
                 }
                 else{
                     console.log('poslal inakade')
                     GameManager.reloadTables()
                     res.render('room',{root:'./editor/views',texts:text,id:request.query.id,name:r.getGameName()});
                 }
                
            //     console.log('sem ho poslal')
            //res.redirect("/room?id="+request.query.room+'&name='+r.getGameName())
            //res.sendFile('room.html',{root:'./editor/views'});
        }
    }
  
   // console.log(request.params)
  
    
});


module.exports = router;