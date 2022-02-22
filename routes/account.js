const express = require('express');
const path = require('path');

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    res.sendFile('account.html',{root:'./editor/views'});
});


router
.route("/id/:id")
.get((request,res) =>
{   console.log(request.params)
    res.sendFile('account.html',{root:'./editor/views'});
});
// router
// .route("/id/:id")
// .get((request,res) =>
// {   console.log(request.params)
    
//     res.sendFile('edit.html',{root:'./editor/views'});
//     //res.sendFile('main.html',{root:'./editor/views'});
// });

module.exports = router;