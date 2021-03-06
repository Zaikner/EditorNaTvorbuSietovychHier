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
exports.PawnFinder = void 0;
var DbConnect_1 = require("../DbConnect");
var Pawn_1 = require("./Pawn");
var PawnFinder = /** @class */ (function () {
    function PawnFinder() {
    }
    PawnFinder.getIntance = function () { return this.INSTANCE; };
    PawnFinder.prototype.findByGameId = function (id) {
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
                            name: 'select-pawn-find-name',
                            text: 'SELECT p."tileId",p.id,p.player,p.color,p.image FROM "bachelorsThesis"."Pawn" as p INNER JOIN "bachelorsThesis"."Tile" as t on t.id = p."tileId" WHERE t."gameId" = $1',
                            values: [id]
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Pawn_1.Pawn.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_1 = _a.sent();
                        console.log("Connection failed");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PawnFinder.prototype.deleteByName = function (name) {
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
                            name: 'delete-pawn-by-name',
                            text: 'DELETE FROM "bachelorsThesis"."Pawn" where id in (SELECT p.id FROM "bachelorsThesis"."Pawn" as p INNER JOIN "bachelorsThesis"."Tile" as t on t.id = p."tileId" WHERE t."gameName" = $1)',
                            values: [name]
                        };
                        return [4 /*yield*/, client.query(query)];
                    case 2:
                        results = _a.sent();
                        ret = [];
                        return [4 /*yield*/, results.rows.forEach(function (row) {
                                ret.push(Pawn_1.Pawn.load(row));
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ret];
                    case 4:
                        err_2 = _a.sent();
                        console.log("Connection failed Pawn");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PawnFinder.INSTANCE = new PawnFinder();
    return PawnFinder;
}());
exports.PawnFinder = PawnFinder;
