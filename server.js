"use strict";
exports.__esModule = true;
var path = require('path');
var http = require('http');
var express = require('express');
var a = require('./services/db/DbConnect.js');
var Socket_js_1 = require("./services/socket/Socket.js");
var app = express();
var server = http.createServer(app);
//const io = socketio(server);
var socketConnection = Socket_js_1.Socket.get();
socketConnection.setServerSocket(server);
var io = socketConnection.getServerSocket();
var Path = require('./editor/js/Path');
app.use(express.static(__dirname));
var editor = require("./routes/editor.js");
var main = require("./routes/main.js");
var gameSpace = require("./routes/gameSpace.js");
app.use('/', main);
app.use('/editor', editor);
app.use('/gameSpace', gameSpace);
var PORT = process.env.PORT || 8001;
server.listen(PORT, function () { return console.log("Server running on port ".concat(PORT)); });
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
