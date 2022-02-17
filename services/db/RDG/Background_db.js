"use strict";
exports.__esModule = true;
var DbConnect_1 = require("../DbConnect");
var Background_db = /** @class */ (function () {
    function Background_db() {
        this.id = 0;
        this.color = '';
        this.image = '';
        this.gameName = '';
    }
    Background_db.prototype.getId = function () {
        return this.id;
    };
    Background_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    Background_db.prototype.getGameName = function () {
        return this.gameName;
    };
    Background_db.prototype.setGameName = function (newName) {
        this.gameName = newName;
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
            text: 'INSERT INTO "bachelorsThesis"."Background"(image,color,"gameName") Values($1,$2,$3);',
            values: [this.image, this.color, this.gameName]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    Background_db.load = function (data) {
        var ret = new Background_db();
        ret.setId(data.id);
        ret.setGameName(data.gameName);
        ret.setColor(data.color);
        ret.setImage(data.image);
        return ret;
    };
    return Background_db;
}());
