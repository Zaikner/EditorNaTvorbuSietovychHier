"use strict";
exports.__esModule = true;
exports.PawnStyle = void 0;
var PawnStyle = /** @class */ (function () {
    function PawnStyle() {
        this.player = '';
        this.color = '';
        this.type = '';
        this.image = undefined;
    }
    PawnStyle.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    PawnStyle.prototype.getColor = function () {
        return this.color;
    };
    PawnStyle.prototype.setType = function (newType) {
        this.type = newType;
    };
    PawnStyle.prototype.getType = function () {
        return this.type;
    };
    PawnStyle.prototype.setPlayer = function (newPlayer) {
        this.player = newPlayer;
    };
    PawnStyle.prototype.getPlayer = function () {
        return this.player;
    };
    PawnStyle.prototype.setImage = function (newImage) {
        this.image = newImage;
    };
    PawnStyle.prototype.getImage = function () {
        return this.image;
    };
    return PawnStyle;
}());
exports.PawnStyle = PawnStyle;
