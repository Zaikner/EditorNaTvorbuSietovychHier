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
            var names, acc;
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
        this.loggedAccounts.push(newAcc);
        return newAcc;
    };
    AccountManager.logout = function (name) {
        var lout = undefined;
        console.log('ucty su');
        console.log(this.loggedAccounts);
        this.loggedAccounts.forEach(function (acc) {
            if (acc.getClientId() == name) {
                lout = acc;
                console.log('odlogol' + acc.getName());
            }
            else {
                console.log('nerovnaju sa');
                console.log(acc.getClientId());
                console.log(name);
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
                    case 0: return [4 /*yield*/, AccountFinder_js_1.AccountFinder.getIntance().findByName(name)];
                    case 1:
                        accounts = _a.sent();
                        if (accounts != undefined) {
                            accounts[0].setAvatar(newAvatar);
                            //console.log(accounts[0])
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
module.exports = AccountManager;
