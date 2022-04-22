"use strict";
exports.__esModule = true;
exports.BackgroundComponent_db = void 0;
var DbConnect_1 = require("../DbConnect");
var BackgroundComponent_db = /** @class */ (function () {
    function BackgroundComponent_db() {
        this.id = 0;
        this.gameName = '';
        this.image = '';
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
    }
    BackgroundComponent_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    BackgroundComponent_db.prototype.getId = function () {
        return this.id;
    };
    BackgroundComponent_db.prototype.setGameName = function (newName) {
        this.gameName = newName;
    };
    BackgroundComponent_db.prototype.getGameName = function () {
        return this.gameName;
    };
    BackgroundComponent_db.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    BackgroundComponent_db.prototype.getColor = function () {
        return this.color;
    };
    BackgroundComponent_db.prototype.getImage = function () {
        return this.image;
    };
    BackgroundComponent_db.prototype.setImage = function (newImage) {
        this.image = newImage;
    };
    BackgroundComponent_db.prototype.setType = function (newType) {
        this.type = newType;
    };
    BackgroundComponent_db.prototype.getType = function () {
        return this.type;
    };
    BackgroundComponent_db.prototype.setX1 = function (newX1) {
        this.x1 = newX1;
    };
    BackgroundComponent_db.prototype.getX1 = function () {
        return this.x1;
    };
    BackgroundComponent_db.prototype.setX2 = function (newX2) {
        this.x2 = newX2;
    };
    BackgroundComponent_db.prototype.getX2 = function () {
        return this.x2;
    };
    BackgroundComponent_db.prototype.setY1 = function (newY1) {
        this.y1 = newY1;
    };
    BackgroundComponent_db.prototype.getY1 = function () {
        return this.y1;
    };
    BackgroundComponent_db.prototype.setY2 = function (newY2) {
        this.y2 = newY2;
    };
    BackgroundComponent_db.prototype.getY2 = function () {
        return this.y2;
    };
    BackgroundComponent_db.prototype.setCenterX = function (newCenterX) {
        this.centerX = newCenterX;
    };
    BackgroundComponent_db.prototype.getCenterX = function () {
        return this.centerX;
    };
    BackgroundComponent_db.prototype.setCenterY = function (newCenterY) {
        this.centerY = newCenterY;
    };
    BackgroundComponent_db.prototype.getCenterY = function () {
        return this.centerY;
    };
    BackgroundComponent_db.prototype.setRadius = function (newRadius) {
        this.radius = newRadius;
    };
    BackgroundComponent_db.prototype.getRadius = function () {
        return this.radius;
    };
    BackgroundComponent_db.prototype.setStroke = function (newStroke) {
        this.stroke = newStroke;
    };
    BackgroundComponent_db.prototype.getStrokeColor = function () {
        return this.strokeColor;
    };
    BackgroundComponent_db.prototype.setStrokeColor = function (newStrokeColor) {
        this.strokeColor = newStrokeColor;
    };
    BackgroundComponent_db.prototype.getStroke = function () {
        return this.stroke;
    };
    BackgroundComponent_db.prototype.getImageWidth = function () {
        return this.imageWidth;
    };
    BackgroundComponent_db.prototype.setImageWidth = function (newWidth) {
        this.imageWidth = newWidth;
    };
    BackgroundComponent_db.prototype.getImageHeight = function () {
        return this.imageHeigth;
    };
    BackgroundComponent_db.prototype.setImageHeight = function (newHeight) {
        this.imageHeigth = newHeight;
    };
    BackgroundComponent_db.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-background-component',
            text: 'INSERT INTO "bachelorsThesis"."Background_component"(image,color,"gameName","strokeColor",stroke,type,"centerX","centerY",x1,x2,y1,y2,radius,"imageHeigth","imageWidth") Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);',
            values: [this.image, this.color, this.gameName, this.strokeColor, this.stroke, this.type, this.centerX, this.centerY, this.x1, this.x2, this.y1, this.y2, this.radius, this.imageHeigth, this.imageWidth]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    BackgroundComponent_db.load = function (data) {
        var ret = new BackgroundComponent_db();
        ret.setId(data.id);
        ret.setImage(data.image);
        ret.setColor(data.color);
        ret.setType(data.type);
        ret.setCenterX(data.centerX);
        ret.setCenterY(data.centerY);
        ret.setX1(data.x1);
        ret.setX2(data.x2);
        ret.setY1(data.y1);
        ret.setY2(data.y2);
        ret.setRadius(data.radius);
        ret.setGameName(data.gameName);
        ret.setStroke(data.stroke);
        ret.setStrokeColor(data.strokeColor);
        ret.setImageWidth(data.imageWidth);
        ret.setImageHeight(data.imageHeigth);
        return ret;
    };
    return BackgroundComponent_db;
}());
exports.BackgroundComponent_db = BackgroundComponent_db;
