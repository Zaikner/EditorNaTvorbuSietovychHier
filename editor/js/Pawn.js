"use strict";
exports.__esModule = true;
exports.Pawn = void 0;
var Canvas_1 = require("./Canvas");
var ClientSocket_js_1 = require("./ClientSocket.js");
var Pawn = /** @class */ (function () {
    function Pawn(player, tile) {
        this.id = 0;
        this.hasEnded = false;
        this.player = player;
        this.tile = tile;
        this.tileId = tile.getId();
        this.startingTileId = tile.getId();
        tile.getPawns().push(this);
    }
    Pawn.prototype.canMove = function (numOfTiles) {
        var ret = true;
        var actuallTile = this.tile;
        for (var i = 0; i < numOfTiles; i++) {
            var newTile = Canvas_1.game.findTileByTileId(actuallTile.getNextTilesIds().get(this.player));
            if (newTile == actuallTile) {
                ret = false;
                break;
            }
            actuallTile = newTile;
            if (actuallTile == undefined) {
                ret = false;
                break;
            }
        }
        return ret;
    };
    Pawn.prototype.move = function (numOfTiles) {
        var startTile = this.tile;
        var actuallTile = this.tile;
        var p = this;
        for (var i = 0; i < numOfTiles; i++) {
            setTimeout(function () {
                actuallTile.removePawn(p);
                actuallTile = Canvas_1.game.findTileByTileId(actuallTile.getNextTilesIds().get(p.player));
                actuallTile.getPawns().push(p);
                p.tileId = actuallTile.getId();
                p.tile = actuallTile;
                (0, Canvas_1.reload)(Canvas_1.ctx);
            }, 500 * i);
        }
        var params = new URLSearchParams(window.location.search);
        if (Canvas_1.game.getHasThrown()) {
            setTimeout(function () {
                ClientSocket_js_1.editorSocket.emit('change Pawn position', { pawnId: p.id, tileId: p.tileId, room: params.get('id'), id: (0, ClientSocket_js_1.getCookie)('id') });
                startTile.setIsChoosen(false);
                Canvas_1.game.setChoosenTile(undefined);
                Canvas_1.game.reactToTile(actuallTile, numOfTiles, p);
                (0, Canvas_1.reload)(Canvas_1.ctx);
            }, 550 * numOfTiles);
        }
        else {
            console.log('nereagoval lebo nebolo jeho kolo');
        }
    };
    Pawn.prototype.returnToStart = function () {
        this.tile.removePawn(this);
        this.tileId = this.startingTileId;
        this.tile = Canvas_1.game.findTileById(this.tileId);
        this.tile.getPawns().push(this);
        (0, Canvas_1.reload)(Canvas_1.ctx);
    };
    Pawn.prototype.JSONfyPawn = function () {
        return { player: this.player,
            tileId: this.tileId };
    };
    return Pawn;
}());
exports.Pawn = Pawn;
