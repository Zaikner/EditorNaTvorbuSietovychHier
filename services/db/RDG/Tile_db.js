"use strict";
exports.__esModule = true;
exports.Tile_db = void 0;
var DbConnect_1 = require("../DbConnect");
var Tile_db = /** @class */ (function () {
    function Tile_db() {
        this.id = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.radius = 0;
        this.color = "";
        this.stroke = 0;
        this.strokeColor = '';
        this.shape = 'circle';
        this.isChoosen = false;
        this.backgroundFile = '';
        this.tileNumber = 0;
        this.isEndingFor = [];
        this.isStartingFor = [];
        this.toggleNumber = true;
        this.numberOfFollowingTile = 0;
        this.gameName = '';
        this.questionId = -1;
        this.cantBeEliminatedOnTile = [];
        this.skip = 0;
        this.repeat = 0;
        this.forward = 0;
        this.backward = 0;
        this.mustThrown = 0;
        this.turnToSetFree = 0;
        this.nextTilesIds = [];
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
    Tile_db.prototype.setToogleNumber = function (is) {
        this.toggleNumber = is;
    };
    Tile_db.prototype.getToggleNumber = function () {
        return this.toggleNumber;
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
    Tile_db.prototype.getQuestionId = function () {
        return this.questionId;
    };
    Tile_db.prototype.setQuestionId = function (newID) {
        this.questionId = newID;
    };
    Tile_db.prototype.getGameName = function () {
        return this.gameName;
    };
    Tile_db.prototype.setGameName = function (newName) {
        this.gameName = newName;
    };
    Tile_db.prototype.setCantBeEliminatedOnTile = function (newPlayers) {
        this.cantBeEliminatedOnTile = newPlayers;
    };
    Tile_db.prototype.getCantBeEliminatedOnTile = function () {
        return this.cantBeEliminatedOnTile;
    };
    Tile_db.prototype.setNextTilesIds = function (newIds) {
        this.nextTilesIds = newIds;
    };
    Tile_db.prototype.getNextTilesIds = function () {
        return this.nextTilesIds;
    };
    Tile_db.prototype.getSkip = function () {
        return this.skip;
    };
    Tile_db.prototype.setSkip = function (newSkip) {
        this.skip = newSkip;
    };
    Tile_db.prototype.getRepeat = function () {
        return this.repeat;
    };
    Tile_db.prototype.setRepeat = function (newRepeat) {
        this.repeat = newRepeat;
    };
    Tile_db.prototype.getForward = function () {
        return this.forward;
    };
    Tile_db.prototype.setForward = function (newForward) {
        this.forward = newForward;
    };
    Tile_db.prototype.getBackward = function () {
        return this.backward;
    };
    Tile_db.prototype.setBackward = function (newBackward) {
        this.backward = newBackward;
    };
    Tile_db.prototype.getMustThrown = function () {
        return this.mustThrown;
    };
    Tile_db.prototype.setMustThrown = function (newThrown) {
        this.mustThrown = newThrown;
    };
    Tile_db.prototype.getTurnsToSetFree = function () {
        return this.turnToSetFree;
    };
    Tile_db.prototype.setTurnsToSetFree = function (newTurns) {
        this.turnToSetFree = newTurns;
    };
    Tile_db.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        console.log('insertuje toto');
        console.log(this);
        var query = {
            name: 'insert-tile',
            text: 'INSERT INTO "bachelorsThesis"."Tile"(id,"centerX","centerY",x1,x2,y1,y2,radius,color,stroke,"strokeColor",shape,"isChoosen","backgroundFile","tileNumber","isEndingFor","isStartingFor","toggleNumber","numberOfFollowingTile","gameName","questionId","cantBeEliminatedOnTile",skip,repeat,forward,backward,"mustThrown","turnToSetFree","nextTilesIds") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29);',
            values: [this.id, this.centerX, this.centerY, this.x1, this.x2, this.y1, this.y2, this.radius, this.color, this.stroke, this.strokeColor, this.shape, this.isChoosen, this.backgroundFile, this.tileNumber, this.isEndingFor, this.isStartingFor, this.toggleNumber, this.numberOfFollowingTile, this.gameName, this.questionId, this.cantBeEliminatedOnTile, this.skip, this.repeat, this.forward, this.backward, this.mustThrown, this.turnToSetFree, this.nextTilesIds]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    Tile_db.load = function (data) {
        var ret = new Tile_db();
        ret.setId(data.id);
        ret.setCenterX(data.centerX);
        ret.setCenterY(data.centerY);
        ret.setX1(data.x1);
        ret.setX2(data.x2);
        ret.setY1(data.y1);
        ret.setY2(data.y2);
        ret.setRadius(data.radius);
        ret.setColor(data.color);
        ret.setStroke(data.stroke);
        ret.setStrokeColor(data.strokeColor);
        ret.setShape(data.shape);
        ret.setIsChoosen(data.isChoosen);
        ret.setBackgroundFile(data.backgroundFile);
        ret.setTileNumber(data.tileNumber);
        ret.setIsEndingFor(data.isEndingFor);
        ret.setIsStartingFor(data.isStartingFor);
        ret.setToogleNumber(data.toggleNumber);
        ret.setFollowingTileNumber(data.numberOfFollowingTile);
        ret.setGameName(data.gameName);
        ret.setQuestionId(data.questionId);
        ret.setCantBeEliminatedOnTile(data.cantBeEliminatedOnTile);
        ret.setSkip(data.skip);
        ret.setRepeat(data.repeat);
        ret.setForward(data.forward);
        ret.setBackward(data.backward);
        ret.setMustThrown(data.mustThrown);
        ret.setTurnsToSetFree(data.turnToSetFree);
        ret.setNextTilesIds(data.nextTilesIds);
        return ret;
    };
    return Tile_db;
}());
exports.Tile_db = Tile_db;
