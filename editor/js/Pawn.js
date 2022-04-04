"use strict";
exports.__esModule = true;
exports.Pawn = void 0;
var canvas_1 = require("./canvas");
var Pawn = /** @class */ (function () {
    function Pawn(player, tile) {
        this.id = 0;
        this.color = '#000000';
        this.player = player;
        this.tile = tile;
        this.tileId = tile.getId();
        tile.getPawns().push(this);
    }
    Pawn.prototype.move = function (numOfTiles) {
        console.log('movol');
        var startTile = this.tile;
        var actuallTile = this.tile;
        var endTile = this.tile;
        console.log(actuallTile);
        var p = this;
        for (var i = 0; i < numOfTiles; i++) {
            setTimeout(function () {
                actuallTile.removePawn(p);
                actuallTile = canvas_1.editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber());
                actuallTile.getPawns().push(p);
                console.log(actuallTile);
                (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
            }, 1000);
        }
        this.tile = actuallTile;
        //this.tile.getPawns().push(this)
        //startTile.removePawn(this)
        console.log('posunul');
    };
    Pawn.prototype.JSONfyPawn = function () {
        return { player: this.player,
            tileId: this.tileId };
    };
    return Pawn;
}());
exports.Pawn = Pawn;
