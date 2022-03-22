"use strict";
exports.__esModule = true;
exports.Pawn = void 0;
var canvas_1 = require("./canvas");
var Pawn = /** @class */ (function () {
    function Pawn(id, player, tile) {
        this.color = '#000000';
        this.image = undefined;
        this.type = '';
        this.id = id;
        this.player = player;
        this.tile = tile;
    }
    Pawn.prototype.draw = function (ctx) {
        var style = canvas_1.editor.getGame().getPawnStyle().get(this.player);
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.fillStyle = style.getColor();
        ctx.scale(canvas_1.editor.getGame().getScaleX(), canvas_1.editor.getGame().getScaleY());
        ctx.arc(this.tile.getCenterX(), this.tile.getCenterY(), this.tile.getRadius() / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.resetTransform();
        ctx.restore();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.fillStyle = "#000";
        ctx.closePath();
    };
    Pawn.prototype.move = function (numOfTiles) {
    };
    return Pawn;
}());
exports.Pawn = Pawn;
