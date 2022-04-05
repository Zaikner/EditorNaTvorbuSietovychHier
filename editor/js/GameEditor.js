"use strict";
exports.__esModule = true;
exports.GameEditor = void 0;
var canvas_js_1 = require("./canvas.js");
var Tile_js_1 = require("./Tile.js");
var Game_js_1 = require("./Game.js");
var TileEditor_js_1 = require("./TileEditor.js");
var GameEditor = /** @class */ (function () {
    function GameEditor() {
        this.game = new Game_js_1.Game();
        this.choosenTile = undefined;
        this.undoLog = [];
        this.isMoving = false;
        this.image = undefined;
        this.pattern = undefined;
        this.startForPlayers = [];
        this.endForPlayers = [];
        this.enabledForPlayers = [];
        this.cantBeEliminatedOnTile = [];
        this.nextTileId = 0;
        this.questionId = -1;
        this.initNewGame();
    }
    GameEditor.prototype.nullEditor = function () {
        this.startForPlayers = [];
        this.endForPlayers = [];
        this.enabledForPlayers = [];
        this.image = undefined;
        this.pattern = undefined;
    };
    GameEditor.prototype.initNewGame = function () {
        this.game = new Game_js_1.Game();
        console.log(this.getGame());
    };
    GameEditor.prototype.initTile = function (add, coords, color, size, stroke, strokeColor, shape, background, pattern) {
        var tileNumber = this.nextTileNumber();
        var newTile = new Tile_js_1.Tile('', coords.x, coords.y, coords.x - size, coords.x + size, coords.y - size, coords.y + size, size, color, this.game.getNextTileNumber());
        if (stroke != 0) {
            newTile.setStroke(stroke);
            newTile.setStrokeColor(strokeColor);
        }
        if (background != undefined) {
            newTile.setBackgroundFile(background);
        }
        if (pattern != undefined) {
            newTile.setPatternFile(pattern);
        }
        newTile.setShape(shape);
        if (add) {
            this.game.addTile(newTile);
            this.nextTileId++;
        }
        newTile.drawTile(canvas_js_1.canvas, canvas_js_1.ctx, false);
        //this.game.increaseTileNumber()
        newTile.setTileNumber(tileNumber);
        newTile.setFollowingTileNumber(tileNumber + 1);
        console.log('cislo dalsieho je :' + this.game.getNextTileNumber());
        newTile.setId(this.nextTileId);
        console.log('pridany je ');
        console.log(newTile);
        return newTile;
    };
    GameEditor.prototype.findTile = function (event, edit) {
        var coords = (0, canvas_js_1.calibreEventCoords)(event);
        var tiles = this.game.getTiles();
        for (var i = tiles.length - 1; i >= 0; i--) {
            if (tiles[i].isPointedAt(coords.x, coords.y)) {
                if (tiles[i] == this.choosenTile) {
                    tiles[i].setIsChoosen(false);
                    this.choosenTile = undefined;
                }
                else {
                    if (this.choosenTile != undefined) {
                        this.choosenTile.setIsChoosen(false);
                    }
                    tiles[i].setIsChoosen(true);
                    this.choosenTile = tiles[i];
                    if (!this.isMoving && edit)
                        (0, TileEditor_js_1.editTiles)();
                }
                break;
            }
        }
    };
    GameEditor.prototype.deleteTile = function (event) {
        var _this = this;
        var coords = (0, canvas_js_1.calibreEventCoords)(event);
        var tiles = this.game.getTiles();
        for (var i = tiles.length - 1; i >= 0; i--) {
            if (tiles[i].isPointedAt(coords.x, coords.y)) {
                this.game.removeTile(tiles[i]);
                tiles[i].getPawns().forEach(function (pawn) {
                    _this.game.removePawn(pawn);
                });
                break;
            }
        }
    };
    GameEditor.prototype.updateChoosenTile = function (color, size, hasStroke, stroke, strokeColor, shape, image) {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = this.choosenTile) === null || _a === void 0 ? void 0 : _a.setColor(color);
        // this.choosenTile?.setCenterX(centerX)
        // this.choosenTile?.setCenterY(centerY)
        // this.choosenTile?.setX1(centerX-size)
        // this.choosenTile?.setX2(centerX+size)
        // this.choosenTile?.setY1(centerY-size)
        // this.choosenTile?.setY2(centerY+size)
        (_b = this.choosenTile) === null || _b === void 0 ? void 0 : _b.setRadius(size);
        (_c = this.choosenTile) === null || _c === void 0 ? void 0 : _c.setShape(shape);
        (_d = this.choosenTile) === null || _d === void 0 ? void 0 : _d.setBackgroundFile(image);
        if (hasStroke) {
            (_e = this.choosenTile) === null || _e === void 0 ? void 0 : _e.setStroke(stroke);
            (_f = this.choosenTile) === null || _f === void 0 ? void 0 : _f.setStrokeColor(strokeColor);
        }
        else {
            (_g = this.choosenTile) === null || _g === void 0 ? void 0 : _g.setStroke(0);
        }
    };
    GameEditor.prototype.moveTile = function (event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var coords = (0, canvas_js_1.calibreEventCoords)(event);
        (_a = this.choosenTile) === null || _a === void 0 ? void 0 : _a.setCenterX(coords.x);
        (_b = this.choosenTile) === null || _b === void 0 ? void 0 : _b.setCenterY(coords.y);
        (_c = this.choosenTile) === null || _c === void 0 ? void 0 : _c.setX1(coords.x - ((_d = this.choosenTile) === null || _d === void 0 ? void 0 : _d.getRadius()));
        (_e = this.choosenTile) === null || _e === void 0 ? void 0 : _e.setX2(coords.x + ((_f = this.choosenTile) === null || _f === void 0 ? void 0 : _f.getRadius()));
        (_g = this.choosenTile) === null || _g === void 0 ? void 0 : _g.setY1(coords.y - ((_h = this.choosenTile) === null || _h === void 0 ? void 0 : _h.getRadius()));
        (_j = this.choosenTile) === null || _j === void 0 ? void 0 : _j.setY2(coords.y + ((_k = this.choosenTile) === null || _k === void 0 ? void 0 : _k.getRadius()));
    };
    GameEditor.prototype.makeAllTilesNotChoosen = function () {
        var tiles = this.game.getTiles();
        tiles.forEach(function (tile) { tile.setIsChoosen(false); });
        this.choosenTile = undefined;
    };
    GameEditor.prototype.addToUndoLog = function (addition) {
        console.log('pridal do undoLogu');
        this.undoLog.push(addition);
    };
    GameEditor.prototype.removeLastFromUndoLog = function () {
        var _this = this;
        var removed = this.undoLog.pop();
        removed === null || removed === void 0 ? void 0 : removed.forEach(function (tile) {
            _this.game.removeTile(tile);
        });
    };
    GameEditor.prototype.nextTileNumber = function () {
        var i = 1;
        var cont = true;
        while (cont) {
            cont = false;
            this.game.getTiles().forEach(function (tile) {
                if (tile.getTileNumber() == i) {
                    i++;
                    cont = true;
                }
            });
        }
        return i;
    };
    GameEditor.prototype.tileWithNumberExists = function (num) {
        var res = false;
        this.game.getTiles().forEach(function (tile) {
            if (tile.getTileNumber() === num) {
                res = true;
            }
            console.log('rovna sa ' + tile.getTileNumber() + ' : ' + (tile.getTileNumber() === num));
        });
        return res;
    };
    GameEditor.prototype.findTileById = function (id) {
        var t = new Tile_js_1.Tile('', 0, 0, 0, 0, 0, 0, 0, '', 0);
        this.game.getTiles().forEach(function (tile) {
            if (tile.getId() == id) {
                t = tile;
            }
        });
        return t;
    };
    GameEditor.prototype.reactToTile = function (tile) {
        var params = new URLSearchParams(window.location.search);
        canvas_js_1.editorSocket.emit('react to tile', { room: params.get('id'), questionId: tile.getQuestionId() });
    };
    GameEditor.prototype.getGame = function () {
        return this.game;
    };
    GameEditor.prototype.setGame = function (newGame) {
        this.game = newGame;
    };
    GameEditor.prototype.getChoosenTile = function () {
        return this.choosenTile;
    };
    GameEditor.prototype.setChoosenTile = function (newTile) {
        this.choosenTile = newTile;
    };
    GameEditor.prototype.getIsMoving = function () {
        return this.isMoving;
    };
    GameEditor.prototype.setIsMoving = function (is) {
        this.isMoving = is;
    };
    GameEditor.prototype.getImage = function () {
        return this.image;
    };
    GameEditor.prototype.setImage = function (newImage) {
        this.image = newImage;
    };
    GameEditor.prototype.getPattern = function () {
        return this.pattern;
    };
    GameEditor.prototype.setPattern = function (newPattern) {
        this.pattern = newPattern;
    };
    GameEditor.prototype.setStartForPlayers = function (newStartForPlayers) {
        this.startForPlayers = newStartForPlayers;
    };
    GameEditor.prototype.getStartForPlayers = function () {
        return this.startForPlayers;
    };
    GameEditor.prototype.setEndForPlayers = function (newEndForPlayers) {
        this.endForPlayers = newEndForPlayers;
    };
    GameEditor.prototype.getEndForPlayers = function () {
        return this.endForPlayers;
    };
    GameEditor.prototype.setEnabledForPlayers = function (newEnabledForPlayers) {
        this.enabledForPlayers = newEnabledForPlayers;
    };
    GameEditor.prototype.getEnabledForPlayers = function () {
        return this.enabledForPlayers;
    };
    GameEditor.prototype.setCantBeEliminatedOnTile = function (newPlayers) {
        this.cantBeEliminatedOnTile = newPlayers;
    };
    GameEditor.prototype.getCantBeEliminatedOnTile = function () {
        return this.cantBeEliminatedOnTile;
    };
    GameEditor.prototype.getQuestionId = function () {
        return this.questionId;
    };
    GameEditor.prototype.setQuestionId = function (newId) {
        this.questionId = newId;
    };
    return GameEditor;
}());
exports.GameEditor = GameEditor;
