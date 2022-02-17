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
var Account_js_1 = require("../services/db/RDG/Account.js");
var AccountFinder_js_1 = require("../services/db/RDG/AccountFinder.js");
var CryptoJS = require("crypto-js");
require("dotenv").config('.env');
var AccountManager = /** @class */ (function () {
    function AccountManager() {
        this.loggedAccounts = [];
    }
    AccountManager.isValidRegistration = function (name, password, confirm) {
        return password == confirm && this.isValidName(name);
    };
    AccountManager.isValidName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var names;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findByName(name)];
                    case 1:
                        names = _a.sent();
                        if (names.length != 0) {
                            return [2 /*return*/, false];
                        }
                        console.log('nasiel:' + names);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AccountManager.encode = function (txt) {
        return CryptoJS.AES.encrypt(txt, process.env.Secret).toString();
    };
    AccountManager.decode = function (txt) {
        return CryptoJS.AES.decrypt(txt, process.env.Secret).toString(CryptoJS.enc.Utf8);
    };
    AccountManager.register = function (name, password, confirm) {
        return __awaiter(this, void 0, void 0, function () {
            var names, acc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findByName(name)];
                    case 1:
                        names = _a.sent();
                        if (names.length != 0) {
                            console.log('vela');
                            return [2 /*return*/, false];
                        }
                        else if (password != confirm) {
                            return [2 /*return*/, false];
                        }
                        else {
                            acc = new Account_js_1.Account();
                            acc.setName(name);
                            acc.setPassword(this.encode(password));
                            acc.insert();
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountManager.authenticate = function (name, password) {
        return __awaiter(this, void 0, void 0, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findByName(name)];
                    case 1:
                        accounts = _a.sent();
                        if (accounts.length != 0) {
                            if (this.decode(accounts[0].password) == password) {
                                return [2 /*return*/, true];
                            }
                        }
                        else {
                            console.log('prazdne');
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountManager.login = function () { };
    return AccountManager;
}());
module.exports = AccountManager;
