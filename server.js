"use strict";
exports.__esModule = true;
var path = require('path');
var http = require('http');
var express = require('express');
var DbConnect = require('./services/db/DbConnect.js');
var socket_io_1 = require("socket.io");
var busboy = require('connect-busboy');
var CryptoJS = require("crypto-js");
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var SocketServer = require('./services/socket/SocketServer.js');
var AccountManager = require('./backEnd/Accounts/AccountManager.js');
//const GameManager = require('./backEnd/Game/GameManager.js')
//const multer  = require('multer')
//import {Socket} from './services/socket/Socket.js';
var app = express();
var server = http.createServer(app);
var io = new socket_io_1.Server(server);
var bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', __dirname + '/editor/views');
//app.use(multer)
// app.use(fileUpload({
//   createParentPath: true
// }));
//const socketConnection = Socket.get();
// socketConnection.setServerSocket(server);
// const io = socketConnection.getServerSocket()
var Path = require('./editor/js/Path');
app.use(fileUpload());
app.use(express.static(__dirname));
var editor = require("./routes/editor.js");
var main = require("./routes/main.js");
var gameLobby = require("./routes/gameLobby.js");
var account = require("./routes/account.js");
var logout = require("./routes/logout.js");
var room = require("./routes/room.js");
var loginOrGuest = require("./routes/loginOrGuest.js");
var playAsGuest = require("./routes/playAsGuest.js");
var showGame = require("./routes/showGame.js");
var createRoom = require("./routes/createRoom.js");
app.use('/', main);
app.use('/editor', editor);
app.use('/gameLobby', gameLobby);
app.use('/account', account);
app.use('/logout', logout);
app.use('/room', room);
app.use('/loginOrGuest', loginOrGuest);
app.use('/playAsGuest', playAsGuest);
app.use('/showGame', showGame);
app.use('/createRoom', createRoom);
var PORT = process.env.PORT || 8001;
server.listen(PORT, function () { return console.log("Server running on port ".concat(PORT)); });
SocketServer.setIo(io);
SocketServer.serverListen();
// io.on('connection', (socket:any) => {
//     console.log('a user connected');
//     //GameFinder.getIntance().findByName('dsasda')
//     socket.on('editor', (msg:string) => {
//       console.log('zapol som editor');
//     });
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//     socket.on('msg', (msg:string) => {
//       console.log('napojil socket');
//     });
//     socket.on('saveGame', (data:any) => {
//       console.log('odchytil')
//         console.log(data)
//         console.log('odchytil')
//         let g = new Game_db()
//         g.setAuthor(data.author)
//         g.setName(data.name)
//         g.setNumOfPlayers(data.numOfPlayers)
//         data.tiles.forEach((tile:any) =>{
//           let t = new Tile_db()
//           t.setType(tile.type)
//           t.setCenterX(tile.centerX)
//           t.setCenterY(tile.centerY)
//           t.setX1(tile.x1)
//           t.setX2(tile.x2)
//           t.setY1(tile.y1)
//           t.setY2(tile.y2)
//           t.setRadius(tile.radius)
//           t.setIsOccupied(tile.isOccupied)
//           t.setColor(tile.color)
//           t.setStroke(tile.stroke)
//           t.setStrokeColor(tile.strokeColor)
//           t.setShape(tile.shape)
//           t.setBackgroundFile(tile.backgroundFile)
//           t.setPatternFile(tile.patternFile)
//           t.setTileNumber(tile.tileNumber) 
//           t.setIsEnding(tile.isEnding)
//           t.setIsEndingFor(tile.isEndingFor)
//           t.setIsStarting(tile.isStarting)
//           t.setIsStartingFor(tile.isStartingFor)     
//           t.setBelongTo(tile.belongTo)     
//           t.setCanOccupy(tile.canOccupy)
//           t.setToogleNumber(tile.toggleNumber)
//           t.setNumberingColor(tile.numberingColor)
//           t.setFollowingTileNumber(tile.numberOfFollowingTile)
//           t.setGameName(data.name)
//           t.insert()
//         })
//         g.insert()
//         io.emit('chat message');
//       });
//   });
// io.on('connection', (socket:any) => {
//   console.log('a user connected');
//   console.log(socket.id)
//   socket.emit('pipi')
//   socket.on('load game',async (msg:{id:string,name:string}) => {
//           let acc = AccountManager.getAccountByClientId(msg.id)
//           acc.setSocketId(msg.id)
//           console.log('toto returnol:'+await GameManager.loadGame(msg.name))
//           //this.emitToSpecificSocket(socket.id,'connected',await GameManager.loadGame(msg.name))
//           console.log('zapol som hru'+ msg.name);
//   });
//   socket.on('disconnect', () => {
//           console.log('user disconnected');
//   });
// socket.on('saveGame', (data:any) => {
// console.log('odchytil')
// console.log(data)
// console.log('odchytil')
// let g = new Game_db()
// g.setAuthor(data.author)
// g.setName(data.name)
// g.setNumOfPlayers(data.numOfPlayers)
// data.tiles.forEach((tile:any) =>{
// let t = new Tile_db()
// t.setType(tile.type)
// t.setCenterX(tile.centerX)
// t.setCenterY(tile.centerY)
// t.setX1(tile.x1)
// t.setX2(tile.x2)
// t.setY1(tile.y1)
// t.setY2(tile.y2)
// t.setRadius(tile.radius)
// t.setIsOccupied(tile.isOccupied)
// t.setColor(tile.color)
// t.setStroke(tile.stroke)
// t.setStrokeColor(tile.strokeColor)
// t.setShape(tile.shape)
// t.setBackgroundFile(tile.backgroundFile)
// t.setPatternFile(tile.patternFile)
// t.setTileNumber(tile.tileNumber) 
// t.setIsEnding(tile.isEnding)
// t.setIsEndingFor(tile.isEndingFor)
// t.setIsStarting(tile.isStarting)
// t.setIsStartingFor(tile.isStartingFor)     
// t.setBelongTo(tile.belongTo)     
// t.setCanOccupy(tile.canOccupy)
// t.setToogleNumber(tile.toggleNumber)
// t.setNumberingColor(tile.numberingColor)
// t.setFollowingTileNumber(tile.numberOfFollowingTile)
// t.setGameName(data.name)
// t.insert()
// })
// g.insert()
// let b = new Background_db()
// b.setGameName(data.name)
// b.setColor(data.background.color)
// b.setImage(data.background.backgroundImage)
// b.insert()
// io.emit('chat message');
// });
// });
// module.exports = io
