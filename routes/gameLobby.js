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
        let existingRoomsIds = Array.from(GameManager.getActiveRooms().keys())
        console.log('existing rooms:')
        //console.log(existingRoomsId)

        let filteredNames = []
        if(request.query.players!=undefined && request.query.tiles!= undefined && request.query.questions){
    
            let p = await GameFinder.getIntance().findByMaxPlayers(parseInt(request.query.players))
            let size = 25;
            if(request.query.tiles.substring(0,2) == 'St' || request.query.tiles.substring(0,2) == 'Mi'){
               size = 50
            }
            else if (request.query.tiles.substring(0,2) == 'Lo' || request.query.tiles.substring(0,2) == 'Dl'){
               size = 100000
            }
         
            let len = p.length
           
            for (let i = 0; i < len; i ++){
               let game = p[i]
               let gameInfo = await TileFinder.getIntance().findByGameId(game.getId())
               console.log('dlzka je :'+ gameInfo.length)
               if (gameInfo.length <= size){
           
                   let add = true;
                   if (request.query.questions == 'true'){
                       console.log('je true')
                       add = false
                       gameInfo.forEach((tile)=>{
                           if (tile.getQuestionId() >= 0 || tile.getRandomQuestion()){
                               add = true
                               console.log('nachadza sa otayzka')
                           }
                       })
                   }
              
                   if (add){
                    filteredNames.push(game.getName())
                   }
                  
                   console.log('pridal')
                   console.log(filteredNames)
                
               }
              
            }
        }
        else{
            filteredNames = a.slice()
        }
        if (request.query.full == undefined){
            res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,rooms:rooms,filteredNames:filteredNames,scores:sendScores,text:text,players:players,existingRoomsIds:existingRoomsIds});
        }
        else{
            console.log('aspon zachytil ze hra je plna')
            res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,rooms:rooms,filteredNames:filteredNames,scores:sendScores,text:text,players:players,full:true,existingRoomsIds:existingRoomsIds});
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
                
router.route("/players/:players/tiles/:tiles/questions/:questions")
.get(async(request,res) =>
{  
 console.log('parametre su:')
 console.log(request.params)
 let p = await GameFinder.getIntance().findByMaxPlayers(parseInt(request.params.players))
 let size = 25;
 if(request.params.tiles.substring(0,2) == 'St' || request.params.tiles.substring(0,2) == 'Mi'){
    size = 50
 }
 else if (request.params.tiles.substring(0,2) == 'Lo' || request.params.tiles.substring(0,2) == 'Dl'){
    size = 100000
 }
 let names = []
 let len = p.length

 for (let i = 0; i < len; i ++){
    let game = p[i]
    let gameInfo = await TileFinder.getIntance().findByGameId(game.getId())
    console.log('dlzka je :'+ gameInfo.length)
    if (gameInfo.length <= size){

        let add = true;
        if (request.params.questions == 'true'){
            console.log('je true')
            add = false
            gameInfo.forEach((tile)=>{
                if (tile.getQuestionId() >= 0 || tile.getRandomQuestion()){
                    add = true
                    console.log('nachadza sa otayzka')
                }
            })
        }
   
        if (add){
            names.push(game.getName())
        }
       
        console.log('pridal')
        console.log(names)
     
    }
   
 }


 console.log('mena su:')
 console.log(names)
 let acc = AccountManager.getAccountByClientId(request.cookies.id)
    let text;
    if (request.cookies.language == 'SK'){
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    }
    else{
        text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getEN())
    }
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
    let existingRoomsIds = Array.from(GameManager.getActiveRooms().keys())
    console.log('existing rooms:')
    //console.log(existingRoomsId)

    if (request.query.full == undefined){
        res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,filteredNames:names,rooms:rooms,scores:sendScores,text:text,players:players,existingRoomsIds:existingRoomsIds});
    }
    else{
        console.log('aspon zachytil ze hra je plna')
        res.render('gameLobby.pug',{root:'./editor/views',gameNames:a,filteredNames:names,rooms:rooms,scores:sendScores,text:text,players:players,full:true,existingRoomsIds:existingRoomsIds});
    }
 // res.render('register',{root:'./editor/views'
 })

module.exports = router;