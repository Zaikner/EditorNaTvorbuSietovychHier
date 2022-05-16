"use strict";
exports.__esModule = true;
exports.Background = void 0;
var BackgroundComponent_1 = require("./BackgroundComponent");
var BackgroundEditor_1 = require("./BackgroundEditor");
var canvas_1 = require("./canvas");
var utilityFunctions_1 = require("./utilityFunctions");
var Background = /** @class */ (function () {
    function Background() {
        this.backgroundImage = undefined;
        this.color = 'wheat';
        this.nextComponentImage = undefined;
        this.components = [];
        this.choosenComponent = undefined;
        this.undoLog = [];
        this.isMoving = false;
    }
    Background.prototype.draw = function () {
        // ctx.resetTransform();
        // ctx.restore()
        // ctx.beginPath()
        // ctx.closePath()
        // ctx.scale(game.getScaleX(),game.getScaleY())
        if (this.backgroundImage != undefined) {
            canvas_1.ctx.drawImage(this.backgroundImage, 0, 0, canvas_1.canvas.width, canvas_1.canvas.height - 40);
        }
        else {
            canvas_1.ctx.beginPath();
            canvas_1.ctx.fillStyle = this.color;
            canvas_1.ctx.fillRect(0, 0, canvas_1.canvas.width, canvas_1.canvas.height);
        }
        this.components.forEach(function (component) {
            component.draw(canvas_1.ctx);
        });
        // ctx.resetTransform();
        // ctx.restore()
    };
    Background.prototype.createComponent = function (event, type, radius, color, stroke, strokeColor, image, imageWidth, imageHeigth) {
        if (image === void 0) { image = undefined; }
        if (imageWidth === void 0) { imageWidth = 0; }
        if (imageHeigth === void 0) { imageHeigth = 0; }
        var coords = (0, canvas_1.calibreEventCoords)(event);
        var newComponent = new BackgroundComponent_1.BackgroundComponent();
        newComponent.setType(type);
        newComponent.setColor(color);
        newComponent.setImage(image);
        newComponent.setImageHeight(imageHeigth);
        newComponent.setImageWidth(imageWidth);
        newComponent.setCenterX(coords.x);
        newComponent.setCenterY(coords.y);
        newComponent.setRadius(radius);
        newComponent.setStroke(stroke);
        newComponent.setStrokeColor(strokeColor);
        if (type != 'image') {
            newComponent.setX1(coords.x - radius);
            newComponent.setY1(coords.y - radius);
            newComponent.setX2(coords.x + radius);
            newComponent.setY2(coords.y + radius);
        }
        else {
            newComponent.setX1(coords.x - imageWidth / 2);
            newComponent.setY1(coords.y - imageHeigth / 2);
            newComponent.setX2(coords.x + imageWidth / 2);
            newComponent.setY2(coords.y + imageHeigth / 2);
        }
        this.components.push(newComponent);
        this.undoLog.push(newComponent);
        return newComponent;
    };
    Background.prototype.deleteFromUndoLog = function () {
        if (this.undoLog.length > 0) {
            this.removeComponent(this.undoLog.pop());
        }
    };
    Background.prototype.removeComponent = function (removeComponent) {
        this.components = this.components.filter(function (c) { return c != removeComponent; });
    };
    Background.prototype["delete"] = function () {
        this.backgroundImage = undefined;
        this.color = 'wheat';
    };
    Background.prototype.deleteComponent = function (event) {
        var coords = (0, canvas_1.calibreEventCoords)(event);
        var rem = undefined;
        for (var i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].isPointedAt(coords.x, coords.y)) {
                rem = this.components[i];
            }
        }
        if (rem != undefined) {
            this.removeComponent(rem);
        }
    };
    Background.prototype.makeAllComponentsNotChoosen = function () {
        this.choosenComponent = undefined;
        this.components.forEach(function (c) {
            c.setIsChoosen(false);
        });
    };
    Background.prototype.findComponent = function (event, edit) {
        var coords = (0, canvas_1.calibreEventCoords)(event);
        for (var i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].isPointedAt(coords.x, coords.y)) {
                if (this.components[i] == this.choosenComponent) {
                    this.components[i].setIsChoosen(false);
                    this.choosenComponent = undefined;
                }
                else {
                    if (this.choosenComponent != undefined) {
                        this.choosenComponent.setIsChoosen(false);
                    }
                    this.components[i].setIsChoosen(true);
                    this.choosenComponent = this.components[i];
                    if (!this.isMoving && edit)
                        (0, BackgroundEditor_1.editComponent)();
                }
                break;
            }
        }
    };
    Background.prototype.moveComponent = function (event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        var coords = (0, canvas_1.calibreEventCoords)(event);
        (_a = this.choosenComponent) === null || _a === void 0 ? void 0 : _a.setCenterX(coords.x);
        (_b = this.choosenComponent) === null || _b === void 0 ? void 0 : _b.setCenterY(coords.y);
        (_c = this.choosenComponent) === null || _c === void 0 ? void 0 : _c.setX1(coords.x - ((_d = this.choosenComponent) === null || _d === void 0 ? void 0 : _d.getRadius()));
        (_e = this.choosenComponent) === null || _e === void 0 ? void 0 : _e.setX2(coords.x + ((_f = this.choosenComponent) === null || _f === void 0 ? void 0 : _f.getRadius()));
        (_g = this.choosenComponent) === null || _g === void 0 ? void 0 : _g.setY1(coords.y - ((_h = this.choosenComponent) === null || _h === void 0 ? void 0 : _h.getRadius()));
        (_j = this.choosenComponent) === null || _j === void 0 ? void 0 : _j.setY2(coords.y + ((_k = this.choosenComponent) === null || _k === void 0 ? void 0 : _k.getRadius()));
        if (((_l = this.choosenComponent) === null || _l === void 0 ? void 0 : _l.getType()) != 'image') {
            (_m = this.choosenComponent) === null || _m === void 0 ? void 0 : _m.setX1(coords.x - ((_o = this.choosenComponent) === null || _o === void 0 ? void 0 : _o.getRadius()));
            (_p = this.choosenComponent) === null || _p === void 0 ? void 0 : _p.setX2(coords.x + ((_q = this.choosenComponent) === null || _q === void 0 ? void 0 : _q.getRadius()));
            (_r = this.choosenComponent) === null || _r === void 0 ? void 0 : _r.setY1(coords.y - ((_s = this.choosenComponent) === null || _s === void 0 ? void 0 : _s.getRadius()));
            (_t = this.choosenComponent) === null || _t === void 0 ? void 0 : _t.setY2(coords.y + ((_u = this.choosenComponent) === null || _u === void 0 ? void 0 : _u.getRadius()));
        }
        else {
            (_v = this.choosenComponent) === null || _v === void 0 ? void 0 : _v.setX1(coords.x - ((_w = this.choosenComponent) === null || _w === void 0 ? void 0 : _w.getImageWidth()) / 2);
            (_x = this.choosenComponent) === null || _x === void 0 ? void 0 : _x.setX2(coords.x + ((_y = this.choosenComponent) === null || _y === void 0 ? void 0 : _y.getImageWidth()) / 2);
            (_z = this.choosenComponent) === null || _z === void 0 ? void 0 : _z.setY1(coords.y - ((_0 = this.choosenComponent) === null || _0 === void 0 ? void 0 : _0.getImageHeight()) / 2);
            (_1 = this.choosenComponent) === null || _1 === void 0 ? void 0 : _1.setY2(coords.y + ((_2 = this.choosenComponent) === null || _2 === void 0 ? void 0 : _2.getImageHeight()) / 2);
        }
    };
    Background.prototype.save = function () {
        var components = [];
        this.components.forEach(function (c) {
            components.push(c.save());
        });
        return {
            backgroundImage: this.getBackgroundImage() === undefined ? 'none' : (0, utilityFunctions_1.getDataUrlFromImage)(this.getBackgroundImage()),
            color: this.getColor(),
            components: components
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
    Background.prototype.getComponents = function () {
        return this.components;
    };
    Background.prototype.setComponents = function (newComponents) {
        this.components = newComponents;
    };
    Background.prototype.getChoosenComponent = function () {
        return this.choosenComponent;
    };
    Background.prototype.setChoosenComponent = function (newComponent) {
        this.choosenComponent = newComponent;
    };
    Background.prototype.getNextComponentImage = function () {
        return this.nextComponentImage;
    };
    Background.prototype.setNextComponentImage = function (newImage) {
        this.nextComponentImage = newImage;
    };
    Background.prototype.setUndoLog = function (newLog) {
        this.undoLog = newLog;
    };
    Background.prototype.getUndoLog = function () {
        return this.undoLog;
    };
    return Background;
}());
exports.Background = Background;
