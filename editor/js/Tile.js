"use strict";
exports.__esModule = true;
exports.Tile = void 0;
var Tile = /** @class */ (function () {
    function Tile(type, centerX, centerY, x1, x2, y1, y2, radius, color) {
        this.isOccupied = false;
        this.color = "";
        this.stroke = 0;
        this.strokeColor = '';
        this.shape = 'circle';
        this.isChoosen = false;
        this.backgroundFile = undefined;
        this.patternFile = undefined;
        this.type = type;
        this.centerX = centerX;
        this.centerY = centerY;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.radius = radius;
    }
    Tile.prototype.drawTile = function (canvas, ctx) {
        // kresli//
        ctx.beginPath();
        //obrazec bez outline -- nuluje
        if (this.backgroundFile == undefined && this.patternFile == undefined) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0;
            ctx.fillStyle = this.color;
            if (this.shape == 'circle') {
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
            }
            else if (this.shape == 'square') {
                ctx.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
            }
            ctx.fill();
        }
        else if (this.backgroundFile != undefined) {
            // //kresli image
            if (this.shape == 'circle') {
                ctx.save();
                var clipPath = new Path2D();
                clipPath.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black';
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                //ctx.fill()
                ctx.stroke();
                ctx.drawImage(this.backgroundFile, this.x1, this.y1, 2 * this.radius, 2 * this.radius);
                ctx.restore();
                //ctx.restore()
            }
            else {
                ctx.save();
                var clipPath = new Path2D();
                clipPath.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black';
                ctx.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
                //ctx.fill()
                ctx.stroke();
                ctx.drawImage(this.backgroundFile, this.x1, this.y1, 2 * this.radius, 2 * this.radius);
                ctx.restore();
            }
        }
        else if (this.patternFile != undefined) {
            if (this.shape == 'circle') {
                ctx.save();
                var clipPath = new Path2D();
                clipPath.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black';
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                //ctx.fill()
                ctx.stroke();
                for (var i = 0; i * 20 + this.x1 < this.x2; i++) {
                    for (var j = 0; j * 20 + this.y1 < this.y2; j++) {
                        ctx.drawImage(this.patternFile, this.x1 + i * 20, this.y1 + j * 20, 20, 20);
                    }
                }
                ctx.restore();
                //ctx.restore()
            }
            else {
                ctx.save();
                var clipPath = new Path2D();
                clipPath.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black';
                ctx.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
                //ctx.fill()
                ctx.stroke();
                for (var i = 0; i * 20 + this.x1 < this.x2; i++) {
                    for (var j = 0; j * 20 + this.y1 < this.y2; j++) {
                        ctx.drawImage(this.patternFile, this.x1 + i * 20, this.y1 + j * 20, 20, 20);
                    }
                }
                ctx.restore();
            }
        }
        //outline
        if (this.stroke > 0) {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.stroke;
            ctx.stroke();
        }
        // ak je vybrany
        if (this.isChoosen) {
            if (this.shape == 'circle') {
                // ctx.lineWidth = 10
                // ctx.strokeStyle = '#FF0000'
                // ctx.setLineDash([1]);
                // ctx.stroke()
                // ctx.setLineDash([0]);
                var grd = ctx.createRadialGradient(this.centerX, this.centerY, this.radius, this.centerX, this.centerY, this.radius + 8);
                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                grd.addColorStop(0.33, '#990000');
                grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = 15;
                ctx.strokeStyle = grd;
                ctx.stroke();
            }
            else {
                var grd = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                grd.addColorStop(0.33, '#990000');
                grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = 15;
                ctx.strokeStyle = grd;
                ctx.stroke();
            }
        }
    };
    Tile.prototype.isPointedAt = function (x, y) {
        if (this.shape == 'circle') {
            if (Math.sqrt(Math.pow((this.centerX - x), 2) + Math.pow((this.centerY - y), 2)) <= this.radius) {
                return true;
            }
        }
        if (this.shape == 'square') {
            if (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2) {
                return true;
            }
        }
        return false;
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
    Tile.prototype.setType = function (newType) {
        this.type = newType;
    };
    Tile.prototype.getType = function () {
        return this.type;
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
    Tile.prototype.setIsOccupied = function (newIsOccupied) {
        this.isOccupied = newIsOccupied;
    };
    Tile.prototype.getIsOccupied = function () {
        return this.isOccupied;
    };
    Tile.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    Tile.prototype.getColor = function () {
        return this.color;
    };
    Tile.prototype.getBackgroundFile = function () {
        return this.backgroundFile;
    };
    Tile.prototype.setBackgroundFile = function (newFile) {
        this.backgroundFile = newFile;
    };
    Tile.prototype.getPatternFile = function () {
        return this.patternFile;
    };
    Tile.prototype.setPatternFile = function (newFile) {
        this.patternFile = newFile;
    };
    return Tile;
}());
exports.Tile = Tile;
