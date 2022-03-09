"use strict";
exports.__esModule = true;
exports.Background = void 0;
var canvas_1 = require("./canvas");
var Background = /** @class */ (function () {
    function Background() {
        this.backgroundImage = undefined;
        this.color = 'wheat';
    }
    Background.prototype.draw = function () {
        console.log('spustil draw');
        if (this.backgroundImage != undefined) {
            canvas_1.ctx.drawImage(this.backgroundImage, 0, 0, canvas_1.canvas.width, canvas_1.canvas.height);
        }
        else {
            canvas_1.ctx.beginPath();
            canvas_1.ctx.fillStyle = this.color;
            canvas_1.ctx.fillRect(0, 0, canvas_1.canvas.width, canvas_1.canvas.height);
        }
    };
    Background.prototype["delete"] = function () {
        this.backgroundImage = undefined;
        this.color = 'wheat';
    };
    Background.prototype.setColor = function (newColor) {
        console.log('setol ' + this.color);
        this.color = newColor;
        console.log('setol ' + this.color);
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
