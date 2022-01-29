"use strict";
exports.__esModule = true;
exports.Game = void 0;
var Path_js_1 = require("./Path.js");
var Background_js_1 = require("./Background.js");
var Game = /** @class */ (function () {
    function Game() {
        this.name = "";
        this.author = "";
        this.path = new Path_js_1.Path();
        //players:Array<Player>
        this.numOfPlayers = 0;
        this.tiles = [];
        this.background = new Background_js_1.Background();
    }
    Game.prototype.removeTile = function (tile) {
        this.tiles = this.tiles.filter(function (t) { return t != tile; });
    };
    Game.prototype.setPath = function (newPath) {
        this.path = newPath;
    };
    Game.prototype.getPath = function () {
        return this.path;
    };
    Game.prototype.setNumOfPlayers = function (num) {
        this.numOfPlayers = num;
    };
    Game.prototype.getnumOfPlayers = function () {
        return this.numOfPlayers;
    };
    Game.prototype.setTiles = function (newTiles) {
        this.tiles = newTiles;
    };
    Game.prototype.getTiles = function () {
        return this.tiles;
    };
    Game.prototype.addTile = function (newTile) {
        console.log('aspon spustil');
        this.tiles.push(newTile);
    };
    Game.prototype.getAuthor = function () {
        return this.author;
    };
    Game.prototype.setAuthor = function (newAuthor) {
        this.author = newAuthor;
    };
    Game.prototype.getName = function () {
        return this.name;
    };
    Game.prototype.setName = function (newName) {
        this.name = newName;
    };
    Game.prototype.getBackground = function () {
        return this.background;
    };
    Game.prototype.setBackground = function (newBackground) {
        this.background = newBackground;
    };
    return Game;
}());
exports.Game = Game;
