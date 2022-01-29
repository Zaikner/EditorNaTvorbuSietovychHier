const express = require('express');
const path = require('path');

let router = express.Router()

console.log("nasiel")
router
.route("/")
.get((request,res) =>
{   
    res.sendFile('edit.html',{root:'./editor/views'});
});


module.exports = router;