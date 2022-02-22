const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    if (request.cookies.id == undefined){
        res.redirect('/account/login')
    }
    else{
        res.sendFile('account.html',{root:'./editor/views'});
    }
    
});


router.route("/login")
.get((request,res) =>
{   
    
    res.render('login',{root:'./editor/views',text:"",action:'/account/login'})
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
        res.redirect('/account')
    }
    else if (isLoged){
        
        res.render('login',{root:'./editor/views',text:'This account is already logged in!',action:'/account/login'})
    }
    else{
        res.render('login',{root:'./editor/views',text:'Wrong credentials!',action:'/account/login'})
    }

});


module.exports = router;