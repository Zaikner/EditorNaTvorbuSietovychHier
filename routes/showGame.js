const express = require('express');
const path = require('path');

let router = express.Router()

router
.route("/")
.get((request,res) =>
{   console.log(request.params)
    res.sendFile('gamePlace.html',{root:'./editor/views'});
});


module.exports = router;