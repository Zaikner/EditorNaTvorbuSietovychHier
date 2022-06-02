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
const { TileFinder } = require('../services/db/RDG/TileFinder.js');

let router = express.Router()

router
.route("/")
.get( async(request,res) =>
{   
    let acc = AccountManager.getAccountByClientId(request.cookies.id)
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())

    if (request.cookies.id != undefined && acc != undefined){
        let a = (await GameFinder.getIntance().findAllPublished()).map((game) => game.getName())
        let rooms = Array.from(GameManager.getActiveRooms().values())
        .map(room => [room.getId(),
            "Miestnosť: "+room.getId()+ "  Hra: "+ room.getGameName()+"   Hráči:  "+ room.getPlayers().length+'/'+room.getMaxPlayers(),
            room.getGameName(),
            room.getHasStarted()
           ])

        let scores =await AccountFinder.getIntance().findAllByOrderedScore()
        let sendScores = []
        for (let i = 1 ; i<= scores.length;i++){
            sendScores.push([i,scores[i-1].getName(),scores[i-1].getScore()])
        }
        let players = GameManager.getActivePlayers(acc)
        let playerNames = players.map(p=>p[0])
        let existingRoomsIds = Array.from(GameManager.getActiveRooms().keys())

        let filteredNames = []
        let numOfPlayers = 6;
        let size = '100000'
        let questions = false;
        if(request.query.players!=undefined && request.query.tiles!= undefined && request.query.questions){
            numOfPlayers = request.query.players
            if (request.query.questions == 'true'){
                questions = true
            }
            else{
                questions = false
            }
           
            let p = await GameFinder.getIntance().findByMaxPlayers(parseInt(request.query.players))
            size = parseInt(request.query.tiles)         
            let len = p.length
           
            for (let i = 0; i < len; i ++){
               let game = p[i]
               let gameInfo = await TileFinder.getIntance().findByGameId(game.getId())

               if (gameInfo.length <= size){
           
                   let add = true;
                   if (request.query.questions == 'true'){
                       add = false
                       gameInfo.forEach((tile)=>{
                           if (tile.getQuestionId() >= 0 || tile.getRandomQuestion()){
                               add = true
                           }
                       })
                   }
              
                   if (add){
                    filteredNames.push(game.getName())
                   }                
               }
              
            }
        }
        else{
            filteredNames = a.slice()
        }
        if (request.query.full == undefined){
            res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,rooms:rooms,filteredNames:filteredNames,scores:sendScores,text:text,players:players,existingRoomsIds:existingRoomsIds,numOfPlayers:numOfPlayers,questions:questions,numOfTiles:size.toString(),playerNames:playerNames});
        }
        else{
            res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,rooms:rooms,filteredNames:filteredNames,scores:sendScores,text:text,players:players,full:true,existingRoomsIds:existingRoomsIds,numOfPlayers:numOfPlayers,questions:questions,numOfTiles:size.toString(),playerNames:playerNames});
        }    
    }
    else{
        res.redirect('/gameLobby/login')
    }
  
});


router.route("/login")
.get(async(request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    res.render('login',{root:'./editor/views',text:"",action:'/gameLobby/login',texts:text})
})
.post(async(request,res) =>
{   let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
   
    let registred = await AccountManager.authenticate(request.body.name,request.body.password)
    
    if (registred == undefined){
        registred = [false]
    }
    if (registred[0]){
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