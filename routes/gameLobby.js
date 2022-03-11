const express = require('express');
const path = require('path');

const AccountManager = require('../backEnd/Accounts/AccountManager.js');
const { Account_db } = require('../services/db/RDG/Account_db.js');
const { GameFinder } = require('../services/db/RDG/GameFinder_db.js');
const { Game_db } = require('../services/db/RDG/Game_db.js');

let router = express.Router()

router
.route("/")
.get( async(request,res) =>
{   
    console.log(await GameFinder.getIntance().findAll())
    let a = (await GameFinder.getIntance().findAll()).map((game) => game.getName())
    res.render('gameLobby.pug',{root:'./editor/views',gameNames:a});
});


router.route("/login")
.get((request,res) =>
{   
    
    res.render('login',{root:'./editor/views',text:"",action:'/gameLobby/login'})
})
.post(async(request,res) =>
{   
    let isLoged = AccountManager.isLogged(request.body.name)
    let registred = await AccountManager.authenticate(request.body.name,request.body.password)
    
    if (registred == undefined){
        registred = [false]
    }
    if (registred[0] && !isLoged){
        res.cookie('id',registred[1].getClientId())
        //res.redirect('/editor/setId?id='+registred[1].getClientId())
        res.redirect('/gameLobby')
    }
    else if (isLoged){
        
        res.render('login',{root:'./editor/views',text:'This account is already logged in!',action:'/gameLobby/login'})
    }
    else{
        res.render('login',{root:'./editor/views',text:'Wrong credentials!',action:'/gameLobby/login'})
    }

});
router.route("/register")
.get((request,res) =>
{   
    res.render('register',{root:'./editor/views',action : '/gameLobby/register'});
})
.post(async(request,res) =>
{   
    let registred = await AccountManager.register(request.body.name,request.body.password,request.body.confirm)
    if (registred){
        res.render('register',{root:'./editor/views',text:'Registration completed! You can log in!',action : '/gameLobby/register'})
    }
    else{
        if (request.body.confirm!= request.body.password){
            res.render('register',{root:'./editor/views',text:'Confirmation and password are not same!',action : '/gameLobby/register'})
        }
        res.render('register',{root:'./editor/views',text:'That name is already used!',action : '/gameLobby/register'})
    }

});


module.exports = router;