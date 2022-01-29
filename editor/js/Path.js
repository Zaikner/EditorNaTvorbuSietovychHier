"use strict";
exports.__esModule = true;
exports.Path = void 0;
var Path = /** @class */ (function () {
    function Path() {
        this.path = [];
        this.type = '';
        this.tilesNumber = 0;
        this.length = 0;
        this.toggle = true;
    }
    Path.prototype.add = function (newPoint) {
        this.path.push(newPoint);
    };
    Path.prototype.makeLastPointEnding = function () {
        this.path[this.path.length - 1].setEnd(true);
    };
    Path.prototype.setType = function (type) {
        this.type = type;
    };
    Path.prototype.getType = function () {
        return (this.type);
    };
    Path.prototype.getPath = function () {
        return this.path;
    };
    Path.prototype.setPath = function (newPath) {
        this.path = newPath;
    };
    return Path;
}());
exports.Path = Path;
