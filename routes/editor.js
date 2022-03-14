const express = require('express');
const path = require('path');
const SocketServer = require('../services/socket/SocketServer.js')
const AccountManager = require('../backEnd/Accounts/AccountManager.js')

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    let acc = AccountManager.getAccountByClientId(request.cookies.id)

    if (request.cookies.id != undefined && acc != undefined){
        if (acc.getIsGuest() === true){
            
            res.redirect('/editor/login')
        }
        else{
            //SocketServer.getIo().emit('connected')
            console.log('editor redirectuje')
            let acc = AccountManager.getAccountByClientId(request.cookies.id)
           
            res.sendFile('edit.html',{root:'./editor/views'});
          
            // console.log(SocketServer.getIo().to(acc.getSocketId()))
            // console.log(SocketServer.getIo().to(acc.getSocketId()).emit('connected'))
            // SocketServer.getIo().to(acc.getSocketId()).emit('connected')
            //console.log(io)
        }
        
        
    }
    else{
        res.redirect('/editor/login')}
    
});

router.route("/login")
.get((request,res) =>
{   
    res.render('login',{root:'./editor/views',text:"",action:'/editor/login'})
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
        res.cookie('mode','editor')
        res.redirect('/editor/setId?id='+registred[1].getClientId())
        //res.redirect('/editor')
    }
    else if (isLoged){
        
        res.render('login',{root:'./editor/views',text:'This account is already logged in!',action:'/editor/login'})
    }
    else{
        res.render('login',{root:'./editor/views',text:'Wrong credentials!',action:'/editor/login'})
    }

});

router.route("/register")
.get((request,res) =>
{   
    res.render('register',{root:'./editor/views',action : '/editor/register'});
})
.post(async(request,res) =>
{   
    let registred = await AccountManager.register(request.body.name,request.body.password,request.body.confirm)
    if (registred){
        res.render('register',{root:'./editor/views',text:'Registration completed! You can log in!',action : '/editor/register'})
    }
    else{
        if (request.body.confirm!= request.body.password){
            res.render('register',{root:'./editor/views',text:'Confirmation and password are not same!',action : '/editor/register'})
        }
        res.render('register',{root:'./editor/views',text:'That name is already used!',action : '/editor/register'})
    }

});

// router
// .route("/id/:id")
// .get((request,res) =>
// {   console.log(request.params)
    
//     res.sendFile('edit.html',{root:'./editor/views'});
//     //res.sendFile('main.html',{root:'./editor/views'});
// });

router
.route("/setId")
.get((request,res) =>
{   console.log(request.params)
    console.log(request.query)
    res.sendFile('setClientId.html',{root:'./editor/views'});
    //res.sendFile('main.html',{root:'./editor/views'});
});




module.exports = router;