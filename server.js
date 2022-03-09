"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require('path');
var http = require('http');
var express = require('express');
var DbConnect = require('./services/db/DbConnect.js');
var socket_io_1 = require("socket.io");
var Game_db_js_1 = require("./services/db/RDG/Game_db.js");
var Tile_db_js_1 = require("./services/db/RDG/Tile_db.js");
var Background_db_js_1 = require("./services/db/RDG/Background_db.js");
var busboy = require('connect-busboy');
var CryptoJS = require("crypto-js");
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var SocketServer = require('./services/socket/SocketServer.js');
var AccountManager = require('./backEnd/Accounts/AccountManager.js');
var GameManager = require('./backEnd/Game/GameManager.js');
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
app.use('/', main);
app.use('/editor', editor);
app.use('/gameLobby', gameLobby);
app.use('/account', account);
app.use('/logout', logout);
app.use('/room', room);
app.use('/loginOrGuest', loginOrGuest);
app.use('/playAsGuest', playAsGuest);
app.use('/showGame', showGame);
var PORT = process.env.PORT || 8001;
server.listen(PORT, function () { return console.log("Server running on port ".concat(PORT)); });
//SocketServer.setIo(io)
// SocketServer.serverListen()
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
io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(socket.id);
    socket.emit('pipi');
    socket.on('load game', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
        var acc, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    acc = AccountManager.getAccountByClientId(msg.id);
                    acc.setSocketId(msg.id);
                    _b = (_a = console).log;
                    _c = 'toto returnol:';
                    return [4 /*yield*/, GameManager.loadGame(msg.name)];
                case 1:
                    _b.apply(_a, [_c + (_d.sent())]);
                    //this.emitToSpecificSocket(socket.id,'connected',await GameManager.loadGame(msg.name))
                    console.log('zapol som hru' + msg.name);
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('saveGame', function (data) {
        console.log('odchytil');
        console.log(data);
        console.log('odchytil');
        var g = new Game_db_js_1.Game_db();
        g.setAuthor(data.author);
        g.setName(data.name);
        g.setNumOfPlayers(data.numOfPlayers);
        data.tiles.forEach(function (tile) {
            var t = new Tile_db_js_1.Tile_db();
            t.setType(tile.type);
            t.setCenterX(tile.centerX);
            t.setCenterY(tile.centerY);
            t.setX1(tile.x1);
            t.setX2(tile.x2);
            t.setY1(tile.y1);
            t.setY2(tile.y2);
            t.setRadius(tile.radius);
            t.setIsOccupied(tile.isOccupied);
            t.setColor(tile.color);
            t.setStroke(tile.stroke);
            t.setStrokeColor(tile.strokeColor);
            t.setShape(tile.shape);
            t.setBackgroundFile(tile.backgroundFile);
            t.setPatternFile(tile.patternFile);
            t.setTileNumber(tile.tileNumber);
            t.setIsEnding(tile.isEnding);
            t.setIsEndingFor(tile.isEndingFor);
            t.setIsStarting(tile.isStarting);
            t.setIsStartingFor(tile.isStartingFor);
            t.setBelongTo(tile.belongTo);
            t.setCanOccupy(tile.canOccupy);
            t.setToogleNumber(tile.toggleNumber);
            t.setNumberingColor(tile.numberingColor);
            t.setFollowingTileNumber(tile.numberOfFollowingTile);
            t.setGameName(data.name);
            t.insert();
        });
        g.insert();
        var b = new Background_db_js_1.Background_db();
        b.setGameName(data.name);
        b.setColor(data.background.color);
        b.setImage(data.background.backgroundImage);
        b.insert();
        io.emit('chat message');
    });
});
// module.exports = io
