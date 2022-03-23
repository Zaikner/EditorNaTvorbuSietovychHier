"use strict";
exports.__esModule = true;
exports.PawnStyle = void 0;
var PawnStyle = /** @class */ (function () {
    function PawnStyle(player, color, type) {
        this.player = '';
        this.color = '';
        this.type = '';
        this.image = undefined;
        this.player = player;
        this.color = color;
        this.type = type;
    }
    PawnStyle.prototype.JSONfyStyle = function () {
        return { player: this.player,
            color: this.color,
            type: this.type,
            image: '' };
    };
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
