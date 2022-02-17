"use strict";
exports.__esModule = true;
exports.Account = void 0;
var DbConnect_1 = require("../DbConnect");
var Account = /** @class */ (function () {
    function Account() {
        this.id = 0;
        this.name = '';
        this.password = '';
        this.avatar = '';
    }
    Account.prototype.getId = function () {
        return this.id;
    };
    Account.prototype.setId = function (newId) {
        this.id = newId;
    };
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
    Account.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-account',
            text: 'INSERT INTO "bachelorsThesis"."Account"(name,password,avatar) Values($1,$2,$3);',
            values: [this.name, this.password, this.avatar]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    return Account;
}());
exports.Account = Account;
