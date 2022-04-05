"use strict";
exports.__esModule = true;
exports.Pawn = void 0;
var DbConnect_1 = require("../DbConnect");
var Pawn = /** @class */ (function () {
    function Pawn() {
        this.id = 0;
        this.player = '';
        this.tileId = 0;
        this.color = '#000000';
        this.image = '';
    }
    Pawn.prototype.setPlayer = function (player) {
        this.player = player;
    };
    Pawn.prototype.getPlayer = function () {
        return this.player;
    };
    Pawn.prototype.setColor = function (color) {
        this.color = color;
    };
    Pawn.prototype.getColor = function () {
        return this.color;
    };
    Pawn.prototype.setImage = function (image) {
        this.image = image;
    };
    Pawn.prototype.getImage = function () {
        return this.image;
    };
    Pawn.prototype.setId = function (id) {
        this.id = id;
    };
    Pawn.prototype.getId = function () {
        return this.id;
    };
    Pawn.prototype.setTileId = function (id) {
        this.tileId = id;
    };
    Pawn.prototype.getTileId = function () {
        return this.tileId;
    };
    Pawn.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-pawn',
            text: 'INSERT INTO "bachelorsThesis"."Pawn"(player,"tileId",color,image) VALUES($1,$2,$3,$4);',
            values: [this.player, this.tileId, this.color, this.image]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Pawn.load = function (data) {
        console.log('tooto vyplula dataza');
        console.log(data);
        var ret = new Pawn();
        ret.setId(data.id);
        ret.setTileId(data.tileId);
        ret.setPlayer(data.player);
        ret.setColor(data.color);
        ret.setImage(data.image);
        return ret;
    };
    return Pawn;
}());
exports.Pawn = Pawn;
