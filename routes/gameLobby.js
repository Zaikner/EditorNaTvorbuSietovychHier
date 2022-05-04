const express = require('express');
const path = require('path');

const AccountManager = require('../backEnd/Accounts/AccountManager.js');
const GameManager = require('../backEnd/Game/GameManager.js');
const { Player } = require('../backEnd/Game/Player.js');
const { AccountFinder } = require('../services/db/RDG/AccountFinder.js');
const { Account_db } = require('../services/db/RDG/Account_db.js');
const { GameFinder } = require('../services/db/RDG/GameFinder_db.js');
const { Game_db } = require('../services/db/RDG/Game_db.js');
const { TextsFinder } = require('../services/db/RDG/TextFinder.js');

let router = express.Router()

router
.route("/")
.get( async(request,res) =>
{   
    console.log('gameLobbyparams:')
    console.log(request.query)
    let acc = AccountManager.getAccountByClientId(request.cookies.id)
    let text;
    if (request.cookies.language == 'SK'){
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    }
    else{
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getEN())
    }
    
    
    //console.log(text)
    if (request.cookies.id != undefined && acc != undefined){
        //console.log(await GameFinder.getIntance().findAll())
        let a = (await GameFinder.getIntance().findAllPublished()).map((game) => game.getName())
        let rooms = Array.from(GameManager.getActiveRooms().values())
        .map(room => [room.getId(),
            "Room: "+room.getId()+ "  Game: "+ room.getGameName()+"   Players:  "+ room.getPlayers().length+'/'+room.getMaxPlayers(),
            room.getGameName(),
            room.getHasStarted()
           ])
        console.log('poslal rooms:')
        console.log(rooms)
        let scores =await AccountFinder.getIntance().findAllByOrderedScore()
        let sendScores = []
        for (let i = 1 ; i<= scores.length;i++){
            sendScores.push([i,scores[i-1].getName(),scores[i-1].getScore()])
        }
        let players = GameManager.getActivePlayers(acc)
        //console.log(rooms)
        //console.log(sendScores)
        if (request.query.full == undefined){
            res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,rooms:rooms,scores:sendScores,text:text,players:players});
        }
        else{
            console.log('aspon zachytil ze hra je plna')
            res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,rooms:rooms,scores:sendScores,text:text,players:players,full:true});
        }
        
        
        
    }
    else{
        res.redirect('/gameLobby/login')
    }
  
});


router.route("/login")
.get(async(request,res) =>
{   
    let text;
    if (request.cookies.language == 'SK'){
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    }
    else{
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getEN())
    }
    res.render('login',{root:'./editor/views',text:"",action:'/gameLobby/login',texts:text})
})
.post(async(request,res) =>
{    let text;
    if (request.cookies.language == 'SK'){
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    }
    else{
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getEN())
    }

    let isLoged = AccountManager.isLogged(request.body.name)
    let registred = await AccountManager.authenticate(request.body.name,request.body.password)
    
    if (registred == undefined){
        registred = [false]
    }
    if (registred[0] && !isLoged){
        res.cookie('id',registred[1].getClientId())
        /res.cookie('mode','game')
        res.redirect('/editor/setId?id='+registred[1].getClientId())
    }
    else if (isLoged){
        
        res.render('login',{root:'./editor/views',text:'This account is already logged in!',action:'/gameLobby/login',texts:text})
    }
    else{
        res.render('login',{root:'./editor/views',text:'Wrong credentials!',action:'/gameLobby/login',texts:text})
    }

});
router.route("/register")
.get((request,res) =>
{   
    res.render('register',{root:'./editor/views',action : '/gameLobby/register',texts:text});
})
.post(async(request,res) =>
{   
    let registred = await AccountManager.register(request.body.name,request.body.password,request.body.confirm)
    if (registred){
        res.render('register',{root:'./editor/views',text:'Registration completed! You can log in!',action : '/gameLobby/register',texts:text})
    }
    else{
        if (request.body.confirm!= request.body.password){
            res.render('register',{root:'./editor/views',text:'Confirmation and password are not same!',action : '/gameLobby/register',texts:text})
        }
        res.render('register',{root:'./editor/views',text:'That name is already used!',action : '/gameLobby/register',texts:text})
    }

});


module.exports = router;