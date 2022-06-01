const express = require('express');
const path = require('path');
const SocketServer = require('../services/socket/SocketServer.js')
const AccountManager = require('../backEnd/Accounts/AccountManager.js')
const { TextsFinder } = require('../services/db/RDG/TextFinder.js');
let router = express.Router()

router
.route("/")
.get( async(request,res) =>
{   
    let acc = AccountManager.getAccountByClientId(request.cookies.id)
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    if (request.cookies.id != undefined && acc != undefined){
        console.log('editor redirectuje')
          
            res.render('edit',{root:'./editor/views',text:text});
          
        
        
    }
    else{
        res.redirect('/editor/login')}
    
});

router.route("/login")
.get(async(request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())

    res.render('login',{root:'./editor/views',text:"",action:'/editor/login',texts:text})
})
.post(async(request,res) =>
{   

    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
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
        
        res.render('login',{root:'./editor/views',text:text[163], texts:text,action:'/editor/login'})
    }
    else{
        res.render('login',{root:'./editor/views',text:text[164],texts:text,action:'/editor/login'})
    }

});

router.route("/register")
.get(async(request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())

    res.render('register',{root:'./editor/views',action : '/editor/register',texts:text});
})
.post(async(request,res) =>
{   

    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())

    let registred = await AccountManager.register(request.body.name,request.body.password,request.body.confirm)
    if (registred){
        let registred = await AccountManager.authenticate(request.body.name,request.body.password)
        res.cookie('id',registred[1].getClientId())
        res.cookie('mode','account')
        res.redirect('/editor/setId?id='+registred[1].getClientId())
        //res.render('register',{root:'./editor/views',text:'Registration completed! You can log in!',action : '/editor/register'})
    }
    else{
        if (request.body.confirm!= request.body.password){
            res.render('register',{root:'./editor/views',text:text[171],action : '/editor/register',texts:text})
            return
        }
        res.render('register',{root:'./editor/views',text:text[172],action : '/editor/register',texts:text})
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
{   
    res.sendFile('setClientId.html',{root:'./editor/views'});
});




module.exports = router;