"use strict";
exports.__esModule = true;
exports.BackgroundComponent = void 0;
var canvas_1 = require("./canvas");
var utilityFunctions_1 = require("./utilityFunctions");
var BackgroundComponent = /** @class */ (function () {
    function BackgroundComponent() {
        this.image = undefined;
        this.color = 'wheat';
        this.strokeColor = '';
        this.stroke = 0;
        this.type = '';
        this.centerX = 0;
        this.centerY = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.radius = 0;
        this.imageWidth = 0;
        this.imageHeigth = 0;
        this.isChoosen = false;
    }
    BackgroundComponent.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.save();
        if (this.type == 'circle' || this.type == 'square') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0;
            ctx.fillStyle = this.color;
            ctx.scale(canvas_1.editor.getGame().getScaleX(), canvas_1.editor.getGame().getScaleY());
            if (this.type == 'circle') {
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
            }
            else if (this.type == 'square') {
                ctx.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
            }
            ctx.resetTransform();
            ctx.fill();
            //ctx.restore()
        }
        else if (this.type == 'image' && this.image != undefined) {
            ctx.save();
            ctx.scale(canvas_1.editor.getGame().getScaleX(), canvas_1.editor.getGame().getScaleY());
            ctx.fillStyle = 'black';
            //ctx.fill()
            ctx.drawImage(this.image, this.centerX - this.imageWidth / 2, this.centerY - this.imageHeigth / 2, this.imageWidth, this.imageHeigth);
            ctx.resetTransform();
            //ctx.restore()
        }
        if (this.stroke > 0) {
            ctx.scale(canvas_1.editor.getGame().getScaleX(), canvas_1.editor.getGame().getScaleY());
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.stroke;
            ctx.stroke();
        }
        if (this.isChoosen) {
            if (this.type == 'circle') {
                // ctx.lineWidth = 10
                // ctx.strokeStyle = '#FF0000'
                // ctx.setLineDash([1]);
                // ctx.stroke()
                // ctx.setLineDash([0]);
                ctx.restore();
                var num = ctx.lineWidth;
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.scale(canvas_1.editor.getGame().getScaleX(), canvas_1.editor.getGame().getScaleY());
                var grd = ctx.createRadialGradient(this.centerX, this.centerY, this.radius, this.centerX, this.centerY, this.radius + 15);
                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                grd.addColorStop(0.33, '#990000');
                grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = this.stroke;
                ctx.strokeStyle = grd;
                ctx.stroke();
                ctx.resetTransform();
            }
            else if (this.type == 'squire') {
                ctx.scale(canvas_1.editor.getGame().getScaleX(), canvas_1.editor.getGame().getScaleY());
                ctx.rect(this.x1, this.y1, this.radius * 2, this.radius * 2);
                var grd = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                grd.addColorStop(0.33, '#990000');
                grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = this.stroke;
                ctx.strokeStyle = grd;
                ctx.stroke();
                ctx.resetTransform();
            }
            else if (this.type == 'image') {
                ctx.scale(canvas_1.editor.getGame().getScaleX(), canvas_1.editor.getGame().getScaleY());
                ctx.rect(this.x1, this.y1, this.imageWidth, this.imageWidth);
                var grd = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                grd.addColorStop(0.33, '#990000');
                grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = this.stroke;
                ctx.strokeStyle = grd;
                ctx.stroke();
                ctx.resetTransform();
            }
        }
        ctx.restore();
        ctx.resetTransform();
        ctx.closePath();
    };
    BackgroundComponent.prototype.isPointedAt = function (x, y) {
        if (this.type == 'circle') {
            if (Math.sqrt(Math.pow((this.centerX - x), 2) + Math.pow((this.centerY - y), 2)) <= this.radius + this.stroke) {
                return true;
            }
        }
        if (this.type == 'square' || this.type == 'image') {
            if (this.x1 - this.stroke <= x && x <= this.x2 + this.stroke && this.y1 - this.stroke <= y && y <= this.y2 + this.stroke) {
                return true;
            }
        }
        return false;
    };
    BackgroundComponent.prototype.save = function () {
        return {
            image: this.image === undefined ? 'none' : (0, utilityFunctions_1.getDataUrlFromImage)(this.image),
            color: this.color,
            strokeColor: this.strokeColor,
            stroke: this.stroke,
            type: this.type,
            centerX: this.centerX,
            centerY: this.centerY,
            x1: this.x1,
            x2: this.x2,
            y1: this.y1,
            y2: this.y2,
            radius: this.radius,
            imageHeigth: this.imageHeigth,
            imageWidth: this.imageWidth
        };
    };
    BackgroundComponent.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    BackgroundComponent.prototype.getColor = function () {
        return this.color;
    };
    BackgroundComponent.prototype.setStrokeColor = function (newColor) {
        this.strokeColor = newColor;
    };
    BackgroundComponent.prototype.getStrokeColor = function () {
        return this.strokeColor;
    };
    BackgroundComponent.prototype.getStroke = function () {
        return this.stroke;
    };
    BackgroundComponent.prototype.setStroke = function (newStroke) {
        this.stroke = newStroke;
    };
    BackgroundComponent.prototype.getImage = function () {
        return this.image;
    };
    BackgroundComponent.prototype.setImage = function (newImage) {
        this.image = newImage;
    };
    BackgroundComponent.prototype.getImageWidth = function () {
        return this.imageWidth;
    };
    BackgroundComponent.prototype.setImageWidth = function (newWidth) {
        this.imageWidth = newWidth;
    };
    BackgroundComponent.prototype.getImageHeight = function () {
        return this.imageHeigth;
    };
    BackgroundComponent.prototype.setImageHeight = function (newHeight) {
        this.imageHeigth = newHeight;
    };
    BackgroundComponent.prototype.setType = function (newType) {
        this.type = newType;
    };
    BackgroundComponent.prototype.getType = function () {
        return this.type;
    };
    BackgroundComponent.prototype.setX1 = function (newX1) {
        this.x1 = Math.floor(newX1);
    };
    BackgroundComponent.prototype.getX1 = function () {
        return this.x1;
    };
    BackgroundComponent.prototype.setX2 = function (newX2) {
        this.x2 = Math.floor(newX2);
    };
    BackgroundComponent.prototype.getX2 = function () {
        return this.x2;
    };
    BackgroundComponent.prototype.setY1 = function (newY1) {
        this.y1 = Math.floor(newY1);
    };
    BackgroundComponent.prototype.getY1 = function () {
        return this.y1;
    };
    BackgroundComponent.prototype.setY2 = function (newY2) {
        this.y2 = Math.floor(newY2);
    };
    BackgroundComponent.prototype.getY2 = function () {
        return this.y2;
    };
    BackgroundComponent.prototype.setCenterX = function (newCenterX) {
        this.centerX = Math.floor(newCenterX);
    };
    BackgroundComponent.prototype.getCenterX = function () {
        return this.centerX;
    };
    BackgroundComponent.prototype.setCenterY = function (newCenterY) {
        this.centerY = Math.floor(newCenterY);
    };
    BackgroundComponent.prototype.getCenterY = function () {
        return this.centerY;
    };
    BackgroundComponent.prototype.setRadius = function (newRadius) {
        this.radius = Math.floor(newRadius);
    };
    BackgroundComponent.prototype.getRadius = function () {
        return this.radius;
    };
    BackgroundComponent.prototype.setIsChoosen = function (is) {
        this.isChoosen = is;
    };
    BackgroundComponent.prototype.getIsChoosen = function () {
        return this.isChoosen;
    };
    return BackgroundComponent;
}());
exports.BackgroundComponent = BackgroundComponent;
