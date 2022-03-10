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
var Game_db_1 = require("../db/RDG/Game_db");
var Tile_db_1 = require("../db/RDG/Tile_db");
var Background_db_1 = require("../db/RDG/Background_db");
var GameFinder_db_1 = require("../db/RDG/GameFinder_db");
var TileFinder_Db_1 = require("../db/RDG/TileFinder_Db");
var BackgroundFinder_1 = require("../db/RDG/BackgroundFinder");
var path = require('path');
var AccountManager = require('../../backEnd/Accounts/AccountManager.js');
//const GameManager = require('../../backEnd/Game/GameManager.js')
var ServerSocket = /** @class */ (function () {
    function ServerSocket() {
    }
    ServerSocket.serverListen = function () {
        var _this = this;
        this.io.on('connection', function (socket) {
            console.log('a user connected');
            console.log(socket.id);
            socket.emit('pipi');
            socket.on('load game', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var acc, game, tiles, background;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            acc = AccountManager.getAccountByClientId(msg.id);
                            acc.setSocketId(msg.id);
                            return [4 /*yield*/, GameFinder_db_1.GameFinder.getIntance().findByName(msg.name)];
                        case 1:
                            game = _a.sent();
                            return [4 /*yield*/, TileFinder_Db_1.TileFinder.getIntance()];
                        case 2:
                            tiles = _a.sent();
                            return [4 /*yield*/, BackgroundFinder_1.BackgroundFinder.getIntance().findByName(msg.name)
                                // console.log('toto returnol:'+await GameManager.loadGame(msg.name))
                                //this.emitToSpecificSocket(socket.id,'connected', {game:game![0],tiles:tiles,background:background![0]})
                            ];
                        case 3:
                            background = _a.sent();
                            // console.log('toto returnol:'+await GameManager.loadGame(msg.name))
                            //this.emitToSpecificSocket(socket.id,'connected', {game:game![0],tiles:tiles,background:background![0]})
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
                var g = new Game_db_1.Game_db();
                g.setAuthor(data.author);
                g.setName(data.name);
                g.setNumOfPlayers(data.numOfPlayers);
                data.tiles.forEach(function (tile) {
                    var t = new Tile_db_1.Tile_db();
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
                var b = new Background_db_1.Background_db();
                b.setGameName(data.name);
                b.setColor(data.background.color);
                b.setImage(data.background.backgroundImage);
                b.insert();
                _this.io.emit('chat message');
            });
        });
    };
    ServerSocket.getIo = function () {
        return this.io;
    };
    ServerSocket.setIo = function (io) {
        this.io = io;
    };
    ServerSocket.emitToSpecificSocket = function (socketId, event, msg) {
        this.io.to(socketId).emit(event, msg);
    };
    return ServerSocket;
}());
module.exports = ServerSocket;
