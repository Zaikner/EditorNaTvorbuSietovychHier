"use strict";
exports.__esModule = true;
exports.Game = void 0;
var DbConnect_1 = require("../DbConnect");
var Game = /** @class */ (function () {
    function Game() {
        this.id = 0;
        this.name = '';
        this.author = '';
        this.numOfPlayers = 0;
    }
    Game.prototype.getId = function () {
        return this.id;
    };
    Game.prototype.setId = function (newId) {
        this.id = newId;
    };
    Game.prototype.getNumOfPlayers = function () {
        return this.id;
    };
    Game.prototype.setNumOfPlayers = function (newNum) {
        this.numOfPlayers = newNum;
    };
    Game.prototype.getName = function () {
        return this.name;
    };
    Game.prototype.setName = function (newName) {
        this.name = newName;
    };
    Game.prototype.getAuthor = function () {
        return this.name;
    };
    Game.prototype.setAuthor = function (newAuthor) {
        this.author = newAuthor;
    };
    Game.prototype.insert = function () {
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
    return Game;
}());
exports.Game = Game;
