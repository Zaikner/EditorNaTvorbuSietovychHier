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
exports.GameFinder = void 0;
var DbConnect_1 = require("../DbConnect");
var Game_db_1 = require("./Game_db");
var GameFinder = /** @class */ (function () {
    function GameFinder() {
    }
    GameFinder.getIntance = function () { return this.INSTANCE; };
    GameFinder.prototype.findByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var client, query, results, ret, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = DbConnect_1.DbConnect.get();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        query = {
                            name: 'select-game-name',
                            text: 'SELECT * FROM bachelors_thesis.games WHERE name=$1;',
                            values: [name]
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Game_db_1.Game_db.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_1 = _a.sent();
                        console.log(err_1);
                        console.log("Connection failed");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GameFinder.prototype.findByAuthorId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var client, query, results, ret, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = DbConnect_1.DbConnect.get();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        query = {
                            name: 'select-game-author',
                            text: 'SELECT * FROM bachelors_thesis.games WHERE author_id=$1;',
                            values: [id]
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Game_db_1.Game_db.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_2 = _a.sent();
                        console.log("Connection failed");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GameFinder.prototype.findByMaxPlayers = function (maxPlayers) {
        return __awaiter(this, void 0, void 0, function () {
            var client, query, results, ret, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = DbConnect_1.DbConnect.get();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        query = {
                            name: 'select-game-author',
                            text: 'SELECT * FROM bachelors_thesis.games WHERE num_of_players<=$1;',
                            values: [maxPlayers]
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Game_db_1.Game_db.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_3 = _a.sent();
                        console.log("Connection failed");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GameFinder.prototype.findLast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, query, results, ret, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = DbConnect_1.DbConnect.get();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        query = {
                            name: 'select-game-last',
                            text: 'SELECT * FROM bachelors_thesis.games ORDER BY id DESC LIMIT 1;',
                            values: []
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Game_db_1.Game_db.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_4 = _a.sent();
                        console.log("Connection failed");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GameFinder.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, query, results, ret, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = DbConnect_1.DbConnect.get();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        query = {
                            name: 'select-game-all',
                            text: 'SELECT * FROM bachelors_thesis.games;',
                            values: []
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Game_db_1.Game_db.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_5 = _a.sent();
                        console.log(err_5);
                        console.log("Connection failed");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GameFinder.prototype.findAllPublished = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, query, results, ret, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = DbConnect_1.DbConnect.get();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        query = {
                            name: 'select-game-all-published',
                            text: 'SELECT * FROM bachelors_thesis.games WHERE is_published = true;',
                            values: []
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Game_db_1.Game_db.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_6 = _a.sent();
                        console.log(err_6);
                        console.log("Connection failed");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GameFinder.INSTANCE = new GameFinder();
    return GameFinder;
}());
exports.GameFinder = GameFinder;
