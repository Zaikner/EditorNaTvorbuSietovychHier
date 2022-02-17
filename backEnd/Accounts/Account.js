"use strict";
exports.__esModule = true;
exports.Account = void 0;
var Account = /** @class */ (function () {
    function Account(name, password) {
        this.avatar = 'default';
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
    return Account;
}());
exports.Account = Account;
