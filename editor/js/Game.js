"use strict";
exports.__esModule = true;
exports.Game = void 0;
var Path_js_1 = require("./Path.js");
var Tile_js_1 = require("./Tile.js");
var Background_js_1 = require("./Background.js");
var canvas_js_1 = require("./canvas.js");
var clientSocket_js_1 = require("./clientSocket.js");
var Warning_js_1 = require("./Warning.js");
var Pawn_js_1 = require("./Pawn.js");
var PawnStyle_js_1 = require("./PawnStyle.js");
var TileEditor_js_1 = require("./TileEditor.js");
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
                toogleNumber: this.toogleNumber,
                numOfPawnsPerTile: this.numberOfStartingPawns
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
            if (p.id == id && !moved) {
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
        var pawn = canvas_js_1.game.findPawnById(id);
        while (!pawn.canMove(value)) {
            value--;
        }
        return value;
    };
    Game.prototype.howManyCanMoveBack = function (id, value) {
        var pawn = canvas_js_1.game.findPawnById(id);
        var originalTile = canvas_js_1.game.findTileById(pawn.tileId);
        var tileId = originalTile.getTileNumber();
        var ret = 0;
        // while (value > 0){
        //     let tileId = originalTile.getTileNumber()
        //     for (let i = 0;i < value;i++){
        //         let tile = game.findTileByNextTileNumber(tileId,pawn.player)
        //         if (tile != undefined)
        //         {
        //             tileId = tile.getTileNumber()
        //             console.log('posunul ale neprehodil hodnotu')
        //             //if (i+1 == value){
        //                 ret+=1
        //             //}
        //         }
        //     }
        //     value--;
        // }
        for (var i = 0; i < value; i++) {
            var tile = canvas_js_1.game.findTileByNextTileNumber(tileId, pawn.player);
            if (tile != undefined) {
                tileId = tile.getTileNumber();
                //if (i+1 == value){
                ret += 1;
                //}
            }
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
        var numOfQuestions = Array.from(this.getQuestions().entries()).length;
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
    Game.prototype.renumber = function (deleted) {
        var _this = this;
        this.getTiles().forEach(function (tile) {
            if (tile.getTileNumber() > deleted) {
                tile.setTileNumber(tile.getTileNumber() - 1);
                _this.getTiles().forEach(function (t) {
                    _this.getPlayerTokens().forEach(function (token) {
                        if (t.getNextTilesIds().get(token) == (tile.getTileNumber() + 1)) {
                            t.getNextTilesIds().set(token, tile.getTileNumber());
                        }
                    });
                });
            }
        });
        (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
    };
    Game.prototype.nullEditor = function () {
        this.startForPlayers = [];
        this.endForPlayers = [];
        this.enabledForPlayers = [];
        this.image = undefined;
        this.pattern = undefined;
    };
    // initNewGame(){
    //     this
    //     this.game.getPlayerTokens().forEach((token:string)=>{
    //         this.game.getNextTilesIds().set(token,2)
    //     })
    // }   
    Game.prototype.initTile = function (add, coords, color, size, stroke, strokeColor, shape, background) {
        var tileNumber = this.makeNextTileNumber();
        var newTile = new Tile_js_1.Tile(coords.x, coords.y, coords.x - size, coords.x + size, coords.y - size, coords.y + size, size, color, this.getNextTileNumber());
        if (stroke != 0) {
            newTile.setStroke(stroke);
            newTile.setStrokeColor(strokeColor);
        }
        if (background != undefined) {
            newTile.setImage(background);
        }
        newTile.setShape(shape);
        if (add) {
            this.addTile(newTile);
            this.nextTileId++;
        }
        newTile.drawTile(canvas_js_1.canvas, canvas_js_1.ctx, false);
        //this.game.increaseTileNumber()
        newTile.setTileNumber(tileNumber);
        //newTile.setFollowingTileNumber(tileNumber+1)
        newTile.setId(this.nextTileId);
        return newTile;
    };
    Game.prototype.findTile = function (event, edit) {
        var found = false;
        var coords = (0, canvas_js_1.calibreEventCoords)(event);
        var tiles = this.getTiles();
        for (var i = tiles.length - 1; i >= 0; i--) {
            if (tiles[i].isPointedAt(coords.x, coords.y)) {
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
        if (!found) {
            (0, TileEditor_js_1.insert)(event);
        }
        else if (!this.isMoving && edit) {
            (0, TileEditor_js_1.editTiles)();
        }
    };
    Game.prototype.deleteTile = function () {
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
            this.removeTile(this.choosenTile);
            this.renumber(this.choosenTile.getTileNumber());
            this.choosenTile.getPawns().forEach(function (pawn) {
                _this.removePawn(pawn);
            });
            (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
        }
    };
    Game.prototype.updateChoosenTile = function (color, size, stroke, strokeColor, shape, image) {
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
    Game.prototype.moveTile = function (event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var coords = (0, canvas_js_1.calibreEventCoords)(event);
        (_a = this.choosenTile) === null || _a === void 0 ? void 0 : _a.setCenterX(coords.x);
        (_b = this.choosenTile) === null || _b === void 0 ? void 0 : _b.setCenterY(coords.y);
        (_c = this.choosenTile) === null || _c === void 0 ? void 0 : _c.setX1(coords.x - ((_d = this.choosenTile) === null || _d === void 0 ? void 0 : _d.getRadius()));
        (_e = this.choosenTile) === null || _e === void 0 ? void 0 : _e.setX2(coords.x + ((_f = this.choosenTile) === null || _f === void 0 ? void 0 : _f.getRadius()));
        (_g = this.choosenTile) === null || _g === void 0 ? void 0 : _g.setY1(coords.y - ((_h = this.choosenTile) === null || _h === void 0 ? void 0 : _h.getRadius()));
        (_j = this.choosenTile) === null || _j === void 0 ? void 0 : _j.setY2(coords.y + ((_k = this.choosenTile) === null || _k === void 0 ? void 0 : _k.getRadius()));
    };
    Game.prototype.makeAllTilesNotChoosen = function () {
        var tiles = this.getTiles();
        tiles.forEach(function (tile) { tile.setIsChoosen(false); });
        this.choosenTile = undefined;
    };
    Game.prototype.addToUndoLog = function (addition) {
        this.undoLog.push(addition);
    };
    Game.prototype.removeLastFromUndoLog = function () {
        var _this = this;
        var removed = this.undoLog.pop();
        removed === null || removed === void 0 ? void 0 : removed.forEach(function (tile) {
            _this.removeTile(tile);
        });
    };
    Game.prototype.makeNextTileNumber = function () {
        var i = 1;
        var cont = true;
        while (cont) {
            cont = false;
            this.getTiles().forEach(function (tile) {
                if (tile.getTileNumber() == i) {
                    i++;
                    cont = true;
                }
            });
        }
        return i;
    };
    Game.prototype.tileWithNumberExists = function (num) {
        var res = false;
        this.getTiles().forEach(function (tile) {
            if (tile.getTileNumber() === num) {
                res = true;
            }
        });
        return res;
    };
    Game.prototype.findTileById = function (id) {
        var t = undefined;
        this.getTiles().forEach(function (tile) {
            if (tile.getId() == id) {
                t = tile;
            }
        });
        return t;
    };
    Game.prototype.findTileByNextTileNumber = function (id, token) {
        var t = undefined;
        this.getTiles().forEach(function (tile) {
            if (tile.getNextTilesIds().get(token) == id) {
                t = tile;
            }
        });
        return t;
    };
    Game.prototype.reactToTile = function (tile, returnValue, pawn) {
        var params = new URLSearchParams(window.location.search);
        if (this.getIsOnturn()) {
            var canRemovePawnIds_1 = [];
            this.getPlayerTokens().forEach(function (token) {
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
            this.setIsOnTurn(false);
        }
    };
    Game.prototype.findPawnById = function (id) {
        var res = undefined;
        this.getPawns().forEach(function (pawn) {
            if (pawn.id == id) {
                res = pawn;
            }
        });
        return res;
    };
    Game.prototype.playerEnded = function (token) {
        var allTilesAreFull = true;
        this.getTiles().forEach(function (tile) {
            if (tile.getIsEndingFor().includes(token) && !tile.isSuccessfullyEnding(token)) {
                allTilesAreFull = false;
            }
        });
        var playerPawns = this.pawns.filter(function (p) { return token == p.player; });
        var allPawnFinished = true;
        playerPawns.forEach(function (pawn) {
            if (!pawn.tile.getIsEndingFor().includes(token)) {
                allPawnFinished = false;
            }
        });
        return (allTilesAreFull && allPawnFinished);
    };
    Game.prototype.movePawnBack = function (pawnId, value, react) {
        var pawn = this.findPawnById(pawnId);
        var tile = this.findTileById(pawn.tileId);
        tile.removePawn(pawn);
        for (var i = 0; i < value; i++) {
            tile = this.findTileByNextTileNumber(tile.getTileNumber(), pawn.player);
        }
        tile.getPawns().push(pawn);
        pawn.tileId = tile.getId();
        pawn.tile = tile;
        (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
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
        //            reload(game,ctx)
        //         }
        //     })
        // })
    };
    Game.prototype.setEvents = function (type, values) {
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
    Game.prototype.checkIfAllPlayersHaveStartingTile = function () {
        var all = this.getPlayerTokens();
        var present = new Set();
        this.getTiles().forEach(function (tile) {
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
    Game.prototype.checkIfAllPlayersHaveFinishTile = function () {
        var all = this.getPlayerTokens();
        var present = new Set();
        this.getTiles().forEach(function (tile) {
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
    Game.prototype.checkIfPathFromStartToEndExists = function () {
    };
    Game.prototype.numberOfFinishingTilesPerToken = function () {
        var m = new Map();
        this.playerTokens.forEach(function (token) {
            m.set(token, 0);
        });
        this.tiles.forEach(function (tile) {
            tile.getIsEndingFor().forEach(function (token) {
                m.set(token, m.get(token) + 1);
            });
        });
        return m;
    };
    Game.prototype.numberOfPawnsPerPlayer = function () {
        var m = new Map();
        this.playerTokens.forEach(function (token) {
            m.set(token, 0);
        });
        this.pawns.forEach(function (pawn) {
            m.set(pawn.player, m.get(pawn.player) + 1);
        });
        return m;
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
    Game.prototype.getChoosenTile = function () {
        return this.choosenTile;
    };
    Game.prototype.setChoosenTile = function (newTile) {
        this.choosenTile = newTile;
    };
    Game.prototype.getIsMoving = function () {
        return this.isMoving;
    };
    Game.prototype.setIsMoving = function (is) {
        this.isMoving = is;
    };
    Game.prototype.getImage = function () {
        return this.image;
    };
    Game.prototype.setImage = function (newImage) {
        this.image = newImage;
    };
    Game.prototype.getPattern = function () {
        return this.pattern;
    };
    Game.prototype.setPattern = function (newPattern) {
        this.pattern = newPattern;
    };
    Game.prototype.setStartForPlayers = function (newStartForPlayers) {
        this.startForPlayers = newStartForPlayers;
    };
    Game.prototype.getStartForPlayers = function () {
        return this.startForPlayers;
    };
    Game.prototype.setEndForPlayers = function (newEndForPlayers) {
        this.endForPlayers = newEndForPlayers;
    };
    Game.prototype.getEndForPlayers = function () {
        return this.endForPlayers;
    };
    Game.prototype.setEnabledForPlayers = function (newEnabledForPlayers) {
        this.enabledForPlayers = newEnabledForPlayers;
    };
    Game.prototype.getEnabledForPlayers = function () {
        return this.enabledForPlayers;
    };
    Game.prototype.setCantBeEliminatedOnTile = function (newPlayers) {
        this.cantBeEliminatedOnTile = newPlayers;
    };
    Game.prototype.getCantBeEliminatedOnTile = function () {
        return this.cantBeEliminatedOnTile;
    };
    Game.prototype.getQuestionId = function () {
        return this.questionId;
    };
    Game.prototype.setQuestionId = function (newId) {
        this.questionId = newId;
    };
    Game.prototype.getSkip = function () {
        return this.skip;
    };
    Game.prototype.setSkip = function (newSkip) {
        this.skip = newSkip;
    };
    Game.prototype.getRepeat = function () {
        return this.repeat;
    };
    Game.prototype.setRepeat = function (newRepeat) {
        this.repeat = newRepeat;
    };
    Game.prototype.getForward = function () {
        return this.forward;
    };
    Game.prototype.setForward = function (newForward) {
        this.forward = newForward;
    };
    Game.prototype.getBackward = function () {
        return this.backward;
    };
    Game.prototype.setBackward = function (newBackward) {
        this.backward = newBackward;
    };
    Game.prototype.getNextTileId = function () {
        return this.nextTileId;
    };
    Game.prototype.setNextTileId = function (newId) {
        this.nextTileId = newId;
    };
    Game.prototype.getMustThrown = function () {
        return this.mustThrown;
    };
    Game.prototype.setMustThrown = function (newThrown) {
        this.mustThrown = newThrown;
    };
    Game.prototype.getTurnsToSetFree = function () {
        return this.turnToSetFree;
    };
    Game.prototype.setTurnsToSetFree = function (newTurns) {
        this.turnToSetFree = newTurns;
    };
    Game.prototype.setRandomQuestion = function (is) {
        this.randomQuestion = is;
    };
    Game.prototype.getRandomQuestion = function () {
        return this.randomQuestion;
    };
    return Game;
}());
exports.Game = Game;
