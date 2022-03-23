"use strict";
exports.__esModule = true;
exports.Pawn = void 0;
var canvas_1 = require("./canvas");
var PawnEditor_1 = require("./PawnEditor");
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
        if (this.tile.getPawns().length == 1) {
            if ((style === null || style === void 0 ? void 0 : style.getType()) == 'type1') {
                (0, PawnEditor_1.drawPawnType1)(ctx, this.tile.getCenterX(), this.tile.getCenterY() - 10, 10, 100, 100, style.getColor());
            }
        }
        else if (this.tile.getPawns().length == 2) {
        }
        // ctx.beginPath()
        // ctx.save()
        // ctx.strokeStyle ="#000"; ctx.lineWidth=1; ctx.setLineDash([]);
        // ctx.fillStyle = style!.getColor()
        // ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
        // ctx.arc(this.tile.getCenterX(), this.tile.getCenterY(), this.tile.getRadius()/4, 0, 2 * Math.PI);
        // ctx.fill()
        // ctx.resetTransform();
        // ctx.restore()
        // ctx.strokeStyle ="#000"; ctx.lineWidth=1; ctx.setLineDash([]);
        // ctx.fillStyle = "#000"
        // ctx.closePath()
    };
    Pawn.prototype.move = function (numOfTiles) {
    };
    return Pawn;
}());
exports.Pawn = Pawn;
