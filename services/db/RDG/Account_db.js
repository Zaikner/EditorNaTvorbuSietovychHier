"use strict";
exports.__esModule = true;
exports.Account_db = void 0;
var DbConnect_1 = require("../DbConnect");
var Account_db = /** @class */ (function () {
    function Account_db() {
        this.id = 0;
        this.name = '';
        this.password = '';
        this.avatar = '';
    }
    Account_db.prototype.getId = function () {
        return this.id;
    };
    Account_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    Account_db.prototype.getName = function () {
        return this.name;
    };
    Account_db.prototype.setName = function (newName) {
        this.name = newName;
    };
    Account_db.prototype.getPassword = function () {
        return this.password;
    };
    Account_db.prototype.setPassword = function (newPassword) {
        this.password = newPassword;
    };
    Account_db.prototype.getAvatar = function () {
        return this.avatar;
    };
    Account_db.prototype.setAvatar = function (newAvatar) {
        this.avatar = newAvatar;
    };
    Account_db.prototype.insert = function () {
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
    Account_db.load = function (data) {
        var newAcc = new Account_db();
        newAcc.setId(data.id);
        newAcc.setName(data.name);
        newAcc.setPassword(data.password);
        newAcc.setAvatar(data.avatar);
        return newAcc;
    };
    return Account_db;
}());
exports.Account_db = Account_db;
