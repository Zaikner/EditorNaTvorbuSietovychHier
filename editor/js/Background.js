"use strict";
exports.__esModule = true;
exports.Background = void 0;
var Canvas_1 = require("./Canvas");
var UtilityFunctions_1 = require("./UtilityFunctions");
var Background = /** @class */ (function () {
    function Background() {
        this.backgroundImage = undefined;
        this.color = 'wheat';
    }
    Background.prototype.draw = function () {
        if (this.backgroundImage != undefined) {
            Canvas_1.ctx.drawImage(this.backgroundImage, 0, 0, Canvas_1.canvas.width, Canvas_1.canvas.height - 40);
        }
        else {
            Canvas_1.ctx.beginPath();
            Canvas_1.ctx.fillStyle = this.color;
            Canvas_1.ctx.fillRect(0, 0, Canvas_1.canvas.width, Canvas_1.canvas.height);
        }
    };
    Background.prototype.save = function () {
        return {
            backgroundImage: this.getBackgroundImage() === undefined ? 'none' : (0, UtilityFunctions_1.getDataUrlFromImage)(this.getBackgroundImage()),
            color: this.getColor()
        };
    };
    Background.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    Background.prototype.getColor = function () {
        return this.color;
    };
    Background.prototype.getBackgroundImage = function () {
        return this.backgroundImage;
    };
    Background.prototype.setBackgroundImage = function (newImage) {
        this.backgroundImage = newImage;
    };
    return Background;
}());
exports.Background = Background;
