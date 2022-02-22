const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    if (request.cookies.id == undefined){
        res.redirect('/editor/login')
    }
    else{
        res.sendFile('edit.html',{root:'./editor/views'});
    }
    
});

router.route("/login")
.get((request,res) =>
{   
    res.render('login',{root:'./editor/views',text:""})
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
        res.redirect('/editor')
    }
    else if (isLoged){
        
        res.render('login',{root:'./editor/views',text:'This account is already logged in!'})
    }
    else{
        res.render('login',{root:'./editor/views',text:'Wrong credentials!'})
    }

});

router.route("/register")
.get((request,res) =>
{   
    res.render('register',{root:'./editor/views'});
})
.post(async(request,res) =>
{   
    let registred = await AccountManager.register(request.body.name,request.body.password,request.body.confirm)
    if (registred){
        res.render('register',{root:'./editor/views',text:'Registration completed! You can log in!'})
    }
    else{
        if (request.body.confirm!= request.body.password){
            res.render('register',{root:'./editor/views',text:'Confirmation and password are not same!'})
        }
        res.render('register',{root:'./editor/views',text:'That name is already used!'})
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