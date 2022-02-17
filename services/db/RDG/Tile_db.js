"use strict";
exports.__esModule = true;
exports.Tile = void 0;
var DbConnect_1 = require("../DbConnect");
var Tile = /** @class */ (function () {
    function Tile() {
        this.id = 0;
        this.type = '';
        this.centerX = 0;
        this.centerY = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.radius = 0;
        this.isOccupied = false;
        this.color = "";
        this.stroke = 0;
        this.strokeColor = '';
        this.shape = 'circle';
        this.isChoosen = false;
        this.backgroundFile = '';
        this.patternFile = '';
        this.tileNumber = 0;
        this.isEnding = false;
        this.isEndingFor = [];
        this.isStarting = false;
        this.isStartingFor = [];
        this.belongTo = '';
        this.canOccupy = [];
        this.toggleNumber = true;
        this.numberingColor = 'white';
        this.numberOfFollowingTile = 0;
        this.gameName = '';
    }
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
    Tile.prototype.getId = function () {
        return this.id;
    };
    Tile.prototype.setId = function (newId) {
        this.id = newId;
    };
    Tile.prototype.getGameName = function () {
        return this.gameName;
    };
    Tile.prototype.setGameName = function (newName) {
        this.gameName = newName;
    };
    Tile.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-tile',
            text: 'INSERT INTO "bachelorsThesis"."Tile"(type,"centerX","centerY",x1,x2,y1,y2,radius,"isOccupied",color,stroke,"strokeColor",shape,"isChoosen","backgroundFile","patternFile","tileNumber","isEnding","isEndingFor","isStarting","isStartingFor","belongTo","canOccupy","toggleNumber","numberingColor","numberOfFollowingTile","gameName") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27);',
            values: [this.type, this.centerX, this.centerY, this.x1, this.x2, this.y1, this.y2, this.radius, this.isOccupied, this.color, this.stroke, this.strokeColor, this.shape, this.isChoosen, this.backgroundFile, this.patternFile, this.tileNumber, this.isEnding, this.isEndingFor, this.isStarting, this.isStartingFor, this.belongTo, this.canOccupy, this.toggleNumber, this.numberingColor, this.numberOfFollowingTile, this.gameName]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    return Tile;
}());
exports.Tile = Tile;
