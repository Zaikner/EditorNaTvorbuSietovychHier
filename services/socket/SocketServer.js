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
exports.ServerSocket = void 0;
var Game_db_1 = require("../db/RDG/Game_db");
var Tile_db_1 = require("../db/RDG/Tile_db");
var Background_db_1 = require("../db/RDG/Background_db");
var GameFinder_db_1 = require("../db/RDG/GameFinder_db");
var TileFinder_1 = require("../db/RDG/TileFinder");
var Question_1 = require("../db/RDG/Question");
var QuestionOption_1 = require("../db/RDG/QuestionOption");
var QuestionFinder_1 = require("../db/RDG/QuestionFinder");
var QuestionWithAnswersFinder_1 = require("../db/RDG/QuestionWithAnswersFinder");
var PawnStyle_1 = require("../db/RDG/PawnStyle");
var Rules_1 = require("../db/RDG/Rules");
var TextFinder_1 = require("../db/RDG/TextFinder");
var BackgroundComponentFinder_1 = require("../db/RDG/BackgroundComponentFinder");
var PawnStyleFinder_1 = require("../db/RDG/PawnStyleFinder");
var QuestionOptionFinder_1 = require("../db/RDG/QuestionOptionFinder");
var Player = require("../../backEnd/Game/Player");
var path = require('path');
var AccountManager = require('../../backEnd/Accounts/AccountManager.js');
var GameManager = require('../../backEnd/Game/GameManager.js');
var ServerSocket = /** @class */ (function () {
    function ServerSocket() {
    }
    ServerSocket.serverListen = function () {
        var _this = this;
        this.io.on('connection', function (socket) {
            socket.on('is online', function (msg) {
                var acc = AccountManager.getAccountByClientId(msg.id);
                acc.setAnswered = 0;
                //console.log('ohlasil sa:' + acc.getName())
            });
            socket.on('load game', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var game, acc, emit, r_1, numOfPawns_1, pawnNumber_1, pawns_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!msg.response) return [3 /*break*/, 2];
                            return [4 /*yield*/, GameFinder_db_1.GameFinder.getIntance().findByName(msg.name)
                                //console.log(game)
                                //console.log('sem neprisiel')
                            ];
                        case 1:
                            game = _a.sent();
                            //console.log(game)
                            //console.log('sem neprisiel')
                            if (game.length == 0) {
                                socket.emit('wrong game name');
                                return [2 /*return*/];
                            }
                            _a.label = 2;
                        case 2:
                            acc = AccountManager.getAccountByClientId(msg.id);
                            acc.setSocketId(socket.id);
                            if (!(msg.room != undefined)) return [3 /*break*/, 3];
                            r_1 = GameManager.getActiveRooms().get(parseInt(msg.room));
                            emit = r_1.getGameData();
                            //   //console.log('tuna bude chyba')
                            //   let numOfPawns =  emit.game.numOfPawnsPerTile
                            //   emit.pawns = []
                            //   let pawns:Array<Array<string>> = []
                            //   emit.tile.forEach((tile:any)=>{
                            //     tile.isStartingFor.forEach((token:string)=>{
                            //       for(let i = 0; i < numOfPawns;i++){
                            //        pawns.push([token, r.getPawnPositions().lenght,tile.id])
                            //         //let p = new Pawn(token,addedTile)
                            //         //editor.getGame().getPawns().push(p)
                            //         //addedTile.getPawns().push(p)
                            //       }
                            //     })
                            //   })
                            //emit.pawns = pawns
                            //TOTO OPRAV MORE
                            emit.pawns.forEach(function (pawn) {
                                pawn.tileId = r_1.getPawnPositions().get(pawn.id);
                            });
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, GameManager.loadGame(msg.name)];
                        case 4:
                            //console.log('isiel cez tento branch takze game over')
                            emit = _a.sent();
                            numOfPawns_1 = emit.game.getNumOfPawnsPerTile();
                            pawnNumber_1 = 1;
                            pawns_1 = [];
                            emit.tiles.forEach(function (tile) {
                                tile.isStartingFor.forEach(function (token) {
                                    for (var i = 0; i < numOfPawns_1; i++) {
                                        //room.getPawnPositions().set(pawnNumber,tile.id)
                                        pawns_1.push({ token: token, id: pawnNumber_1, tileId: tile.id });
                                        //[token, pawnNumber,tile.id])
                                        pawnNumber_1++;
                                    }
                                });
                            });
                            emit.pawns = pawns_1;
                            _a.label = 5;
                        case 5:
                            //console.log('emited:')
                            //console.log(emit)
                            this.emitToSpecificSocket(socket.id, 'connected', emit);
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('chat-waitingRoom', function (data) {
                var acc = AccountManager.getAccountByClientId(data.id);
                _this.io.to(data.roomId).emit('add chat message', { name: acc.getName(), msg: data.msg });
            });
            socket.on('disconnect', function () {
                GameManager.findRoomBySocketId(socket.id);
            });
            socket.on('saveGame', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var acc, existingGames, lastGame, id, last, lastId, g, b, rule;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            acc = AccountManager.getAccountByClientId(data.clientId);
                            return [4 /*yield*/, GameFinder_db_1.GameFinder.getIntance().findByName(data.name)];
                        case 1:
                            existingGames = _a.sent();
                            return [4 /*yield*/, GameFinder_db_1.GameFinder.getIntance().findLast()
                                //console.log('prebehli vsetkz queries')
                                //console.log(acc)
                                //console.log(existingGames)
                                //console.log(lastGame)
                            ];
                        case 2:
                            lastGame = _a.sent();
                            id = 0;
                            if (existingGames.length > 0) {
                                if (existingGames[0].getAuthorId() != acc.getId()) {
                                    socket.emit('not author');
                                    return [2 /*return*/];
                                }
                                else {
                                    //console.log('je author a chce zmenit')
                                    id = data.id;
                                }
                            }
                            else {
                                if (lastGame.length == 0) {
                                    id = 1;
                                }
                                else {
                                    id = lastGame[0].getId() + 1;
                                }
                                //console.log('neexistuje taka hra')
                                //console.log(existingGames)
                            }
                            return [4 /*yield*/, TileFinder_1.TileFinder.getIntance().findLast()];
                        case 3:
                            last = _a.sent();
                            lastId = last === null || last === void 0 ? void 0 : last.getId();
                            return [4 /*yield*/, TileFinder_1.TileFinder.getIntance().deleteByGameId(id)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, BackgroundComponentFinder_1.BackgroundComponentFinder.getIntance().deleteByGameName(data.name)
                                //await PawnFinder.getIntance().deleteByName(data.name)
                            ];
                        case 5:
                            _a.sent();
                            //await PawnFinder.getIntance().deleteByName(data.name)
                            return [4 /*yield*/, PawnStyleFinder_1.PawnStyleFinder.getIntance().deleteById(id)
                                //console.log('ucet je:'+ acc)
                            ];
                        case 6:
                            //await PawnFinder.getIntance().deleteByName(data.name)
                            _a.sent();
                            g = new Game_db_1.Game_db();
                            g.setId(id);
                            g.setAuthorId(acc.getId());
                            g.setName(data.name);
                            g.setNumOfPlayers(data.numOfPlayers);
                            g.setNextTilesIds(data.nextTilesIds);
                            g.setInitSizeX(data.initSizeX);
                            g.setInitSizeY(data.initSizeY);
                            g.setIsPublished(data.isPublished);
                            g.setToogleNumber(data.toogleNumber);
                            g.setNumOfPawnsPerTile(data.numOfPawnsPerTile);
                            data.tiles.forEach(function (tile) {
                                var t = new Tile_db_1.Tile_db();
                                t.setId(tile.id + lastId);
                                t.setCenterX(tile.centerX);
                                t.setCenterY(tile.centerY);
                                t.setX1(tile.x1);
                                t.setX2(tile.x2);
                                t.setY1(tile.y1);
                                t.setY2(tile.y2);
                                t.setRadius(tile.radius);
                                t.setColor(tile.color);
                                t.setStroke(tile.stroke);
                                t.setStrokeColor(tile.strokeColor);
                                t.setShape(tile.shape);
                                t.setImage(tile.image);
                                t.setTileNumber(tile.tileNumber);
                                t.setIsEndingFor(tile.isEndingFor);
                                t.setIsStartingFor(tile.isStartingFor);
                                t.setGameId(id);
                                t.setQuestionId(tile.questionId);
                                t.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile);
                                t.setNextTilesIds(tile.nextTilesIds);
                                t.setSkip(tile.skip);
                                t.setRepeat(tile.repeat);
                                t.setForward(tile.forward);
                                t.setBackward(tile.backward);
                                t.setMustThrown(tile.mustThrown);
                                t.setTurnsToSetFree(tile.turnToSetFree);
                                t.setRandomQuestion(tile.randomQuestion);
                                t.insert();
                            });
                            g.upsert();
                            b = new Background_db_1.Background_db();
                            b.setGameId(id);
                            b.setColor(data.background.color);
                            b.setImage(data.background.backgroundImage);
                            // data.background.components.forEach((comp:any)=>{
                            //   let c = new BackgroundComponent_db()
                            //   c.setGameName(data.name)
                            //   c.setImage(comp.image)
                            //   c.setColor(comp.color)
                            //   c.setType(comp.type)
                            //   c.setCenterX(comp.centerX)
                            //   c.setCenterY(comp.centerY)
                            //   c.setX1(comp.x1)
                            //   c.setX2(comp.x2)
                            //   c.setY1(comp.y1)
                            //   c.setY2(comp.y2)
                            //   c.setRadius(comp.radius)
                            //   c.setStroke(comp.stroke)
                            //   c.setStrokeColor(comp.strokeColor)
                            //   c.setImageWidth(comp.imageWidth)
                            //   c.setImageHeight(comp.imageHeigth)
                            //   c.insert()
                            //   //console.log(c)
                            // })
                            b.upsert();
                            // data.pawns.forEach((pawn:any)=>{
                            //    let p = new Pawn()
                            //   // p.setColor(pawn.color)
                            //    //p.setImage(pawn.image)
                            //    p.setPlayer(pawn.player)
                            //    p.setTileId(pawn.tileId +lastId)
                            //    p.insert()
                            // })
                            data.styles.forEach(function (style) {
                                var s = new PawnStyle_1.PawnStyles();
                                s.setGameId(id);
                                s.setColor(style.color);
                                s.setImage(style.image);
                                s.setType(style.type);
                                s.setPlayer(style.player);
                                s.insert();
                            });
                            rule = new Rules_1.Rules();
                            rule.setGameId(id);
                            rule.setText(data.rules);
                            rule.upsert();
                            this.io.emit('chat message');
                            socket.emit('game saved', { newId: id });
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('set Socket', function (msg) {
                //console.log('dostal set Socket')
                //console.log(msg)
                var acc = AccountManager.getAccountByClientId(msg.id);
                if (acc === undefined) {
                    return;
                }
                acc.setSocketId(socket.id);
                var r = GameManager.getActiveRooms().get(parseInt(msg.room));
                var cont = true;
                // r.getPlayers().forEach((player:any)=>{
                //   if (player.getAccount().getName() == acc.getName()){
                //     cont = false
                //   }
                //   else{
                //     //console.log(player.getAccount().getName())
                //     //console.log(pl)
                //   }
                // })
                if (!r.getHasStarted() && cont) {
                    //r.join(new Player(acc,'spectator'))
                    r.join(new Player(acc, 'Player ' + (r.getNumOfPlayers() + 1)));
                }
                // }
                // else if (cont){
                //   r.join(new Player(acc,'Player '+(r.getNumOfPlayers()+1)))
                // }
            });
            socket.on('game has started', function (msg) {
                var r = GameManager.getActiveRooms().get(parseInt(msg.room));
                if (r == undefined) {
                    return;
                }
                r.startGame();
                _this.io["in"](msg.room).emit('game started', { msg: 'Game has started!', tokens: r.getPlayers().map(function (p) { return p.getToken(); }) });
                _this.io["in"](msg.room).emit('turn', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
                _this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
            });
            socket.on('move pawns', function (msg) {
                _this.io["in"](msg.room).emit('move Pawn', { pawn: msg.pawn, value: msg.value });
            });
            socket.on('move pawns back', function (msg) {
                //console.log('posunul dozadu o ' + msg.value)
                _this.io["in"](msg.room).emit('move Pawn back', { pawn: msg.pawn, value: msg.value });
            });
            socket.on('player thrown', function (msg) {
                var r = GameManager.getActiveRooms().get(parseInt(msg.room));
                if (r == undefined) {
                    return;
                }
                r.setTimeLeft(120);
                if (r.getPlayerOnTurn().getMustThrown() != 0) {
                    if (r.getPlayerOnTurn().getMustThrown() != msg.value) {
                        socket.emit('evaluate End', { token: r.getPlayerOnTurn().getToken() });
                        r.getPlayerOnTurn().setTurnsToSetFree(r.getPlayerOnTurn().getTurnsToSetFree() - 1);
                        socket.emit('react to event:must Thrown', { token: r.getPlayerOnTurn().getAccount().getName(), value: r.getPlayerOnTurn().getMustThrown(), turnsLeft: r.getPlayerOnTurn().getTurnsToSetFree() });
                        if (r.getPlayerOnTurn().getTurnsToSetFree() == 0) {
                            r.getPlayerOnTurn().setMustThrown(0);
                        }
                    }
                    else {
                        r.getPlayerOnTurn().setMustThrown(0);
                        r.getPlayerOnTurn().setTurnsToSetFree(0);
                        socket.emit('canMovePawn', { value: msg.value, token: msg.token });
                    }
                }
                else {
                    socket.emit('canMovePawn', { value: msg.value, token: msg.token });
                }
                //console.log('recieved player thrown' +msg.token)
                //console.log('emited movePawn')
                //this.io.in(msg.room).emit('move Pawn',{pawn:msg.pawn,value:msg.value})
            });
            socket.on('show Dice', function (msg) {
                var r = GameManager.getActiveRooms().get(parseInt(msg.id));
                if (r == undefined) {
                    return;
                }
                r.setLastDiceValue(msg.value);
                socket.to(msg.id).emit('show Dice value', { value: msg.value });
            });
            socket.on('react to tile', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var r, author, allQuesstions, randomId, questions, data_1, questions, data_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            r = GameManager.getActiveRooms().get(parseInt(msg.room));
                            if (r == undefined) {
                                return [2 /*return*/];
                            }
                            r.setTimeLeft(120);
                            if (!(r.getPlayerOnTurn().getAccount().getSocketId() == socket.id)) return [3 /*break*/, 8];
                            this.io["in"](msg.room).emit('return pawns to starting tile', { ids: msg.canRemovePawnIds });
                            this.io["in"](msg.room).emit('ended turn');
                            if (!msg.randomQuestion) return [3 /*break*/, 4];
                            //console.log('nasiel otazku')
                            r.setReturnValue(msg.returnValue);
                            r.setChoosedPawnId(msg.pawnId);
                            return [4 /*yield*/, GameFinder_db_1.GameFinder.getIntance().findByName(r.getGameName())];
                        case 1:
                            author = (_a.sent());
                            return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getInstance().findByAuthor(author[0].getAuthorId())];
                        case 2:
                            allQuesstions = _a.sent();
                            randomId = allQuesstions[Math.floor(Math.random() * allQuesstions.length)].getQuestionId();
                            return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getInstance().findById(randomId)];
                        case 3:
                            questions = _a.sent();
                            data_1 = [];
                            //console.log(questions)
                            questions === null || questions === void 0 ? void 0 : questions.forEach(function (question) {
                                data_1.push({
                                    questionId: question.getQuestionId(),
                                    optionId: question.getOptionId(),
                                    questionText: question.getQuestionText(),
                                    optionText: question.getOptionText(),
                                    authorId: question.getAuthorId(),
                                    isAnswer: question.getIsAnswer()
                                });
                            });
                            this.io.to(msg.room).emit('loadedAnswerQuestions', data_1);
                            socket.emit('canReactToAnswer');
                            return [3 /*break*/, 7];
                        case 4:
                            if (!(msg.questionId >= 0)) return [3 /*break*/, 6];
                            //console.log('nasiel otazku')
                            r.setReturnValue(msg.returnValue);
                            r.setChoosedPawnId(msg.pawnId);
                            return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getInstance().findById(msg.questionId)];
                        case 5:
                            questions = _a.sent();
                            data_2 = [];
                            //console.log(questions)
                            questions === null || questions === void 0 ? void 0 : questions.forEach(function (question) {
                                data_2.push({
                                    questionId: question.getQuestionId(),
                                    optionId: question.getOptionId(),
                                    questionText: question.getQuestionText(),
                                    optionText: question.getOptionText(),
                                    authorId: question.getAuthorId(),
                                    isAnswer: question.getIsAnswer()
                                });
                            });
                            this.io.to(msg.room).emit('loadedAnswerQuestions', data_2);
                            socket.emit('canReactToAnswer');
                            return [3 /*break*/, 7];
                        case 6:
                            if (msg.skip > 0) {
                                r.getPlayerOnTurn().setSkip(msg.skip);
                                socket.emit('evaluate End', { token: r.getPlayerOnTurn().getToken() });
                            }
                            else if (msg.repeat > 0) {
                                r.getPlayerOnTurn().setRepeat(msg.repeat);
                                socket.emit('evaluate End', { token: r.getPlayerOnTurn().getToken() });
                            }
                            else if (msg.forward > 0) {
                                socket.emit('react to event: forward', { value: msg.forward, pawnId: msg.pawnId });
                            }
                            else if (msg.backward > 0) {
                                //console.log('react to event: backward emitol')
                                //console.log({value:msg.backward})
                                socket.emit('react to event: backward', { value: msg.backward, pawnId: msg.pawnId });
                            }
                            else if (msg.mustThrown > 0) {
                                r.getPlayerOnTurn().setMustThrown(msg.mustThrown);
                                r.getPlayerOnTurn().setTurnsToSetFree(msg.turnsToSetFree);
                                socket.emit('evaluate End', { token: r.getPlayerOnTurn().getToken() });
                            }
                            else {
                                socket.emit('evaluate End', { token: r.getPlayerOnTurn().getToken() });
                                // r.nextTurn()
                                // ////console.log(r)
                                // this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                                // this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                            }
                            _a.label = 7;
                        case 7: return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); });
            socket.on('change Pawn position', function (msg) {
                var r = GameManager.getActiveRooms().get(parseInt(msg.room));
                if (r == undefined) {
                    return;
                }
                if (r.getPlayerOnTurn().getAccount() == AccountManager.getAccountByClientId(msg.id)) {
                    r.getPawnPositions().set(msg.pawnId, msg.tileId);
                }
                else {
                    ////console.log([socket.id, r.getPlayerOnTurn().getAccount().getSocketId()])
                }
            });
            socket.on('showAnswersToOthers', function (msg) {
                socket.to(msg.room).emit('loadAnswersToOthers', { wrong: msg.wrong, right: msg.right });
            });
            socket.on('evaluated end', function (msg) {
                //console.log('odchyil evaluetedEnd')
                var r = GameManager.getActiveRooms().get(parseInt(msg.room));
                if (r == undefined) {
                    return;
                }
                r.setTimeLeft(120);
                var player = r.findPlayerByToken(msg.token);
                if (msg.is == true && !r.getPlayersWhichEnded().includes(player)) {
                    r.getPlayersWhichEnded().push(player);
                    var place = r.getPlayersWhichEnded().length;
                    r;
                    //console.log(r.getPlayersWhichEnded())
                    //console.log(msg.is,msg.token,place)
                    player.setPlace(place);
                    //console.log('prisiel aspon po emit')
                    _this.io["in"](msg.room).emit('player ended', { player: player.getAccount().getName(), place: place, token: player.token });
                }
                if (r.gameEnded()) {
                    _this.io["in"](msg.room).emit('game has ended', { leaderboards: [] });
                    r.getPlayers().forEach(function (player) {
                        var acc = player.getAccount();
                        acc.setScore(acc.getScore() + r.getMaxPlayers() - player.getPlace() + 1);
                        if (player.getPlace() == 1) {
                            acc.setGameWon(acc.getGameWon() + 1);
                        }
                        else {
                            acc.setGameLost(acc.getGameLost() + 1);
                        }
                        player.getAccount().save();
                    });
                    //dorobit
                    //GameManager.getActiveRooms().delete(r.getId())
                }
                else {
                    var stop_1 = true;
                    r.nextTurn();
                    if (r.getPlayerOnTurn().getSkip() != 0) {
                        //r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
                        _this.io["in"](msg.room).emit('react to event: skip', { token: r.getPlayerOnTurn().getAccount().getName(), left: r.getPlayerOnTurn().getSkip() - 1 });
                        stop_1 = false;
                    }
                    while (!stop_1) {
                        //console.log('skipped:' + r.getPlayerOnTurn().getAccount().getName())
                        //console.log('skipped:' + r.getPlayerOnTurn().getSkip())
                        if (r.getPlayerOnTurn().getSkip() == 0) {
                            stop_1 = true;
                        }
                        else {
                            r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip() - 1);
                            r.nextTurn();
                            //this.io.in(msg.room).emit('react to event: skip',{token: r.getPlayerOnTurn().getToken(),left:r.getPlayerOnTurn().getSkip()})
                        }
                    }
                    //console.log('ide:'+ r.getPlayerOnTurn().getAccount().getName())
                    ////console.log(r)
                    _this.io["in"](msg.room).emit('turn', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
                    _this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
                    r.setReturnValue(-1);
                    r.setChoosedPawnId(-1);
                }
            });
            socket.on('wasRightAnswer', function (msg) {
                var r = GameManager.getActiveRooms().get(parseInt(msg.room));
                if (!msg.is) {
                    //console.log('vratil spat figurku ,lebo bol false')
                    _this.io["in"](msg.room).emit('return Pawn to place', { pawnId: r.getChoosedPawnId(), value: r.getReturnValue() });
                    r.getPawnPositions().set(r.getChoosedPawnId(), r.getReturnValue());
                }
                else {
                    //console.log('bol true')
                }
                ////console.log(r)
                socket.emit('evaluate End', { token: r.getPlayerOnTurn().getToken() });
                // this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                // this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                // r.setReturnValue(-1)
                // r.setChoosedPawnId(-1)
            });
            socket.on('join player to Room', function (msg) {
                var acc = AccountManager.getAccountByClientId(msg.id);
                if (acc === undefined) {
                    return;
                }
                socket.join(msg.roomId);
                var r = GameManager.getActiveRooms().get(parseInt(msg.roomId));
                var isSpectator = r.isSpectator(acc);
                // if (r.getHasStarted() || isSpectator){
                //   //console.log('emitol spravne')
                //   this.io.in(msg.roomId).emit('player joined',{msg:'Player '+ acc.getName() + ' has joined the room.(spectating)'})
                // }
                // else{
                _this.io["in"](msg.roomId).emit('player joined', { msg: 'Player ' + acc.getName() + ' has joined the room.' });
                //}
            });
            // socket.on('relog',async(msg:{id:string})=>{
            //   //console.log('skusil relognut'+msg.id)
            //   ////console.log(msg.id)
            //   let acc = AccountManager.getAccountByClientId(msg.id)
            //   if(acc === undefined){
            //     return
            //   }
            //   AccountManager.login(acc)
            //   socket.emit('set cookie')
            //   //console.log('pripojil'+acc)
            // })
            socket.on('upsertQuestion', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var quest, lastQuest, acc, id, lastOption, lastId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            quest = new Question_1.Question();
                            return [4 /*yield*/, QuestionFinder_1.QuestionFinder.getIntance().findWithLastId()];
                        case 1:
                            lastQuest = _a.sent();
                            acc = AccountManager.getAccountByClientId(data.id);
                            QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getInstance().deleteOptionsByQuestionId(data.questionId);
                            id = 0;
                            if (data.questionId < 0) {
                                try {
                                    id = lastQuest[0].getId() + 1;
                                }
                                catch (_b) {
                                    id = 0;
                                }
                            }
                            else {
                                id = data.questionId;
                            }
                            quest.setText(data.question);
                            quest.setId(id);
                            quest.setAuthorId(acc.getId());
                            //quest.setAuthor(AccountManager.getAccountByClientId(data.id).getName()) -->ked bude fungovat user
                            quest.upsert();
                            return [4 /*yield*/, QuestionOptionFinder_1.QuestionOptionFinder.getIntance().findWithLastId()];
                        case 2:
                            lastOption = _a.sent();
                            lastId = 0;
                            if (lastOption.length > 0) {
                                lastId = (lastOption[0].getId());
                            }
                            lastId++;
                            data.options.forEach(function (elem) {
                                var option = new QuestionOption_1.QuestionOption();
                                option.setId(lastId);
                                lastId++;
                                //console.log('posunul'+lastId)
                                // if (elem.id == undefined){
                                //     option.setId(<number>lastId)
                                //     lastId++;
                                //     //console.log('posunul'+lastId)
                                // }
                                // else{
                                //   option.setId(parseInt(elem.id))
                                //   //console.log(elem.id)
                                //   //console.log('nastavil id:' + elem.id)
                                // }
                                option.setText(elem.txt);
                                option.setQuestionId(id);
                                option.setIsAnswer(elem.isAnswer);
                                //console.log(option)
                                option.insert();
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('deleteQuestion', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var acc, can, questionNumber, lastRandomQuestion, quest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            acc = AccountManager.getAccountByClientId(data.id);
                            return [4 /*yield*/, TileFinder_1.TileFinder.getIntance().findByQuestionId(parseInt(data.questionId))];
                        case 1:
                            can = (_a.sent()).length == 0;
                            return [4 /*yield*/, QuestionFinder_1.QuestionFinder.getIntance().findAllByAuthorId(acc.getId())];
                        case 2:
                            questionNumber = (_a.sent()).length;
                            return [4 /*yield*/, TileFinder_1.TileFinder.getIntance().findByAuthorAndRandomQuestion(acc.getId())];
                        case 3:
                            lastRandomQuestion = (_a.sent()).length > 0;
                            if (!(questionNumber == 1 && lastRandomQuestion)) return [3 /*break*/, 4];
                            socket.emit('random and 0');
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, TileFinder_1.TileFinder.getIntance().findByQuestionId(parseInt(data.questionId))];
                        case 5:
                            if ((_a.sent()).length == 0) {
                                QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getInstance().deleteOptionsByQuestionId(parseInt(data.questionId));
                                quest = new Question_1.Question();
                                quest.setId(parseInt(data.questionId));
                                quest["delete"]();
                            }
                            else {
                                socket.emit('question is used');
                            }
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            // socket.on('upsertRule', async(data:{text:string,gameName:string})=>{
            //   //console.log('upsertuje Rule')
            //   let find = await  RulesFinder.getIntance().findByName(data.gameName)
            //   let rule = new Rules()
            //   rule.setGameName(data.gameName)
            //   rule.setText(data.text)
            //   if (find!.length > 0){
            //     rule.setId(find![0].getId())
            //   }
            // })
            socket.on('insertQuestion', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var opt, last;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            opt = new QuestionOption_1.QuestionOption();
                            opt.setText(data.text);
                            opt.setIsAnswer(data.isAnswer);
                            opt.insert();
                            return [4 /*yield*/, QuestionFinder_1.QuestionFinder.getIntance().findWithLastId()];
                        case 1:
                            last = (_a.sent())[0].getId();
                            socket.edit('add Opt', { text: data.text, isAnswer: data.isAnswer, id: last + 1 });
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('loadQuestions', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var acc, questions, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            acc = AccountManager.getAccountByClientId(msg.id);
                            return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getInstance().findByAuthor(acc.getId())];
                        case 1:
                            questions = _a.sent();
                            data = [];
                            questions === null || questions === void 0 ? void 0 : questions.forEach(function (question) {
                                data.push({
                                    questionId: question.getQuestionId(),
                                    optionId: question.getOptionId(),
                                    questionText: question.getQuestionText(),
                                    optionText: question.getOptionText(),
                                    authorId: question.getAuthorId(),
                                    isAnswer: question.getIsAnswer()
                                });
                            });
                            if (msg.pick == false) {
                                socket.emit('loadedQuestions', data);
                            }
                            else {
                                socket.emit('loadedQuestions - pick', data);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('answerQuestion', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var questions, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getInstance().findById(msg.id)];
                        case 1:
                            questions = _a.sent();
                            data = [];
                            //console.log(questions)
                            questions === null || questions === void 0 ? void 0 : questions.forEach(function (question) {
                                data.push({
                                    questionId: question.getQuestionId(),
                                    optionId: question.getOptionId(),
                                    questionText: question.getQuestionText(),
                                    optionText: question.getOptionText(),
                                    authorId: question.getAuthorId(),
                                    isAnswer: question.getIsAnswer()
                                });
                            });
                            socket.emit('loadedAnswerQuestions', data);
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('get texts', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var texts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            texts = [];
                            if (!(msg.language == 'SK')) return [3 /*break*/, 2];
                            return [4 /*yield*/, TextFinder_1.TextsFinder.getIntance().findAll()];
                        case 1:
                            texts = (_a.sent()).map(function (txt) { return txt.getSK(); });
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, TextFinder_1.TextsFinder.getIntance().findAll()];
                        case 3:
                            texts = (_a.sent()).map(function (txt) { return txt.getEN(); });
                            _a.label = 4;
                        case 4:
                            socket.emit('got texts', { text: texts });
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('join Room', function (msg) {
                socket.join(msg.roomName);
            });
            socket.on('reload waiting room', function (msg) {
                var r = GameManager.getActiveRooms().get(parseInt(msg.room));
                if (r == undefined) {
                    socket.emit('exit to main menu');
                    //console.log('exitol bo nebola roomka')
                    return;
                }
                var names = [];
                r.getPlayers().forEach(function (player) {
                    names.push({ name: player.getAccount().getName(), avatar: player.getAccount().getAvatar(), place: player.getPlace(), token: player.getToken() });
                });
                //console.log('emitol reload waiting')
                _this.io["in"](msg.room).emit('reloaded waiting room', { names: names });
            });
            socket.on('loadGameNames', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var acc, names, authorNames, _i, authorNames_1, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            acc = AccountManager.getAccountByClientId(msg.id);
                            return [4 /*yield*/, GameFinder_db_1.GameFinder.getIntance().findAllPublished()];
                        case 1:
                            names = (_a.sent()).map(function (game) { return game.getName(); });
                            return [4 /*yield*/, GameFinder_db_1.GameFinder.getIntance().findByAuthorId(acc.getId())];
                        case 2:
                            authorNames = (_a.sent()).map(function (game) { return game.getName(); });
                            for (_i = 0, authorNames_1 = authorNames; _i < authorNames_1.length; _i++) {
                                i = authorNames_1[_i];
                                if (!names.includes(i)) {
                                    names.push(i);
                                }
                            }
                            socket.emit('loadedGameNames', { names: names });
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('ping', function (msg) {
                var acc = AccountManager.getAccountByClientId(msg.id);
                if (acc != undefined) {
                    acc.setPing(0);
                }
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
    ServerSocket.emitToRoom = function (roomName, event, data) {
        this.io.to(roomName).emit(event, data);
    };
    return ServerSocket;
}());
exports.ServerSocket = ServerSocket;
module.exports = ServerSocket;
