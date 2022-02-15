"use strict";
exports.__esModule = true;
exports.Tile = void 0;
var Tile = /** @class */ (function () {
    function Tile(type, centerX, centerY, x1, x2, y1, y2, radius, color, tileNumber) {
        this.isOccupied = false;
        this.color = "";
        this.stroke = 0;
        this.strokeColor = '';
        this.shape = 'circle';
        this.isChoosen = false;
        this.backgroundFile = undefined;
        this.patternFile = undefined;
        this.isEnding = false;
        this.isEndingFor = [];
        this.isStarting = false;
        this.isStartingFor = [];
        this.belongTo = '';
        this.canOccupy = [];
        this.toggleNumber = true;
        this.numberingColor = 'white';
        this.type = type;
        this.centerX = centerX;
        this.centerY = centerY;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.radius = radius;
        this.tileNumber = tileNumber;
        this.numberOfFollowingTile = tileNumber + 1;
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
                this.backgroundFile.src = 'data:image/jpeg;base64,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';
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
        if (this.toggleNumber) {
            ctx.font = "bold 30px Arial";
            ctx.fillStyle = this.numberingColor;
            ctx.textBaseline = 'middle';
            ctx.fillText(this.tileNumber.toString(), this.centerX - 8, this.centerY);
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
    Tile.prototype.JSONfyTile = function () {
        return { type: this.type,
            centerX: this.centerX,
            centerY: this.centerY,
            x1: this.x1,
            x2: this.x2,
            y1: this.y1,
            y2: this.y2,
            radius: this.radius,
            isOccupied: this.isOccupied,
            color: this.color,
            stroke: this.stroke,
            strokeColor: this.strokeColor,
            shape: this.shape,
            backgroundFile: this.backgroundFile,
            patternFile: this.patternFile,
            tileNumber: this.tileNumber,
            isEnding: this.isEnding,
            isEndingFor: this.isEndingFor,
            isStarting: this.isStarting,
            isStartingFor: this.isStartingFor,
            belongTo: this.belongTo,
            canOccupy: this.canOccupy,
            toggleNumber: this.toggleNumber,
            numberingColor: this.numberingColor,
            numberOfFollowingTile: this.numberOfFollowingTile };
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
    Tile.prototype.setIsEnding = function (is) {
        this.isEnding = is;
    };
    Tile.prototype.getIsEnding = function () {
        return this.isEnding;
    };
    Tile.prototype.setIsStarting = function (is) {
        this.isStarting = is;
    };
    Tile.prototype.getIsStarting = function () {
        return this.isStarting;
    };
    Tile.prototype.setBelongTo = function (newOwner) {
        this.belongTo = newOwner;
    };
    Tile.prototype.getBelongTo = function () {
        return this.belongTo;
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
    Tile.prototype.setCanOccupy = function (newPlayers) {
        this.canOccupy = newPlayers;
    };
    Tile.prototype.getCanOccupy = function () {
        return this.canOccupy;
    };
    Tile.prototype.setToogleNumber = function (is) {
        this.toggleNumber = is;
    };
    Tile.prototype.getToggleNumber = function () {
        return this.toggleNumber;
    };
    Tile.prototype.setNumberingColor = function (color) {
        this.numberingColor = color;
    };
    Tile.prototype.getNumberingColor = function () {
        return this.numberingColor;
    };
    Tile.prototype.getTileNumber = function () {
        return this.tileNumber;
    };
    Tile.prototype.setTileNumber = function (newNumber) {
        this.tileNumber = newNumber;
    };
    Tile.prototype.getFollowingTileNumber = function () {
        return this.numberOfFollowingTile;
    };
    Tile.prototype.setFollowingTileNumber = function (newNumber) {
        this.numberOfFollowingTile = newNumber;
    };
    return Tile;
}());
exports.Tile = Tile;
