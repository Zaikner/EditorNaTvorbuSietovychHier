"use strict";
exports.__esModule = true;
var path = require('path');
var http = require('http');
var express = require('express');
var Socket_js_1 = require("./services/socket/Socket.js");
var app = express();
var server = http.createServer(app);
//const io = socketio(server);
var socketConnection = Socket_js_1.Socket.get();
socketConnection.setServerSocket(server);
//socketConnection.setClientSocket('http://localhost:8001');
var io = socketConnection.getServerSocket();
var Path = require('./editor/js/Path');
app.use(express.static(__dirname));
var editor = require("./routes/editor.js");
app.use('/', editor);
var PORT = process.env.PORT || 8001;
server.listen(PORT, function () { return console.log("Server running on port ".concat(PORT)); });
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('skuska', function () { console.log("Client pripojeny, vysiela."); });
    socket.on('saveEditingTrack', function (data) {
        var newPath = new Path(data.points, data.type, data.length);
        console.log(newPath);
    });
});
