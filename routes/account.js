const express = require('express');
const path = require('path');
const AccountManager = require('../backEnd/Accounts/AccountManager.js')
const multer  = require('multer')
let router = express.Router()
const FileReader = require('filereader');
const reader = new FileReader();
const utilities = require('./../editor/js/utilityFunctions.js');
const { AccountFinder } = require('../services/db/RDG/AccountFinder.js');
const { TextsFinder } = require('../services/db/RDG/TextFinder.js');
router
.route("/")
.get(async(request,res) =>
{   
  
    let acc = AccountManager.getAccountByClientId(request.cookies.id)
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())

    let name = request.query.name
    let visitAcc = undefined
    let edit = true
    if (name!= undefined){
        visitAcc = await AccountManager.findAccountByName(name)
        acc = visitAcc
        edit = false
    }
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
            
            }
            
            
            res.render('account.pug',{root:'./editor/views',file:f,text:text,score:acc.getScore(),gameWon:acc.getGameWon(),gameLost:acc.getGameLost(),name:acc.getName(),edit:edit});
        }
        
        
    }
    else{
        res.redirect('/account/login')}
    
});


router.route("/login")
.get(async(request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    res.render('login',{root:'./editor/views',text:"",action:'/account/login',texts:text})
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
        res.cookie('mode','account')
        res.redirect('/editor/setId?id='+registred[1].getClientId())
        
    }
    else if (isLoged){
      
        res.render('login',{root:'./editor/views',text:text[163],action:'/account/login',texts:text})
    }
    else{
      
        res.render('login',{root:'./editor/views',text:text[164],action:'/account/login',texts:text})
    }

});
router
.route("/change/avatar")
.get(async(request,res) =>
{   

    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    res.render('changeAvatar.pug',{root:'./editor/views',texts:text});
    
}).post(async(req,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    let acc = AccountManager.getAccountByClientId(req.cookies.id)
    if (acc != undefined){
        let avatar = 'data:image/jpeg;base64,'+Buffer.from(req.files.avatar.data, "base64").toString("base64")
        acc.setAvatar(avatar)
       
        AccountManager.changeAvatar(acc.getName(),avatar)
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
   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
  
   let avatar = request.files.avatar;
   res.render('changeAvatar.pug',{root:'./editor/views',texts:text});
});
;


router
.route("/change/password")
.get(async(request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    res.render('changePassword',{root:'./editor/views',text:'',texts:text})
    
})
.post(async(request,res) =>
{   
    let text =  (await TextsFinder.getIntance().findAll()).map((txt)=>txt.getSK())
    let acc = AccountManager.getAccountByClientId(request.cookies.id)
    if (acc != undefined){
        if (request.body.oldPassword === AccountManager.decode(acc.getPassword())){
            if (request.body.confirm!= request.body.password){
                res.render('changePassword',{root:'./editor/views',text:text[165],texts:text})
            }
            else{
                
                AccountManager.changePassword(acc.getName(),request.body.password)
                res.render('changePassword',{root:'./editor/views',text:text[166],texts:text})
            }
        }
        else{
            res.render('changePassword',{root:'./editor/views',text:text[167],texts:text})
        }
        
    }
    else{
        res.redirect('/account/login')
    }
   
   
});
;

module.exports = router;