const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')
const multer  = require('multer')
let router = express.Router()
const FileReader = require('filereader');
const reader = new FileReader();
const utilities = require('./../editor/js/utilityFunctions.js');
const { AccountFinder } = require('../services/db/RDG/AccountFinder.js');
router
.route("/")
.get((request,res) =>
{   
  
    let acc = AccountManager.getAccountByClientId(request.cookies.id)

    if (request.cookies.id != undefined && acc != undefined){
     
        if (acc.getIsGuest() === true){

            res.redirect('/account/login')
        }
        else{
            var f = ''
            if (acc.getAvatar() === ''){
                f = '../../src/emptyAvatar.jpg'
            }
            else{
                f = acc.getAvatar()
                //console.log(f)
            }
            res.render('account.pug',{root:'./editor/views',file:f});
        }
        
        
    }
    else{
        res.redirect('/account/login')}
    
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
router
.route("/change/avatar")
.get((request,res) =>
{   
  
    res.sendFile('changeAvatar.html',{root:'./editor/views'});
    
}).post(async(req,res) =>
{   
   
    //console.log('data:image/jpeg;base64,'+Buffer.from(req.files.avatar.data, "base64").toString("base64"))
    let acc = AccountManager.getAccountByClientId(req.cookies.id)
    if (acc != undefined){
        let avatar = 'data:image/jpeg;base64,'+Buffer.from(req.files.avatar.data, "base64").toString("base64")
        acc.setAvatar(avatar)
        AccountManager.changeAvatar(acc.getName(),avatar)
        //let accDb = AccountFinder.getIntance().findByName(acc.getName())
        //accDb.setAvatar('data:image/jpeg;base64,'+Buffer.from(req.files.avatar.data, "base64").toString("base64"))
        //accDb.update()
        res.redirect('/account')
    }
    else{
        res.redirect('/account/login')
    }
   
});
;
router
.route("/change/avatar/id/:id")
.post(async(request,res) =>
{   
   
   console.log(request)
   let avatar = request.files.avatar;
   res.sendFile('changeAvatar.html',{root:'./editor/views'});
});
;


router
.route("/change/password")
.get((request,res) =>
{   
    
    res.render('changePassword',{root:'./editor/views',text:''})
    
})
.post(async(request,res) =>
{   
    let acc = AccountManager.getAccountByClientId(request.cookies.id)
    if (acc != undefined){
        if (request.body.oldPassword === AccountManager.decode(acc.getPassword())){
            if (request.body.confirm!= request.body.password){
                res.render('changePassword',{root:'./editor/views',text:'Confirmation and password are not same!'})
            }
            else{
                
                AccountManager.changePassword(acc.getName(),request.body.password)
                res.render('changePassword',{root:'./editor/views',text:'Password changed!'})
            }
        }
        else{
            res.render('changePassword',{root:'./editor/views',text:'Wrong old password!'})
        }
        
    }
    else{
        res.redirect('/account/login')
    }
   
   
});
;

module.exports = router;