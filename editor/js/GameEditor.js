"use strict";
exports.__esModule = true;
exports.GameEditor = void 0;
var canvas_js_1 = require("./canvas.js");
var clientSocket_js_1 = require("./clientSocket.js");
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
        this.skip = 0;
        this.repeat = 0;
        this.forward = 0;
        this.backward = 0;
        this.mustThrown = 0;
        this.turnToSetFree = 0;
        this.randomQuestion = false;
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
        var _this = this;
        this.game = new Game_js_1.Game();
        this.game.getPlayerTokens().forEach(function (token) {
            _this.game.getNextTilesIds().set(token, 2);
        });
    };
    GameEditor.prototype.initTile = function (add, coords, color, size, stroke, strokeColor, shape, background) {
        var tileNumber = this.nextTileNumber();
        var newTile = new Tile_js_1.Tile(coords.x, coords.y, coords.x - size, coords.x + size, coords.y - size, coords.y + size, size, color, this.game.getNextTileNumber());
        if (stroke != 0) {
            newTile.setStroke(stroke);
            newTile.setStrokeColor(strokeColor);
        }
        if (background != undefined) {
            newTile.setImage(background);
        }
        newTile.setShape(shape);
        if (add) {
            this.game.addTile(newTile);
            this.nextTileId++;
        }
        newTile.drawTile(canvas_js_1.canvas, canvas_js_1.ctx, false);
        //this.game.increaseTileNumber()
        newTile.setTileNumber(tileNumber);
        //newTile.setFollowingTileNumber(tileNumber+1)
        newTile.setId(this.nextTileId);
        return newTile;
    };
    GameEditor.prototype.findTile = function (event, edit) {
        console.log('zavolal find tile');
        var found = false;
        var coords = (0, canvas_js_1.calibreEventCoords)(event);
        var tiles = this.game.getTiles();
        for (var i = tiles.length - 1; i >= 0; i--) {
            if (tiles[i].isPointedAt(coords.x, coords.y)) {
                console.log('nasiel');
                found = true;
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
                    //if (!this.isMoving && edit)editTiles()
                }
                break;
            }
        }
        console.log('found je :');
        console.log(found);
        if (!found) {
            (0, TileEditor_js_1.insert)(event);
        }
        else if (!this.isMoving && edit) {
            (0, TileEditor_js_1.editTiles)();
        }
    };
    GameEditor.prototype.deleteTile = function () {
        // let coords = calibreEventCoords(event)
        // let tiles = this.game.getTiles()
        var _this = this;
        // for (let i = tiles.length-1; i >= 0;i--){
        //     if (tiles[i].isPointedAt(coords.x,coords.y)){
        //         this.game.removeTile(tiles[i])
        //         tiles[i].getPawns().forEach((pawn:Pawn)=>{
        //             this.game.removePawn(pawn)
        //         })
        //         break
        //     }
        // }
        if (this.choosenTile != undefined) {
            this.game.removeTile(this.choosenTile);
            this.renumber(this.choosenTile.getTileNumber());
            this.choosenTile.getPawns().forEach(function (pawn) {
                _this.game.removePawn(pawn);
            });
            (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
        }
    };
    GameEditor.prototype.updateChoosenTile = function (color, size, stroke, strokeColor, shape, image) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        (_a = this.choosenTile) === null || _a === void 0 ? void 0 : _a.setColor(color);
        // this.choosenTile?.setCenterX(centerX)
        // this.choosenTile?.setCenterY(centerY)
        // this.choosenTile?.setX1(centerX-size)
        // this.choosenTile?.setX2(centerX+size)
        // this.choosenTile?.setY1(centerY-size)
        // this.choosenTile?.setY2(centerY+size)
        (_b = this.choosenTile) === null || _b === void 0 ? void 0 : _b.setRadius(size);
        (_c = this.choosenTile) === null || _c === void 0 ? void 0 : _c.setShape(shape);
        (_d = this.choosenTile) === null || _d === void 0 ? void 0 : _d.setImage(image);
        (_e = this.choosenTile) === null || _e === void 0 ? void 0 : _e.setStroke(stroke);
        (_f = this.choosenTile) === null || _f === void 0 ? void 0 : _f.setStrokeColor(strokeColor);
        (_g = this.choosenTile) === null || _g === void 0 ? void 0 : _g.setX1(this.choosenTile.getCenterX() - size);
        (_h = this.choosenTile) === null || _h === void 0 ? void 0 : _h.setX2(this.choosenTile.getCenterX() + size);
        (_j = this.choosenTile) === null || _j === void 0 ? void 0 : _j.setY1(this.choosenTile.getCenterY() - size);
        (_k = this.choosenTile) === null || _k === void 0 ? void 0 : _k.setY2(this.choosenTile.getCenterY() + size);
        this.choosenTile;
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
        });
        return res;
    };
    GameEditor.prototype.findTileById = function (id) {
        var t = undefined;
        this.game.getTiles().forEach(function (tile) {
            if (tile.getId() == id) {
                t = tile;
            }
        });
        return t;
    };
    GameEditor.prototype.findTileByNextTileNumber = function (id, token) {
        var t = undefined;
        this.game.getTiles().forEach(function (tile) {
            if (tile.getNextTilesIds().get(token) == id) {
                t = tile;
            }
        });
        return t;
    };
    GameEditor.prototype.reactToTile = function (tile, returnValue, pawn) {
        var params = new URLSearchParams(window.location.search);
        if (this.game.getIsOnturn()) {
            console.log('emited react to tile');
            console.log(this.game.getIsOnturn());
            var canRemovePawnIds_1 = [];
            this.game.getPlayerTokens().forEach(function (token) {
                if (!tile.getCantBeEliminatedOnTile().includes(token) && token != pawn.player) {
                    tile.getPawns().forEach(function (p) {
                        if (p.player == token && !p.hasEnded) {
                            canRemovePawnIds_1.push(p.id);
                        }
                    });
                }
            });
            clientSocket_js_1.editorSocket.emit('react to tile', { room: params.get('id'),
                questionId: tile.getQuestionId(),
                randomQuestion: tile.getRandomQuestion(),
                id: (0, clientSocket_js_1.getCookie)('id'),
                returnValue: returnValue,
                pawnId: pawn.id,
                forward: tile.getForward(),
                backward: tile.getBackward(),
                skip: tile.getSkip(),
                repeat: tile.getRepeat(),
                mustThrown: tile.getMustThrown(),
                turnsToSetFree: tile.getTurnsToSetFree(),
                canRemovePawnIds: canRemovePawnIds_1
            });
            this.game.setIsOnTurn(false);
        }
    };
    GameEditor.prototype.findPawnById = function (id) {
        var res = undefined;
        this.getGame().getPawns().forEach(function (pawn) {
            if (pawn.id == id) {
                res = pawn;
            }
        });
        return res;
    };
    GameEditor.prototype.playerEnded = function (token) {
        var ret = true;
        this.getGame().getTiles().forEach(function (tile) {
            if (tile.getIsEndingFor().includes(token) && !tile.isSuccessfullyEnding(token)) {
                ret = false;
                console.log(tile);
                console.log(tile.getIsEndingFor().includes(token));
                console.log(!tile.isSuccessfullyEnding(token));
            }
        });
        return ret;
    };
    GameEditor.prototype.movePawnBack = function (pawnId, value, react) {
        console.log('vykonal move back pawnId:', pawnId, value, react);
        var pawn = this.findPawnById(pawnId);
        var tile = this.findTileById(pawn.tileId);
        tile.removePawn(pawn);
        for (var i = 0; i < value; i++) {
            //console.log('Previous tile with id: '+tile.getFollowingTileNumber())
            console.log('Previous tile with id: ' + tile.getNextTilesIds().get(pawn.player));
            tile = this.findTileByNextTileNumber(tile.getTileNumber(), pawn.player);
            console.log('otocil');
            console.log(tile);
        }
        tile.getPawns().push(pawn);
        pawn.tileId = tile.getId();
        pawn.tile = tile;
        (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
        if (react) {
            this.reactToTile(tile, value, pawn);
        }
        // console.log('tile id: '+ tileId + ' pawn id: ' + pawnId)
        // console.log()
        // let addTo:Tile =  this.findTileById(tileId);
        // console.log(addTo)
        // let pawn:Pawn;
        // this.getGame().getTiles().forEach((tile:Tile)=>{
        //     tile.getPawns().forEach((p:Pawn)=>{
        //         if (p.id == pawnId){
        //            pawn = p
        //            p.tileId = tileId
        //            p.tile = addTo
        //            addTo.getPawns().push(p)
        //            tile.removePawn(p)
        //            console.log('tento pawn:')
        //            console.log(pawn)
        //            console.log('tento tile')
        //            console.log(addTo)
        //            reload(editor,ctx)
        //         }
        //     })
        // })
    };
    GameEditor.prototype.setEvents = function (type, values) {
        this.skip = 0;
        this.repeat = 0;
        this.forward = 0;
        this.backward = 0;
        this.mustThrown = 0;
        this.turnToSetFree = 0;
        this.questionId = -1;
        this.randomQuestion = false;
        if (type == 'skip') {
            this.skip = values.num;
        }
        else if (type == 'repeat') {
            this.repeat = values.num;
        }
        else if (type == 'forward') {
            this.forward = values.num;
        }
        else if (type == 'backward') {
            this.backward = values.num;
        }
        else if (type == 'stop') {
            this.mustThrown = values.value;
            this.turnToSetFree = values.num;
        }
        else if (type == 'random') {
            this.randomQuestion = true;
        }
        else if (type == 'question') {
            this.questionId = values.num;
        }
    };
    GameEditor.prototype.checkIfAllPlayersHaveStartingTile = function () {
        var all = this.game.getPlayerTokens();
        var present = new Set();
        this.game.getTiles().forEach(function (tile) {
            all.forEach(function (token) {
                if (tile.getIsStartingFor().includes(token)) {
                    present.add(token);
                }
            });
        });
        var p = Array.from(present);
        var notStarted = [];
        all.forEach(function (token) {
            if (!p.includes(token)) {
                notStarted.push(token);
            }
        });
        return notStarted;
    };
    GameEditor.prototype.checkIfAllPlayersHaveFinishTile = function () {
        var all = this.game.getPlayerTokens();
        var present = new Set();
        this.game.getTiles().forEach(function (tile) {
            all.forEach(function (token) {
                if (tile.getIsEndingFor().includes(token)) {
                    present.add(token);
                }
            });
        });
        var p = Array.from(present);
        var notFinished = [];
        all.forEach(function (token) {
            if (!p.includes(token)) {
                notFinished.push(token);
            }
        });
        return notFinished;
    };
    GameEditor.prototype.checkIfPathFromStartToEndExists = function () {
    };
    GameEditor.prototype.getAllStartTiles = function () {
        return this.game.getTiles().filter(function (t) { return t.getIsStartingFor().length > 0; }).flatMap(function (tile) { return tile.getIsStartingFor(); });
    };
    GameEditor.prototype.getAllFinishTiles = function () {
        return this.game.getTiles().filter(function (t) { return t.getIsEndingFor().length > 0; });
    };
    GameEditor.prototype.renumber = function (deleted) {
        var _this = this;
        this.getGame().getTiles().forEach(function (tile) {
            if (tile.getTileNumber() > deleted) {
                tile.setTileNumber(tile.getTileNumber() - 1);
                _this.getGame().getTiles().forEach(function (t) {
                    _this.getGame().getPlayerTokens().forEach(function (token) {
                        if (t.getNextTilesIds().get(token) == (tile.getTileNumber() + 1)) {
                            console.log('premenil ' + (tile.getTileNumber() + 1) + ' na ' + tile.getTileNumber());
                            t.getNextTilesIds().set(token, tile.getTileNumber());
                        }
                    });
                });
            }
        });
        (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
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
    GameEditor.prototype.getSkip = function () {
        return this.skip;
    };
    GameEditor.prototype.setSkip = function (newSkip) {
        this.skip = newSkip;
    };
    GameEditor.prototype.getRepeat = function () {
        return this.repeat;
    };
    GameEditor.prototype.setRepeat = function (newRepeat) {
        this.repeat = newRepeat;
    };
    GameEditor.prototype.getForward = function () {
        return this.forward;
    };
    GameEditor.prototype.setForward = function (newForward) {
        this.forward = newForward;
    };
    GameEditor.prototype.getBackward = function () {
        return this.backward;
    };
    GameEditor.prototype.setBackward = function (newBackward) {
        this.backward = newBackward;
    };
    GameEditor.prototype.getNextTileId = function () {
        return this.nextTileId;
    };
    GameEditor.prototype.setNextTileId = function (newId) {
        this.nextTileId = newId;
    };
    GameEditor.prototype.getMustThrown = function () {
        return this.mustThrown;
    };
    GameEditor.prototype.setMustThrown = function (newThrown) {
        this.mustThrown = newThrown;
    };
    GameEditor.prototype.getTurnsToSetFree = function () {
        return this.turnToSetFree;
    };
    GameEditor.prototype.setTurnsToSetFree = function (newTurns) {
        this.turnToSetFree = newTurns;
    };
    GameEditor.prototype.setRandomQuestion = function (is) {
        this.randomQuestion = is;
    };
    GameEditor.prototype.getRandomQuestion = function () {
        return this.randomQuestion;
    };
    return GameEditor;
}());
exports.GameEditor = GameEditor;
