"use strict";
exports.__esModule = true;
exports.Tile = void 0;
var Canvas_js_1 = require("./Canvas.js");
var ClientSocket_js_1 = require("./ClientSocket.js");
var PawnEditor_js_1 = require("./PawnEditor.js");
var UtilityFunctions_js_1 = require("./UtilityFunctions.js");
var Tile = /** @class */ (function () {
    function Tile(centerX, centerY, x1, x2, y1, y2, radius, color, tileNumber) {
        this.id = 0;
        this.color = "";
        this.stroke = 0;
        this.strokeColor = '';
        this.shape = 'circle';
        this.isChoosen = false;
        this.image = undefined;
        this.isEndingFor = [];
        this.isStartingFor = [];
        this.cantBeEliminatedOnTile = [];
        this.pawns = [];
        this.questionId = -1;
        this.skip = 0;
        this.repeat = 0;
        this.forward = 0;
        this.backward = 0;
        this.mustThrown = 0;
        this.nextTilesIds = new Map();
        this.randomQuestion = false;
        this.centerX = centerX / Canvas_js_1.game.getScaleX();
        this.centerY = centerY / Canvas_js_1.game.getScaleY();
        this.x1 = x1 / Canvas_js_1.game.getScaleX();
        this.x2 = x2 / Canvas_js_1.game.getScaleX();
        this.y1 = y1 / Canvas_js_1.game.getScaleY();
        this.y2 = y2 / Canvas_js_1.game.getScaleY();
        this.color = color;
        this.radius = radius;
        this.tileNumber = tileNumber;
    }
    Tile.prototype.drawTile = function (canvas, ctx) {
        ctx.beginPath();
        //obrazec bez outline -- nuluje
        if (this.image == undefined) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0;
            ctx.fillStyle = this.color;
            ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
            if (this.shape == 'circle') {
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
            }
            else if (this.shape == 'square') {
                ctx.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
            }
            ctx.resetTransform();
            ctx.fill();
        }
        else if (this.image != undefined) {
            // //kresli image
            if (this.shape == 'circle') {
                ctx.save();
                ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
                var clipPath = new Path2D();
                clipPath.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black';
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.drawImage(this.image, this.x1, this.y1, 2 * this.radius, 2 * this.radius);
                ctx.resetTransform();
                ctx.restore();
            }
            else {
                ctx.save();
                ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
                var clipPath = new Path2D();
                clipPath.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black';
                ctx.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
                ctx.stroke();
                ctx.drawImage(this.image, this.x1, this.y1, 2 * this.radius, 2 * this.radius);
                ctx.resetTransform();
                ctx.restore();
            }
        }
        //outline
        ctx.resetTransform();
        ctx.restore();
        if (this.stroke > 0) {
            ctx.resetTransform();
            ctx.restore();
            ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.stroke;
            ctx.stroke();
        }
        // ak je vybrany
        if (this.isChoosen && ClientSocket_js_1.isEditor) {
            if (this.shape == 'circle') {
                ctx.resetTransform();
                ctx.restore();
                ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
                var grd = ctx.createRadialGradient(this.centerX, this.centerY, this.radius, this.centerX, this.centerY, this.radius + 8);
                grd.addColorStop(0, "red");
                grd.addColorStop(0.33, '#990000');
                grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = 15;
                ctx.strokeStyle = grd;
                ctx.stroke();
                ctx.resetTransform();
            }
            else {
                ctx.resetTransform();
                ctx.restore();
                ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
                var grd = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
                grd.addColorStop(0, "red");
                grd.addColorStop(0.33, '#990000');
                grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = 15;
                ctx.strokeStyle = grd;
                ctx.stroke();
                ctx.resetTransform();
            }
        }
        if ((Canvas_js_1.game.getToogleNumber() || ClientSocket_js_1.isEditor) && Canvas_js_1.game.getChoosenTile() != this) {
            ctx.resetTransform();
            ctx.save();
            ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
            ctx.font = "bold 30px Arial";
            if (this.strokeColor != this.color) {
                ctx.fillStyle = this.strokeColor;
            }
            else if (this.strokeColor != '#000000') {
                ctx.fillStyle = '#000000';
            }
            else {
                ctx.fillStyle = '#FFFFFF';
            }
            ctx.textBaseline = 'middle';
            if (this.tileNumber < 10) {
                ctx.fillText(this.tileNumber.toString(), (this.x1 + this.x2) / 2 - 8, (this.y1 + this.y2) / 2);
            }
            else {
                ctx.fillText(this.tileNumber.toString(), (this.x1 + this.x2) / 2 - 15, (this.y1 + this.y2) / 2);
            }
            ctx.resetTransform();
            ctx.restore();
            ctx.resetTransform();
        }
        ctx.closePath();
        ctx.resetTransform();
    };
    Tile.prototype.drawPawns = function (ctx) {
        var _this = this;
        var num = 0;
        var drawn = 0;
        var diff = 0;
        if (this.pawns.length == 1) {
            diff = 30 * this.radius / 50;
        }
        if (this.pawns.length == 2) {
            diff = 20 * this.radius / 50;
        }
        var diffY = 10;
        ctx.resetTransform();
        ctx.restore();
        ctx.beginPath();
        ctx.closePath();
        ctx.scale(Canvas_js_1.game.getScaleX(), Canvas_js_1.game.getScaleY());
        Canvas_js_1.game.getPlayerTokens().forEach(function (player) {
            drawn = 0;
            _this.pawns.forEach(function (pawn) {
                if (pawn.player == player) {
                    num++;
                    var style = Canvas_js_1.game.getPawnStyle().get(pawn.player);
                    if (_this.pawns.length == 2 && num == 2) {
                        diff = 30 * _this.radius / 50;
                    }
                    if (num == 9) {
                        diff = 15 * _this.radius / 50;
                        diffY = 40;
                    }
                    else if (num == 13) {
                        diff = 15 * _this.radius / 50;
                        diffY = -20;
                    }
                    if (_this.pawns.length == 1) {
                        if ((style === null || style === void 0 ? void 0 : style.getImage()) != undefined) {
                            (0, PawnEditor_js_1.drawPawnImage)(ctx, _this.getCenterX(), _this.getCenterY() - 20 * _this.radius / 50 + diffY * _this.radius / 50, 6 * _this.radius / 50 + 2 * 9 / 2 * _this.radius / 50, style === null || style === void 0 ? void 0 : style.getImage());
                        }
                        else {
                            (0, PawnEditor_js_1.drawnPawnTypes)(ctx, _this.getCenterX(), _this.getCenterY() - 20 * _this.radius / 50 + diffY * _this.radius / 50, 6 * _this.radius / 50 + 2 * 9 / 2 * _this.radius / 50, style.getColor(), style.getType());
                        }
                    }
                    else {
                        if ((style === null || style === void 0 ? void 0 : style.getImage()) != undefined) {
                            (0, PawnEditor_js_1.drawPawnImage)(ctx, _this.getCenterX() - _this.radius + 20 * _this.radius / 50 + drawn * 10 * _this.radius / 50 + diff, _this.getCenterY() - 20 * _this.radius / 50 + diffY * _this.radius / 50, 6 * _this.radius / 50 + 2 * 9 / _this.pawns.length * _this.radius / 50, style.getImage());
                        }
                        else {
                            (0, PawnEditor_js_1.drawnPawnTypes)(ctx, _this.getCenterX() - _this.radius + 20 * _this.radius / 50 + drawn * 10 * _this.radius / 50 + diff, _this.getCenterY() - 20 * _this.radius / 50 + diffY * _this.radius / 50, 6 * _this.radius / 50 + 2 * 9 / _this.pawns.length * _this.radius / 50, style.getColor(), style.getType());
                        }
                    }
                    drawn++;
                }
            });
            diff = diff + (drawn * 10 * _this.radius / 50);
        });
        ctx.resetTransform();
        ctx.restore();
    };
    Tile.prototype.isPointedAt = function (x, y) {
        if (this.shape == 'circle') {
            if (Math.sqrt(Math.pow((this.centerX * Canvas_js_1.game.getScaleX() - x), 2) + Math.pow((this.centerY * Canvas_js_1.game.getScaleY() - y), 2)) <= this.radius) {
                return true;
            }
        }
        if (this.shape == 'square') {
            if (this.x1 * Canvas_js_1.game.getScaleX() <= x && x <= this.x2 * Canvas_js_1.game.getScaleX() && this.y1 * Canvas_js_1.game.getScaleY() <= y && y <= this.y2 * Canvas_js_1.game.getScaleY()) {
                return true;
            }
        }
        return false;
    };
    Tile.prototype.JSONfyTile = function () {
        return {
            centerX: Math.floor(this.centerX),
            centerY: Math.floor(this.centerY),
            x1: Math.floor(this.x1),
            x2: Math.floor(this.x2),
            y1: Math.floor(this.y1),
            y2: Math.floor(this.y2),
            radius: this.radius,
            color: this.color,
            stroke: this.stroke,
            strokeColor: this.strokeColor,
            shape: this.shape,
            image: this.image === undefined ? 'none' : (0, UtilityFunctions_js_1.getDataUrlFromImage)(this.image),
            tileNumber: this.tileNumber,
            isEndingFor: this.isEndingFor,
            isStartingFor: this.isStartingFor,
            questionId: this.questionId,
            cantBeEliminatedOnTile: this.cantBeEliminatedOnTile,
            skip: this.skip,
            repeat: this.repeat,
            forward: this.forward,
            backward: this.backward,
            mustThrown: this.mustThrown,
            randomQuestion: this.randomQuestion,
            nextTilesIds: this.mapNextTiles(),
            id: this.id
        };
    };
    Tile.prototype.removePawn = function (pawn) {
        this.pawns = this.pawns.filter(function (p) { return p != pawn; });
    };
    Tile.prototype.havePawnOnTile = function (player) {
        var ret = undefined;
        this.pawns.forEach(function (pawn) {
            if (pawn.player == player) {
                ret = pawn;
            }
        });
        return ret;
    };
    Tile.prototype.isSuccessfullyEnding = function (token) {
        var _this = this;
        var ret = false;
        if (!this.isEndingFor.includes(token)) {
            return true;
        }
        this.pawns.forEach(function (pawn) {
            if (_this.isEndingFor.includes(token) && pawn.player == token) {
                ret = true;
            }
        });
        return ret;
    };
    Tile.prototype.mapNextTiles = function () {
        var ret = [];
        Array.from(this.nextTilesIds.entries()).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            ret.push(key);
            ret.push(value.toString());
        });
        return ret;
    };
    Tile.prototype.setStroke = function (newStroke) {
        this.stroke = newStroke;
    };
    Tile.prototype.getStroke = function () {
        return this.stroke;
    };
    Tile.prototype.setStrokeColor = function (newStrokeColor) {
        this.strokeColor = newStrokeColor;
    };
    Tile.prototype.getStrokeColor = function () {
        return this.strokeColor;
    };
    Tile.prototype.setShape = function (newShape) {
        this.shape = newShape;
    };
    Tile.prototype.getShape = function () {
        return this.shape;
    };
    Tile.prototype.setIsChoosen = function (isChosen) {
        this.isChoosen = isChosen;
    };
    Tile.prototype.getIsChoosen = function () {
        return this.isChoosen;
    };
    Tile.prototype.setX1 = function (newX1) {
        this.x1 = newX1;
    };
    Tile.prototype.getX1 = function () {
        return this.x1;
    };
    Tile.prototype.setX2 = function (newX2) {
        this.x2 = newX2;
    };
    Tile.prototype.getX2 = function () {
        return this.x2;
    };
    Tile.prototype.setY1 = function (newY1) {
        this.y1 = newY1;
    };
    Tile.prototype.getY1 = function () {
        return this.y1;
    };
    Tile.prototype.setY2 = function (newY2) {
        this.y2 = newY2;
    };
    Tile.prototype.getY2 = function () {
        return this.y2;
    };
    Tile.prototype.setCenterX = function (newCenterX) {
        this.centerX = newCenterX;
    };
    Tile.prototype.getCenterX = function () {
        return this.centerX;
    };
    Tile.prototype.setCenterY = function (newCenterY) {
        this.centerY = newCenterY;
    };
    Tile.prototype.getCenterY = function () {
        return this.centerY;
    };
    Tile.prototype.setRadius = function (newRadius) {
        this.radius = newRadius;
    };
    Tile.prototype.getRadius = function () {
        return this.radius;
    };
    Tile.prototype.setId = function (newId) {
        this.id = newId;
    };
    Tile.prototype.getId = function () {
        return this.id;
    };
    Tile.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    Tile.prototype.getColor = function () {
        return this.color;
    };
    Tile.prototype.getImage = function () {
        return this.image;
    };
    Tile.prototype.setImage = function (newFile) {
        this.image = newFile;
    };
    Tile.prototype.setIsEndingFor = function (newPlayers) {
        this.isEndingFor = newPlayers;
    };
    Tile.prototype.getIsStartingFor = function () {
        return this.isStartingFor;
    };
    Tile.prototype.setIsStartingFor = function (newPlayers) {
        this.isStartingFor = newPlayers;
    };
    Tile.prototype.getIsEndingFor = function () {
        return this.isEndingFor;
    };
    Tile.prototype.getTileNumber = function () {
        return this.tileNumber;
    };
    Tile.prototype.setTileNumber = function (newNumber) {
        this.tileNumber = newNumber;
    };
    Tile.prototype.setQuestionId = function (newId) {
        this.questionId = newId;
    };
    Tile.prototype.getQuestionId = function () {
        return this.questionId;
    };
    Tile.prototype.setPawns = function (newPawns) {
        this.pawns = newPawns;
    };
    Tile.prototype.getPawns = function () {
        return this.pawns;
    };
    Tile.prototype.setCantBeEliminatedOnTile = function (newPlayers) {
        this.cantBeEliminatedOnTile = newPlayers;
    };
    Tile.prototype.getCantBeEliminatedOnTile = function () {
        return this.cantBeEliminatedOnTile;
    };
    Tile.prototype.getSkip = function () {
        return this.skip;
    };
    Tile.prototype.setSkip = function (newSkip) {
        this.skip = newSkip;
    };
    Tile.prototype.getRepeat = function () {
        return this.repeat;
    };
    Tile.prototype.setRepeat = function (newRepeat) {
        this.repeat = newRepeat;
    };
    Tile.prototype.getForward = function () {
        return this.forward;
    };
    Tile.prototype.setForward = function (newForward) {
        this.forward = newForward;
    };
    Tile.prototype.getBackward = function () {
        return this.backward;
    };
    Tile.prototype.setBackward = function (newBackward) {
        this.backward = newBackward;
    };
    Tile.prototype.getMustThrown = function () {
        return this.mustThrown;
    };
    Tile.prototype.setMustThrown = function (newThrown) {
        this.mustThrown = newThrown;
    };
    Tile.prototype.setNextTilesIds = function (newIds) {
        this.nextTilesIds = newIds;
    };
    Tile.prototype.getNextTilesIds = function () {
        return this.nextTilesIds;
    };
    Tile.prototype.setRandomQuestion = function (is) {
        this.randomQuestion = is;
    };
    Tile.prototype.getRandomQuestion = function () {
        return this.randomQuestion;
    };
    return Tile;
}());
exports.Tile = Tile;
