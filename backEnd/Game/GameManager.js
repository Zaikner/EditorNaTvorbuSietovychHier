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
var AccountFinder_js_1 = require("../../services/db/RDG/AccountFinder.js");
var AccountManager = require('../Accounts/AccountManager.js');
var GameFinder_db_js_1 = require("../../services/db/RDG/GameFinder_db.js");
var TileFinder_1 = require("../../services/db/RDG/TileFinder");
var TextFinder_1 = require("../../services/db/RDG/TextFinder");
var BackgroundFinder_js_1 = require("../../services/db/RDG/BackgroundFinder.js");
var PawnStyleFinder_js_1 = require("../../services/db/RDG/PawnStyleFinder.js");
var RulesFinder_js_1 = require("../../services/db/RDG/RulesFinder.js");
var Room_js_1 = require("./Room.js");
var Player_js_1 = require("./Player.js");
var SocketServer_js_1 = require("../../services/socket/SocketServer.js");
//const Room = require('./Room.js')
var GameManager = /** @class */ (function () {
    function GameManager() {
    }
    GameManager.loadGame = function (name, author) {
        return __awaiter(this, void 0, void 0, function () {
            var game, tiles, background, styles, rules, pawns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameFinder_db_js_1.GameFinder.getIntance().findByName(name)];
                    case 1:
                        game = _a.sent();
                        return [4 /*yield*/, TileFinder_1.TileFinder.getIntance().findByGameId(game[0].getId())];
                    case 2:
                        tiles = _a.sent();
                        return [4 /*yield*/, BackgroundFinder_js_1.BackgroundFinder.getIntance().findById(game[0].getId())
                            //let pawns = await PawnFinder.getIntance().findByGameId(game![0].getId())
                        ];
                    case 3:
                        background = _a.sent();
                        return [4 /*yield*/, PawnStyleFinder_js_1.PawnStyleFinder.getIntance().findByGameId(game[0].getId())];
                    case 4:
                        styles = _a.sent();
                        return [4 /*yield*/, RulesFinder_js_1.RulesFinder.getIntance().findByGameId(game[0].getId())
                            //let backgroundComponents = await BackgroundComponentFinder.getIntance().findByName(name)
                        ];
                    case 5:
                        rules = _a.sent();
                        pawns = [];
                        return [2 /*return*/, { author: author, pawns: pawns, game: game[0], tiles: tiles, background: background[0], styles: styles, rules: rules[0].getText() }];
                }
            });
        });
    };
    GameManager.loadTexts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, TextFinder_1.TextsFinder.getIntance().findAll()];
                    case 1: return [2 /*return*/, (_a.texts = _b.sent(), _a)];
                }
            });
        });
    };
    GameManager.createRoom = function (name, numOfPlayers, accId) {
        return __awaiter(this, void 0, void 0, function () {
            var stop, id, room, acc, gameData, numOfPawns, pawnNumber, pawns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('aspon vyvroil room');
                        stop = false;
                        id = 0;
                        while (!stop) {
                            stop = true;
                            id++;
                            this.activeRooms.forEach(function (room) {
                                if (room.getId() == id) {
                                    stop = false;
                                }
                            });
                        }
                        room = new Room_js_1.Room(id, numOfPlayers, name);
                        return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findById(accId)];
                    case 1:
                        acc = _a.sent();
                        return [4 /*yield*/, GameManager.loadGame(name, acc[0].getName())];
                    case 2:
                        gameData = _a.sent();
                        console.log(room);
                        this.activeRooms.set(id, room);
                        numOfPawns = gameData.game.getNumOfPawnsPerTile();
                        pawnNumber = 1;
                        pawns = [];
                        gameData.tiles.forEach(function (tile) {
                            tile.isStartingFor.forEach(function (token) {
                                for (var i = 0; i < numOfPawns; i++) {
                                    room.getPawnPositions().set(pawnNumber, tile.id);
                                    pawns.push({ token: token, id: pawnNumber, tileId: tile.id });
                                    //[token, pawnNumber,tile.id])
                                    pawnNumber++;
                                }
                            });
                        });
                        gameData.pawns = pawns;
                        room.setGameData(gameData);
                        return [2 /*return*/, room];
                }
            });
        });
    };
    GameManager.findRoomBySocketId = function (socketId) {
        Array.from(this.activeRooms.values()).forEach(function (room) {
            room.getPlayers().forEach(function (player) {
                if (player.getAccount().getSocketId() == socketId) {
                    room.leave(player);
                    SocketServer_js_1.ServerSocket.getIo().to(room.getId().toString()).emit('player left', { msg: 'Player ' + player.getAccount().getName() + ' has left the room.' });
                }
            });
        });
    };
    GameManager.getActivePlayers = function (acc) {
        var ret = [];
        var rooms = Array.from(this.activeRooms.values());
        var _loop_1 = function (i) {
            rooms[i].getPlayers().forEach(function (player) {
                console.log(acc);
                ret.push([player.getAccount().getName(), rooms[i].getGameName(), rooms[i].getId(), function () {
                        rooms[i].join(new Player_js_1.Player(acc, ''));
                    }]);
            });
        };
        for (var i = 0; i < rooms.length; i++) {
            _loop_1(i);
        }
        return ret;
    };
    GameManager.getActiveRooms = function () {
        return this.activeRooms;
    };
    GameManager.setActiveRooms = function (newRooms) {
        return this.activeRooms = newRooms;
    };
    GameManager.activeRooms = new Map();
    return GameManager;
}());
module.exports = GameManager;
