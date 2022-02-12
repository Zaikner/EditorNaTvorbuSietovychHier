"use strict";
exports.__esModule = true;
exports.Path = void 0;
var Path = /** @class */ (function () {
    function Path() {
        this.path = [];
        this.type = '';
    }
    Path.prototype.add = function (newPoint) {
        this.path.push(newPoint);
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
