"use strict";
exports.__esModule = true;
exports.Tile_db = void 0;
var DbConnect_1 = require("../DbConnect");
var Tile_db = /** @class */ (function () {
    function Tile_db() {
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
    Tile_db.prototype.setStroke = function (newStroke) {
        this.stroke = newStroke;
    };
    Tile_db.prototype.getStroke = function () {
        return this.stroke;
    };
    Tile_db.prototype.setStrokeColor = function (newStrokeColor) {
        this.strokeColor = newStrokeColor;
    };
    Tile_db.prototype.getStrokeColor = function () {
        return this.strokeColor;
    };
    Tile_db.prototype.setShape = function (newShape) {
        this.shape = newShape;
    };
    Tile_db.prototype.getShape = function () {
        return this.shape;
    };
    Tile_db.prototype.setIsChoosen = function (isChosen) {
        this.isChoosen = isChosen;
    };
    Tile_db.prototype.getIsChoosen = function () {
        return this.isChoosen;
    };
    Tile_db.prototype.setType = function (newType) {
        this.type = newType;
    };
    Tile_db.prototype.getType = function () {
        return this.type;
    };
    Tile_db.prototype.setX1 = function (newX1) {
        this.x1 = newX1;
    };
    Tile_db.prototype.getX1 = function () {
        return this.x1;
    };
    Tile_db.prototype.setX2 = function (newX2) {
        this.x2 = newX2;
    };
    Tile_db.prototype.getX2 = function () {
        return this.x2;
    };
    Tile_db.prototype.setY1 = function (newY1) {
        this.y1 = newY1;
    };
    Tile_db.prototype.getY1 = function () {
        return this.y1;
    };
    Tile_db.prototype.setY2 = function (newY2) {
        this.y2 = newY2;
    };
    Tile_db.prototype.getY2 = function () {
        return this.y2;
    };
    Tile_db.prototype.setCenterX = function (newCenterX) {
        this.centerX = newCenterX;
    };
    Tile_db.prototype.getCenterX = function () {
        return this.centerX;
    };
    Tile_db.prototype.setCenterY = function (newCenterY) {
        this.centerY = newCenterY;
    };
    Tile_db.prototype.getCenterY = function () {
        return this.centerY;
    };
    Tile_db.prototype.setRadius = function (newRadius) {
        this.radius = newRadius;
    };
    Tile_db.prototype.getRadius = function () {
        return this.radius;
    };
    Tile_db.prototype.setIsOccupied = function (newIsOccupied) {
        this.isOccupied = newIsOccupied;
    };
    Tile_db.prototype.getIsOccupied = function () {
        return this.isOccupied;
    };
    Tile_db.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    Tile_db.prototype.getColor = function () {
        return this.color;
    };
    Tile_db.prototype.getBackgroundFile = function () {
        return this.backgroundFile;
    };
    Tile_db.prototype.setBackgroundFile = function (newFile) {
        this.backgroundFile = newFile;
    };
    Tile_db.prototype.getPatternFile = function () {
        return this.patternFile;
    };
    Tile_db.prototype.setPatternFile = function (newFile) {
        this.patternFile = newFile;
    };
    Tile_db.prototype.setIsEnding = function (is) {
        this.isEnding = is;
    };
    Tile_db.prototype.getIsEnding = function () {
        return this.isEnding;
    };
    Tile_db.prototype.setIsStarting = function (is) {
        this.isStarting = is;
    };
    Tile_db.prototype.getIsStarting = function () {
        return this.isStarting;
    };
    Tile_db.prototype.setBelongTo = function (newOwner) {
        this.belongTo = newOwner;
    };
    Tile_db.prototype.getBelongTo = function () {
        return this.belongTo;
    };
    Tile_db.prototype.setIsEndingFor = function (newPlayers) {
        this.isEndingFor = newPlayers;
    };
    Tile_db.prototype.getIsStartingFor = function () {
        return this.isStartingFor;
    };
    Tile_db.prototype.setIsStartingFor = function (newPlayers) {
        this.isStartingFor = newPlayers;
    };
    Tile_db.prototype.getIsEndingFor = function () {
        return this.isEndingFor;
    };
    Tile_db.prototype.setCanOccupy = function (newPlayers) {
        this.canOccupy = newPlayers;
    };
    Tile_db.prototype.getCanOccupy = function () {
        return this.canOccupy;
    };
    Tile_db.prototype.setToogleNumber = function (is) {
        this.toggleNumber = is;
    };
    Tile_db.prototype.getToggleNumber = function () {
        return this.toggleNumber;
    };
    Tile_db.prototype.setNumberingColor = function (color) {
        this.numberingColor = color;
    };
    Tile_db.prototype.getNumberingColor = function () {
        return this.numberingColor;
    };
    Tile_db.prototype.getTileNumber = function () {
        return this.tileNumber;
    };
    Tile_db.prototype.setTileNumber = function (newNumber) {
        this.tileNumber = newNumber;
    };
    Tile_db.prototype.getFollowingTileNumber = function () {
        return this.numberOfFollowingTile;
    };
    Tile_db.prototype.setFollowingTileNumber = function (newNumber) {
        this.numberOfFollowingTile = newNumber;
    };
    Tile_db.prototype.getId = function () {
        return this.id;
    };
    Tile_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    Tile_db.prototype.getGameName = function () {
        return this.gameName;
    };
    Tile_db.prototype.setGameName = function (newName) {
        this.gameName = newName;
    };
    Tile_db.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-tile',
            text: 'INSERT INTO "bachelorsThesis"."Tile"(id,type,"centerX","centerY",x1,x2,y1,y2,radius,"isOccupied",color,stroke,"strokeColor",shape,"isChoosen","backgroundFile","patternFile","tileNumber","isEnding","isEndingFor","isStarting","isStartingFor","belongTo","canOccupy","toggleNumber","numberingColor","numberOfFollowingTile","gameName") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28);',
            values: [this.id, this.type, this.centerX, this.centerY, this.x1, this.x2, this.y1, this.y2, this.radius, this.isOccupied, this.color, this.stroke, this.strokeColor, this.shape, this.isChoosen, this.backgroundFile, this.patternFile, this.tileNumber, this.isEnding, this.isEndingFor, this.isStarting, this.isStartingFor, this.belongTo, this.canOccupy, this.toggleNumber, this.numberingColor, this.numberOfFollowingTile, this.gameName]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    Tile_db.load = function (data) {
        var ret = new Tile_db();
        ret.setId(data.id);
        ret.setType(data.type);
        ret.setCenterX(data.centerX);
        ret.setCenterY(data.centerY);
        ret.setX1(data.x1);
        ret.setX2(data.x2);
        ret.setY1(data.y1);
        ret.setY2(data.y2);
        ret.setRadius(data.radius);
        ret.setIsOccupied(data.isOccupied);
        ret.setColor(data.color);
        ret.setStroke(data.stroke);
        ret.setStrokeColor(data.strokeColor);
        ret.setShape(data.shape);
        ret.setIsChoosen(data.isChoosen);
        ret.setBackgroundFile(data.backgroundFile);
        ret.setPatternFile(data.patternFile);
        ret.setTileNumber(data.tileNumber);
        ret.setIsEnding(data.isEnding);
        ret.setIsEndingFor(data.isEndingFor);
        ret.setIsStarting(data.isStarting);
        ret.setIsStartingFor(data.isStartingFor);
        ret.setBelongTo(data.belongTo);
        ret.setCanOccupy(data.canOccupy);
        ret.setToogleNumber(data.toggleNumber);
        ret.setNumberingColor(data.numberingColor);
        ret.setFollowingTileNumber(data.numberOfFollowingTile);
        ret.setGameName(data.gameName);
        return ret;
    };
    return Tile_db;
}());
exports.Tile_db = Tile_db;
