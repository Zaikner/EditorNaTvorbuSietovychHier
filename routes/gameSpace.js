const express = require('express');
const path = require('path');

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   
    res.sendFile('gameSpace.html',{root:'./editor/views'});
});


module.exports = router;