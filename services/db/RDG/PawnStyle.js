"use strict";
exports.__esModule = true;
exports.PawnStyles = void 0;
var DbConnect_1 = require("../DbConnect");
var PawnStyles = /** @class */ (function () {
    function PawnStyles() {
        this.id = 0;
        this.player = '';
        this.color = '#000000';
        this.image = '';
        this.gameName = '';
        this.type = '';
    }
    PawnStyles.prototype.setPlayer = function (player) {
        this.player = player;
    };
    PawnStyles.prototype.getPlayer = function () {
        return this.player;
    };
    PawnStyles.prototype.setColor = function (color) {
        this.color = color;
    };
    PawnStyles.prototype.getColor = function () {
        return this.color;
    };
    PawnStyles.prototype.setImage = function (image) {
        this.image = image;
    };
    PawnStyles.prototype.getImage = function () {
        return this.image;
    };
    PawnStyles.prototype.setGameName = function (gameName) {
        this.gameName = gameName;
    };
    PawnStyles.prototype.getGameName = function () {
        return this.gameName;
    };
    PawnStyles.prototype.setId = function (id) {
        this.id = id;
    };
    PawnStyles.prototype.getId = function () {
        return this.id;
    };
    PawnStyles.prototype.setType = function (newType) {
        this.type = newType;
    };
    PawnStyles.prototype.getType = function () {
        return this.type;
    };
    PawnStyles.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        console.log('insertuje');
        var query = {
            name: 'insert-pawn-style',
            text: 'INSERT INTO "bachelorsThesis"."PawnStyle"(player,color,image,"gameName",type) VALUES($1,$2,$3,$4,$5);',
            values: [this.player, this.color, this.image, this.gameName, this.type]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    PawnStyles.load = function (data) {
        var ret = new PawnStyles();
        ret.setId(data.id);
        ret.setPlayer(data.player);
        ret.setColor(data.color);
        ret.setImage(data.image);
        ret.setGameName(data.gameName);
        ret.setType(data.type);
        return ret;
    };
    return PawnStyles;
}());
exports.PawnStyles = PawnStyles;
