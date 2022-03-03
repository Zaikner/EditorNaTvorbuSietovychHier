"use strict";
exports.__esModule = true;
exports.Account = void 0;
var Account = /** @class */ (function () {
    function Account(name, password) {
        this.avatar = 'default';
        this.clientId = '';
        this.isGuest = false;
        this.name = name;
        this.password = password;
    }
    Account.prototype.getName = function () {
        return this.name;
    };
    Account.prototype.setName = function (newName) {
        this.name = newName;
    };
    Account.prototype.getPassword = function () {
        return this.password;
    };
    Account.prototype.setPassword = function (newPassword) {
        this.password = newPassword;
    };
    Account.prototype.getAvatar = function () {
        return this.avatar;
    };
    Account.prototype.setAvatar = function (newAvatar) {
        this.avatar = newAvatar;
    };
    Account.prototype.getClientId = function () {
        return this.clientId;
    };
    Account.prototype.setClientId = function (newId) {
        this.clientId = newId;
    };
    Account.prototype.getIsGuest = function () {
        return this.isGuest;
    };
    Account.prototype.setIsGuest = function (is) {
        this.isGuest = is;
    };
    return Account;
}());
exports.Account = Account;
