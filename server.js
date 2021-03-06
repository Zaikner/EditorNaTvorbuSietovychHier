"use strict";
exports.__esModule = true;
var path = require('path');
var http = require('http');
var express = require('express');
var socket_io_1 = require("socket.io");
var busboy = require('connect-busboy');
var CryptoJS = require("crypto-js");
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var SocketServer = require('./services/socket/SocketServer.js');
var AccountManager = require('./backEnd/Accounts/AccountManager.js');
var GameManager = require('./backEnd/Game/GameManager.js');
var app = express();
var server = http.createServer(app);
var io = new socket_io_1.Server(server);
var bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', __dirname + '/editor/views');
app.use(fileUpload());
app.use(express.static(__dirname));
var editor = require("./routes/editor.js");
var main = require("./routes/main.js");
var gameLobby = require("./routes/gameLobby.js");
var account = require("./routes/account.js");
var logout = require("./routes/logout.js");
var room = require("./routes/room.js");
var showGame = require("./routes/showGame.js");
var createRoom = require("./routes/createRoom.js");
var createQuestion = require("./routes/createQuestion.js");
app.use('/', main);
app.use('/editor', editor);
app.use('/gameLobby', gameLobby);
app.use('/account', account);
app.use('/logout', logout);
app.use('/room', room);
app.use('/showGame', showGame);
app.use('/createRoom', createRoom);
app.use('/createQuestion', createQuestion);
var PORT = process.env.PORT || 8001;
server.listen(PORT, function () { return console.log("Server running on port ".concat(PORT)); });
SocketServer.setIo(io);
SocketServer.serverListen();
AccountManager.checkLogedAccounts();
