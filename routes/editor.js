const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/AccountManager.js')

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    res.sendFile('edit.html',{root:'./editor/views'});
});

router.route("/login")
.get((request,res) =>
{   
    res.render('login',{root:'./editor/views',text:""})
})
.post(async(request,res) =>
{   
    let registred = await AccountManager.authenticate(request.body.name,request.body.password)
    if (registred){
        res.redirect('/')
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
    //res.sendFile('register.html',{root:'./editor/views'});
  //res.render('registerProblem',{root:'./editor/views'})
});




module.exports = router;