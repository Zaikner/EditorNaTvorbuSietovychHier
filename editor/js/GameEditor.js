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
        this.initNewGame();
    }
    GameEditor.prototype.initNewGame = function () {
        this.game = new Game_js_1.Game();
        console.log(this.getGame());
    };
    GameEditor.prototype.initTile = function (coords, color, size, stroke, strokeColor, shape, background, pattern) {
        var newTile = new Tile_js_1.Tile('', coords.x, coords.y, coords.x - size, coords.x + size, coords.y - size, coords.y + size, size, color);
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
        // var image = new Image()
        // let tileImage:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileImage')!
        // image.src =URL.createObjectURL(tileImage!.files![0]!)
        // newTile.backgroundFile = image
        newTile.setShape(shape);
        this.game.addTile(newTile);
        newTile.drawTile(canvas_js_1.canvas, canvas_js_1.ctx);
    };
    GameEditor.prototype.findTile = function (event) {
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
                    if (!TileEditor_js_1.isMoving)
                        (0, TileEditor_js_1.editTiles)();
                }
                break;
            }
        }
    };
    GameEditor.prototype.deleteTile = function (event) {
        var coords = (0, canvas_js_1.calibreEventCoords)(event);
        var tiles = this.game.getTiles();
        for (var i = tiles.length - 1; i >= 0; i--) {
            if (tiles[i].isPointedAt(coords.x, coords.y)) {
                this.game.removeTile(tiles[i]);
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
    GameEditor.prototype.getGame = function () {
        return this.game;
    };
    GameEditor.prototype.setGame = function (newGame) {
        this.game = newGame;
    };
    GameEditor.prototype.getChoosenTile = function () {
        return this.choosenTile;
    };
    return GameEditor;
}());
exports.GameEditor = GameEditor;
