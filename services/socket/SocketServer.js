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
var Question_1 = require("../db/RDG/Question");
var QuestionOption_1 = require("../db/RDG/QuestionOption");
var QuestionFinder_1 = require("../db/RDG/QuestionFinder");
var QuestionWithAnswersFinder_1 = require("../db/RDG/QuestionWithAnswersFinder");
var path = require('path');
var AccountManager = require('../../backEnd/Accounts/AccountManager.js');
var GameManager = require('../../backEnd/Game/GameManager.js');
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
                var acc, _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            acc = AccountManager.getAccountByClientId(msg.id);
                            acc.setSocketId(msg.id);
                            // let game = await GameFinder.getIntance().findByName(msg.name)
                            // let tt =await TileFinder.getIntance().findByName(msg.name)
                            // let background = await BackgroundFinder.getIntance().findByName(msg.name)
                            _b = (_a = console).log;
                            _c = 'toto returnol:';
                            return [4 /*yield*/, GameManager.loadGame(msg.name)];
                        case 1:
                            // let game = await GameFinder.getIntance().findByName(msg.name)
                            // let tt =await TileFinder.getIntance().findByName(msg.name)
                            // let background = await BackgroundFinder.getIntance().findByName(msg.name)
                            _b.apply(_a, [_c + (_f.sent())]);
                            _d = this.emitToSpecificSocket;
                            _e = [socket.id, 'connected'];
                            return [4 /*yield*/, GameManager.loadGame(msg.name)];
                        case 2:
                            _d.apply(this, _e.concat([_f.sent()]));
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
            socket.on('relog', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var acc;
                return __generator(this, function (_a) {
                    console.log('skusil relognut' + msg.id);
                    acc = AccountManager.getAccountByClientId(msg.id);
                    AccountManager.login(acc);
                    socket.emit('set cookie');
                    console.log('pripojil' + acc);
                    return [2 /*return*/];
                });
            }); });
            socket.on('newQuestion', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var quest, lastQuest, id, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            quest = new Question_1.Question();
                            return [4 /*yield*/, QuestionFinder_1.QuestionFinder.getIntance().findWithLastId()];
                        case 1:
                            lastQuest = _c.sent();
                            id = lastQuest[0].getId() + 1;
                            quest.setText(data.question);
                            quest.setId(id);
                            //quest.setAuthor(AccountManager.getAccountByClientId(data.id).getName()) -->ked bude fungovat user
                            quest.insert();
                            data.options.forEach(function (elem) {
                                var option = new QuestionOption_1.QuestionOption();
                                option.setText(elem.txt);
                                option.setQuestionId(id);
                                option.setIsAnswer(elem.isAnswer);
                                console.log(option);
                                option.insert();
                            });
                            _b = (_a = console).log;
                            return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getIntance().findAll()];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('loadQuestions', function () { return __awaiter(_this, void 0, void 0, function () {
                var questions, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getIntance().findAll()];
                        case 1:
                            questions = _a.sent();
                            data = [];
                            questions === null || questions === void 0 ? void 0 : questions.forEach(function (question) {
                                data.push({
                                    questionId: question.getQuestionId(),
                                    optionId: question.getOptionId(),
                                    questionText: question.getQuestionText(),
                                    optionText: question.getOptionText(),
                                    author: question.getAuthor(),
                                    isAnswer: question.getIsAnswer()
                                });
                            });
                            socket.emit('loadedQuestions', data);
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('answerQuestion', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var questions, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('odchytil answerQuestion');
                            console.log(msg.id);
                            return [4 /*yield*/, QuestionWithAnswersFinder_1.QuestionWithAnswersFinder.getIntance().findById(msg.id)];
                        case 1:
                            questions = _a.sent();
                            data = [];
                            console.log(questions);
                            questions === null || questions === void 0 ? void 0 : questions.forEach(function (question) {
                                data.push({
                                    questionId: question.getQuestionId(),
                                    optionId: question.getOptionId(),
                                    questionText: question.getQuestionText(),
                                    optionText: question.getOptionText(),
                                    author: question.getAuthor(),
                                    isAnswer: question.getIsAnswer()
                                });
                            });
                            socket.emit('loadedAnswerQuestions', data);
                            return [2 /*return*/];
                    }
                });
            }); });
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
