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
exports.AccountManager = void 0;
var Account_db_js_1 = require("../../services/db/RDG/Account_db.js");
var AccountFinder_js_1 = require("../../services/db/RDG/AccountFinder.js");
var Account_js_1 = require("./Account.js");
var CryptoJS = require("crypto-js");
require("dotenv").config('.env');
var AccountManager = /** @class */ (function () {
    function AccountManager() {
    }
    // implementuj funkciu, ktora bude kontrolovat, ci sa uzivatel neodlogol, bud nejake cey request, alebo prebehne vsetky uzivatelov
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
            var names, acc, def;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findByName(name)];
                    case 1:
                        names = _a.sent();
                        if (names.length != 0) {
                            return [2 /*return*/, false];
                        }
                        else if (password != confirm) {
                            return [2 /*return*/, false];
                        }
                        else {
                            acc = new Account_db_js_1.Account_db();
                            acc.setName(name);
                            acc.setPassword(this.encode(password));
                            acc.setScore(0);
                            acc.setGameLost(0);
                            acc.setGameWon(0);
                            def = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBJRXhpZgAASUkqAAgAAAABAA4BAgAnAAAAGgAAAAAAAABCbGFuayBNYW4gUHJvZmlsZSBIZWFkIEljb24gUGxhY2Vob2xkZXL/4QVHaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpJcHRjNHhtcENvcmU9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBDb3JlLzEuMC94bWxucy8iICAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSJodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcy9pU3RvY2twaG90byIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjEyOTgyNjE1MzciIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9sZWdhbC9saWNlbnNlLWFncmVlbWVudD91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29v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';
                            acc.setAvatar(def);
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
                            if (this.decode(accounts[0].getPassword()) == password && !this.isLogged(name)) {
                                return [2 /*return*/, [true, this.login(accounts[0])]];
                            }
                        }
                        else {
                            return [2 /*return*/, [false, undefined]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountManager.login = function (acc) {
        var newAcc = new Account_js_1.Account(acc.getName(), acc.getPassword());
        newAcc.setAvatar(acc.getAvatar());
        newAcc.setClientId(this.createNewClientId());
        newAcc.setScore(acc.getScore());
        newAcc.setGameWon(acc.getGameWon());
        newAcc.setGameLost(acc.getGameLost());
        this.loggedAccounts.push(newAcc);
        return newAcc;
    };
    AccountManager.logout = function (name) {
        var lout = undefined;
        this.loggedAccounts.forEach(function (acc) {
            if (acc.getClientId() == name) {
                lout = acc;
            }
            else {
            }
        });
        if (lout != undefined) {
            this.loggedAccounts = this.loggedAccounts.filter(function (acc) { return acc != lout; });
            this.clientIds = this.clientIds.filter(function (id) { return id != name; });
        }
    };
    AccountManager.logGuest = function () {
        var newAcc = new Account_js_1.Account((this.numberOfGuests + 1).toString(), 'guestHaveNoPassword');
        this.numberOfGuests++;
        newAcc.setIsGuest(true);
        newAcc.setClientId(this.createNewClientId());
        this.loggedAccounts.push(newAcc);
        return newAcc;
    };
    AccountManager.isLogged = function (name) {
        // OPRAVIT!!!!!!!!!!!!, ide to, ale odlogovanie nie je poriesene
        return false;
        var ret = false;
        this.loggedAccounts.forEach(function (acc) {
            if (acc.getName() === name) {
                ret = true;
            }
            console.log('Ucet sa rovna:' + acc.getName() === name + ' ');
        });
        return ret;
    };
    AccountManager.createNewClientId = function () {
        var ret = '';
        for (var i = 0; i < 12; i++) {
            ret += String.fromCharCode(Math.floor(Math.random() * 20 + 65));
        }
        if (this.clientIds.includes(ret)) {
            ret = this.createNewClientId();
        }
        return ret;
    };
    AccountManager.getAccountByClientId = function (clientId) {
        var ret = undefined;
        this.loggedAccounts.forEach(function (acc) {
            if (acc.getClientId() === clientId) {
                ret = acc;
            }
            console.log('PRe ucey s id : ' + clientId + ' nasiel ucet s nazvom ' + acc.getName());
        });
        return ret;
    };
    AccountManager.changePassword = function (name, newPassword, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findByName(name)];
                    case 1:
                        accounts = _a.sent();
                        if (accounts != undefined) {
                            console.log(accounts[0]);
                            accounts[0].setPassword(this.encode(newPassword));
                            accounts[0].update();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountManager.changeAvatar = function (name, newAvatar) {
        return __awaiter(this, void 0, void 0, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('tu to padlo');
                        return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findByName(name)];
                    case 1:
                        accounts = _a.sent();
                        if (accounts != undefined) {
                            accounts[0].setAvatar(newAvatar);
                            //console.log(accounts[0])
                            console.log('aspon updatol avatar');
                            accounts[0].update();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountManager.getLogedAccounts = function () {
        return this.loggedAccounts;
    };
    AccountManager.loggedAccounts = [];
    AccountManager.clientIds = [];
    AccountManager.numberOfGuests = 0;
    return AccountManager;
}());
exports.AccountManager = AccountManager;
module.exports = AccountManager;
