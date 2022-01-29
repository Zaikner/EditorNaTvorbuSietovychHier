"use strict";
exports.__esModule = true;
exports.Point = void 0;
var Point = /** @class */ (function () {
    function Point(x, y, end) {
        this.x = x;
        this.y = y;
        this.end = end;
    }
    Point.prototype.isInRange = function (otherX, otherY, range) {
        return Math.sqrt(Math.pow((this.x - otherX), 2) + Math.pow((this.y - otherY), 2)) >= range;
    };
    Point.prototype.getX = function () {
        return this.x;
    };
    Point.prototype.getY = function () {
        return this.y;
    };
    Point.prototype.getEnd = function () {
        return this.end;
    };
    Point.prototype.setX = function (x) {
        this.x = x;
    };
    Point.prototype.setY = function (y) {
        this.y = y;
    };
    Point.prototype.setEnd = function (end) {
        this.end = end;
    };
    return Point;
}());
exports.Point = Point;
