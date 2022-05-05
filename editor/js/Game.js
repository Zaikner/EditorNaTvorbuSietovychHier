"use strict";
exports.__esModule = true;
exports.Game = void 0;
var Path_js_1 = require("./Path.js");
var Background_js_1 = require("./Background.js");
var canvas_js_1 = require("./canvas.js");
var clientSocket_js_1 = require("./clientSocket.js");
var Warning_js_1 = require("./Warning.js");
var Pawn_js_1 = require("./Pawn.js");
var PawnStyle_js_1 = require("./PawnStyle.js");
var Game = /** @class */ (function () {
    function Game() {
        this.id = 0;
        this.name = "";
        this.author = "";
        this.path = new Path_js_1.Path();
        //players:Array<Player>
        this.numOfPlayers = 2;
        this.tiles = [];
        this.playerTokens = ['Player 1', 'Player 2'];
        this.pawnStyle = new Map([['Player 1', new PawnStyle_js_1.PawnStyle('Player 1', '#000000', 'type1')], ['Player 2', new PawnStyle_js_1.PawnStyle('Player 2', '#000000', 'type1')]]);
        this.background = new Background_js_1.Background();
        this.nextTileNumber = 1;
        this.initSizeX = 0;
        this.initSizeY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.pawns = [];
        this.rules = '';
        this.isPublished = false;
        this.numberOfStartingPawns = 1;
        //----------playing---------
        //private hasStarted = false;
        this.isOnTurn = false;
        this.nextTilesIds = new Map();
        this.canThrow = false;
        this.toogleNumber = false;
        this.questions = new Map();
    }
    Game.prototype.saveGame = function () {
        if (this.name.length == 0) {
            Warning_js_1.Warning.show(clientSocket_js_1.texts[182]);
        }
        else {
            var savedTiles_1 = [];
            this.tiles.forEach(function (tile) {
                savedTiles_1.push(tile.JSONfyTile());
            });
            var savedPawns_1 = [];
            this.pawns.forEach(function (pawn) {
                savedPawns_1.push(pawn.JSONfyPawn());
            });
            var savedPawnStyles_1 = [];
            Array.from(this.pawnStyle.values()).forEach(function (pawnStyle) {
                savedPawnStyles_1.push(pawnStyle.JSONfyStyle());
            });
            clientSocket_js_1.editorSocket.emit('saveGame', { name: this.name,
                author: this.author,
                background: this.background.save(),
                id: this.id,
                tiles: savedTiles_1,
                numOfPlayers: this.numOfPlayers,
                pawns: savedPawns_1,
                styles: savedPawnStyles_1,
                rules: this.rules,
                clientId: (0, clientSocket_js_1.getCookie)('id'),
                nextTilesIds: this.mapNextTiles(),
                initSizeX: this.initSizeX,
                initSizeY: this.initSizeY,
                isPublished: this.isPublished,
                toogleNumber: this.toogleNumber
            });
        }
    };
    Game.prototype.insertPawns = function (player, tile) {
        for (var i = 0; i < this.numberOfStartingPawns; i++) {
            var pwn = new Pawn_js_1.Pawn(player, tile);
            this.pawns.push(pwn);
        }
    };
    Game.prototype.findTileByTileId = function (id) {
        var tile = undefined;
        this.tiles.forEach(function (t) {
            if (t.getTileNumber() == id) {
                tile = t;
            }
        });
        return tile;
    };
    Game.prototype.movePawnById = function (id, value) {
        var moved = false;
        this.pawns.forEach(function (p) {
            console.log(p);
            if (p.id == id && !moved) {
                console.log('pohol som idkcom' + id + ' o ' + value);
                moved = true;
                if (p.canMove(value)) {
                    p.move(value);
                }
                else {
                    console.log('found pawn but cant move');
                }
                return p;
            }
        });
    };
    Game.prototype.howManyCanMove = function (id, value) {
        var pawn = canvas_js_1.editor.findPawnById(id);
        while (!pawn.canMove(value)) {
            value--;
        }
        return value;
    };
    Game.prototype.howManyCanMoveBack = function (id, value) {
        var pawn = canvas_js_1.editor.findPawnById(id);
        var originalTile = canvas_js_1.editor.findTileById(pawn.tileId);
        var tileId = originalTile.getTileNumber();
        var ret = 0;
        while (value > 0) {
            var tileId_1 = originalTile.getTileNumber();
            for (var i = 0; i < value; i++) {
                var tile = canvas_js_1.editor.findTileByNextTileNumber(tileId_1, pawn.player);
                if (tile != undefined) {
                    tileId_1 = tile.getTileNumber();
                    if (i + 1 == value) {
                        ret = value;
                    }
                }
            }
            value--;
        }
        return ret;
    };
    Game.prototype.mapNextTiles = function () {
        var ret = [];
        Array.from(this.nextTilesIds.entries()).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            ret.push(key);
            ret.push(value.toString());
        });
        return ret;
    };
    Game.prototype.containsQuestionId = function (id) {
        var ret = false;
        this.tiles.forEach(function (tile) {
            if (tile.getQuestionId() == id) {
                ret = true;
            }
        });
        return ret;
    };
    Game.prototype.containsRandomQuestionAndQuestionNumberIs1 = function () {
        var numOfQuestions = Array.from(canvas_js_1.editor.getGame().getQuestions().entries()).length;
        var ret = false;
        this.tiles.forEach(function (tile) {
            if (tile.getRandomQuestion() && numOfQuestions == 1) {
                ret = true;
            }
        });
        return ret;
    };
    Game.prototype.removeTile = function (tile) {
        this.tiles = this.tiles.filter(function (t) { return t != tile; });
    };
    Game.prototype.removePawn = function (pawn) {
        this.pawns = this.pawns.filter(function (p) { return p != pawn; });
    };
    Game.prototype.setPath = function (newPath) {
        this.path = newPath;
    };
    Game.prototype.getPath = function () {
        return this.path;
    };
    Game.prototype.setNumOfPlayers = function (num) {
        this.numOfPlayers = num;
    };
    Game.prototype.getnumOfPlayers = function () {
        return this.numOfPlayers;
    };
    Game.prototype.setTiles = function (newTiles) {
        this.tiles = newTiles;
    };
    Game.prototype.getTiles = function () {
        return this.tiles;
    };
    Game.prototype.addTile = function (newTile) {
        this.tiles.push(newTile);
    };
    Game.prototype.getAuthor = function () {
        return this.author;
    };
    Game.prototype.setAuthor = function (newAuthor) {
        this.author = newAuthor;
    };
    Game.prototype.getName = function () {
        return this.name;
    };
    Game.prototype.setRules = function (newRules) {
        this.rules = newRules;
    };
    Game.prototype.getRules = function () {
        return this.rules;
    };
    Game.prototype.setName = function (newName) {
        this.name = newName;
    };
    Game.prototype.getBackground = function () {
        return this.background;
    };
    Game.prototype.setBackground = function (newBackground) {
        this.background = newBackground;
    };
    Game.prototype.getNextTileNumber = function () {
        return this.nextTileNumber;
    };
    Game.prototype.setNextTileNumber = function (nextTileNumber) {
        this.nextTileNumber = nextTileNumber;
    };
    Game.prototype.setPlayerTokens = function (newTokens) {
        this.playerTokens = newTokens;
    };
    Game.prototype.getPlayerTokens = function () {
        return this.playerTokens;
    };
    Game.prototype.getInitSizeX = function () {
        return this.initSizeX;
    };
    Game.prototype.setInitSizeX = function (newCoord) {
        return this.initSizeX = newCoord;
    };
    Game.prototype.getInitSizeY = function () {
        return this.initSizeY;
    };
    Game.prototype.setInitSizeY = function (newCoord) {
        return this.initSizeY = newCoord;
    };
    Game.prototype.getScaleX = function () {
        return this.scaleX;
    };
    Game.prototype.setScaleX = function (newCoord) {
        return this.scaleX = newCoord;
    };
    Game.prototype.getScaleY = function () {
        return this.scaleY;
    };
    Game.prototype.setNumberOfStartingPawns = function (newNum) {
        return this.numberOfStartingPawns = newNum;
    };
    Game.prototype.getNumberOfStartingPawns = function () {
        return this.numberOfStartingPawns;
    };
    Game.prototype.setScaleY = function (newCoord) {
        return this.scaleY = newCoord;
    };
    Game.prototype.setPawns = function (newPawns) {
        this.pawns = newPawns;
    };
    Game.prototype.getPawns = function () {
        return this.pawns;
    };
    Game.prototype.setPawnStyle = function (newPawns) {
        this.pawnStyle = newPawns;
    };
    Game.prototype.getPawnStyle = function () {
        return this.pawnStyle;
    };
    Game.prototype.setIsOnTurn = function (is) {
        this.isOnTurn = is;
    };
    Game.prototype.getIsOnturn = function () {
        return this.isOnTurn;
    };
    Game.prototype.setToogleNumber = function (is) {
        this.toogleNumber = is;
    };
    Game.prototype.getToogleNumber = function () {
        return this.toogleNumber;
    };
    Game.prototype.setNextTilesIds = function (newIds) {
        this.nextTilesIds = newIds;
    };
    Game.prototype.getQuestions = function () {
        return this.questions;
    };
    Game.prototype.setQuestions = function (newQuestions) {
        this.questions = newQuestions;
    };
    Game.prototype.getNextTilesIds = function () {
        return this.nextTilesIds;
    };
    Game.prototype.setCanThrow = function (is) {
        this.canThrow = is;
    };
    Game.prototype.getCanThrow = function () {
        return this.canThrow;
    };
    Game.prototype.setIsPublished = function (is) {
        this.isPublished = is;
    };
    Game.prototype.getIsPublished = function () {
        return this.isPublished;
    };
    Game.prototype.setId = function (newId) {
        this.id = newId;
    };
    Game.prototype.getId = function () {
        return this.id;
    };
    return Game;
}());
exports.Game = Game;
