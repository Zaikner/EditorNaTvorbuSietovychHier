"use strict";
exports.__esModule = true;
exports.Game_db = void 0;
var DbConnect_1 = require("../DbConnect");
var Game_db = /** @class */ (function () {
    function Game_db() {
        this.id = 0;
        this.name = '';
        this.author = '';
        this.numOfPlayers = 0;
    }
    Game_db.prototype.getId = function () {
        return this.id;
    };
    Game_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    Game_db.prototype.getNumOfPlayers = function () {
        return this.id;
    };
    Game_db.prototype.setNumOfPlayers = function (newNum) {
        this.numOfPlayers = newNum;
    };
    Game_db.prototype.getName = function () {
        return this.name;
    };
    Game_db.prototype.setName = function (newName) {
        this.name = newName;
    };
    Game_db.prototype.getAuthor = function () {
        return this.name;
    };
    Game_db.prototype.setAuthor = function (newAuthor) {
        this.author = newAuthor;
    };
    Game_db.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-game',
            text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers") VALUES($1,$2,$3);',
            values: [this.name, this.author, this.numOfPlayers]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Game_db.load = function (data) {
        var ret = new Game_db();
        ret.setId(data.id);
        ret.setName(data.name);
        ret.setAuthor(data.author);
        ret.setNumOfPlayers(data.numOfPlayers);
        return ret;
    };
    return Game_db;
}());
exports.Game_db = Game_db;
