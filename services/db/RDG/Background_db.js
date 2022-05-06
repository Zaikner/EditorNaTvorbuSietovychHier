"use strict";
exports.__esModule = true;
exports.Background_db = void 0;
var DbConnect_1 = require("../DbConnect");
var Background_db = /** @class */ (function () {
    function Background_db() {
        this.id = 0;
        this.color = '';
        this.image = '';
        this.gameId = 0;
    }
    Background_db.prototype.getId = function () {
        return this.id;
    };
    Background_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    Background_db.prototype.getGameId = function () {
        return this.gameId;
    };
    Background_db.prototype.setGameId = function (newId) {
        this.gameId = newId;
    };
    Background_db.prototype.getColor = function () {
        return this.color;
    };
    Background_db.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    Background_db.prototype.getImage = function () {
        return this.image;
    };
    Background_db.prototype.setImage = function (newImage) {
        this.image = newImage;
    };
    Background_db.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-background',
            text: 'INSERT INTO bachelors_thesis.backgrounds(image,color,game_id) Values($1,$2,$3);',
            values: [this.image, this.color, this.gameId]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    Background_db.prototype.upsert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'upsert-background',
            text: 'INSERT INTO bachelors_thesis.backgrounds(image,color,game_id) Values($1,$2,$3) ON CONFLICT(game_id) DO UPDATE SET image = EXCLUDED.image, color = EXCLUDED.color, game_id = EXCLUDED.game_id;',
            values: [this.image, this.color, this.gameId]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    Background_db.load = function (data) {
        var ret = new Background_db();
        ret.setId(data.id);
        ret.setGameId(data.game_id);
        ret.setColor(data.color);
        ret.setImage(data.image);
        return ret;
    };
    return Background_db;
}());
exports.Background_db = Background_db;
