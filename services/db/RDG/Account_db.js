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
        this.score = 0;
        this.gameWon = 0;
        this.gameLost = 0;
    }
    Account_db.prototype.getId = function () {
        return this.id;
    };
    Account_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    Account_db.prototype.getScore = function () {
        return this.score;
    };
    Account_db.prototype.setScore = function (newScore) {
        this.score = newScore;
    };
    Account_db.prototype.getGameWon = function () {
        return this.gameWon;
    };
    Account_db.prototype.setGameWon = function (newScore) {
        this.gameWon = newScore;
    };
    Account_db.prototype.getGameLost = function () {
        return this.gameLost;
    };
    Account_db.prototype.setGameLost = function (newScore) {
        this.gameLost = newScore;
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
            text: 'INSERT INTO bachelors_thesis.accounts(name,password,avatar,score,games_won,games_lost) Values($1,$2,$3,$4,$5,$6);',
            values: [this.name, this.password, this.avatar, this.score, this.gameWon, this.gameLost]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    Account_db.prototype.update = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'update-account',
            text: 'UPDATE bachelors_thesis.accounts SET name = $1 ,password = $2 ,avatar = $3,score = $4,games_won = $5, games_lost = $6 WHERE name = $1;',
            values: [this.name, this.password, this.avatar, this.score, this.gameWon, this.gameLost]
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
        newAcc.setScore(data.score);
        newAcc.setAvatar(data.avatar);
        newAcc.setGameWon(data.games_won);
        newAcc.setGameLost(data.games_lost);
        return newAcc;
    };
    return Account_db;
}());
exports.Account_db = Account_db;
