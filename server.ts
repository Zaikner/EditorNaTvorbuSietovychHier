import { Server } from "http";

const path = require('path');
const http = require('http');
const express = require('express');
const DbConnect = require('./services/db/DbConnect.js')
import { Server as ioServer } from "socket.io";
import {Game_db} from './services/db/RDG/Game_db.js'
import {GameFinder} from './services/db/RDG/GameFinder_db.js'
import {Tile_db} from './services/db/RDG/Tile_db.js'
import { Background_db } from "./services/db/RDG/Background_db.js";
const busboy = require('connect-busboy');
var CryptoJS = require("crypto-js");
var cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
const SocketServer = require('./services/socket/SocketServer.js')
const AccountManager = require('./backEnd/Accounts/AccountManager.js')
//const GameManager = require('./backEnd/Game/GameManager.js')
//const multer  = require('multer')
//import {Socket} from './services/socket/Socket.js';

const app = express();
const server:Server = http.createServer(app);
const io = new ioServer(server);
const bodyParser = require('body-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.set('views', __dirname + '/editor/views');
//app.use(multer)
// app.use(fileUpload({
//   createParentPath: true
// }));

//const socketConnection = Socket.get();
// socketConnection.setServerSocket(server);
// const io = socketConnection.getServerSocket()
const Path = require('./editor/js/Path');

app.use(fileUpload());
app.use(express.static(__dirname));
const editor = require("./routes/editor.js")
const main = require("./routes/main.js")
const gameLobby = require("./routes/gameLobby.js")
const account = require("./routes/account.js")
const logout = require("./routes/logout.js")
const room = require("./routes/room.js")
const loginOrGuest = require("./routes/loginOrGuest.js")
const playAsGuest = require("./routes/playAsGuest.js")
const showGame = require("./routes/showGame.js")
const createRoom = require("./routes/createRoom.js")
const createQuestion = require("./routes/createQuestion.js")





app.use('/',main);
app.use('/editor',editor);
app.use('/gameLobby',gameLobby);
app.use('/account',account);
app.use('/logout',logout);
app.use('/room',room);
app.use('/loginOrGuest',loginOrGuest);
app.use('/playAsGuest',playAsGuest);
app.use('/showGame',showGame);
app.use('/createRoom',createRoom);
app.use('/createQuestion',createQuestion);
const PORT = process.env.PORT || 8001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



SocketServer.setIo(io)
SocketServer.serverListen()
