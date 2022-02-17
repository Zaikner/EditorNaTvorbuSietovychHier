"use strict";
exports.__esModule = true;
var DbConnect_1 = require("../DbConnect");
var Background = /** @class */ (function () {
    function Background() {
        this.id = 0;
        this.color = '';
        this.image = '';
        this.gameName = '';
    }
    Background.prototype.getId = function () {
        return this.id;
    };
    Background.prototype.setId = function (newId) {
        this.id = newId;
    };
    Background.prototype.getGameName = function () {
        return this.gameName;
    };
    Background.prototype.setGameName = function (newName) {
        this.gameName = newName;
    };
    Background.prototype.getColor = function () {
        return this.color;
    };
    Background.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    Background.prototype.getImage = function () {
        return this.image;
    };
    Background.prototype.setImage = function (newImage) {
        this.image = newImage;
    };
    Background.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-account',
            text: 'INSERT INTO "bachelorsThesis"."Background"(image,color,"gameName") Values($1,$2,$3);',
            values: [this.image, this.color, this.gameName]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    return Background;
}());
