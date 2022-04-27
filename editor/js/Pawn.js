"use strict";
exports.__esModule = true;
exports.Pawn = void 0;
var canvas_1 = require("./canvas");
var clientSocket_js_1 = require("./clientSocket.js");
var Pawn = /** @class */ (function () {
    function Pawn(player, tile) {
        this.id = 0;
        this.color = '#000000';
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
            actuallTile = canvas_1.editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber());
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
        var endTile = this.tile;
        var p = this;
        for (var i = 0; i < numOfTiles; i++) {
            setTimeout(function () {
                actuallTile.removePawn(p);
                actuallTile = canvas_1.editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber());
                actuallTile.getPawns().push(p);
                p.tileId = actuallTile.getId();
                p.tile = actuallTile;
                (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
            }, 500 * i);
        }
        var params = new URLSearchParams(window.location.search);
        if (canvas_1.editor.getGame().getIsOnturn()) {
            setTimeout(function () {
                clientSocket_js_1.editorSocket.emit('change Pawn position', { pawnId: p.id, tileId: p.tileId, room: params.get('id'), id: (0, clientSocket_js_1.getCookie)('id') });
                startTile.setIsChoosen(false);
                canvas_1.editor.setChoosenTile(undefined);
                canvas_1.editor.reactToTile(actuallTile, numOfTiles, p);
                console.log(actuallTile);
                console.log(canvas_1.editor);
                (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
            }, 550 * numOfTiles);
        }
        console.log('vykonal move pawn');
        console.log(canvas_1.editor.getGame().getIsOnturn());
        console.log(numOfTiles);
    };
    Pawn.prototype.returnToStart = function () {
        this.tile.removePawn(this);
        this.tileId = this.startingTileId;
        this.tile = canvas_1.editor.findTileById(this.tileId);
        this.tile.getPawns().push(this);
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
    };
    Pawn.prototype.JSONfyPawn = function () {
        return { player: this.player,
            tileId: this.tileId };
    };
    return Pawn;
}());
exports.Pawn = Pawn;
