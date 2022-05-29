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
        this.image = '';
        this.tileNumber = 0;
        this.isEndingFor = [];
        this.isStartingFor = [];
        this.gameId = 0;
        this.questionId = -1;
        this.cantBeEliminatedOnTile = [];
        this.skip = 0;
        this.repeat = 0;
        this.forward = 0;
        this.backward = 0;
        this.mustThrown = 0;
        this.nextTilesIds = [];
        this.randomQuestion = false;
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
    Tile_db.prototype.getImage = function () {
        return this.image;
    };
    Tile_db.prototype.setImage = function (newFile) {
        this.image = newFile;
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
    Tile_db.prototype.getTileNumber = function () {
        return this.tileNumber;
    };
    Tile_db.prototype.setTileNumber = function (newNumber) {
        this.tileNumber = newNumber;
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
    Tile_db.prototype.getGameId = function () {
        return this.gameId;
    };
    Tile_db.prototype.setGameId = function (newId) {
        this.gameId = newId;
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
    Tile_db.prototype.setRandomQuestion = function (is) {
        this.randomQuestion = is;
    };
    Tile_db.prototype.getRandomQuestion = function () {
        return this.randomQuestion;
    };
    Tile_db.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-tile',
            text: 'INSERT INTO bachelors_thesis.tiles(id,center_x,center_y,x_1,x_2,y_1,y_2,radius,color,stroke,stroke_color,shape,image,tile_number,is_ending_for,is_starting_for,game_id,question_id,cant_be_eliminated_on_tile,skip,repeat,forward,backward,must_thrown,next_tiles_ids,random_question) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26);',
            values: [this.id, this.centerX, this.centerY, this.x1, this.x2, this.y1, this.y2, this.radius, this.color, this.stroke, this.strokeColor, this.shape, this.image, this.tileNumber, this.isEndingFor, this.isStartingFor, this.gameId, this.questionId, this.cantBeEliminatedOnTile, this.skip, this.repeat, this.forward, this.backward, this.mustThrown, this.nextTilesIds, this.randomQuestion]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows); })["catch"](function (e) { return console.error(e.stack); });
    };
    Tile_db.load = function (data) {
        var ret = new Tile_db();
        ret.setId(data.id);
        ret.setCenterX(data.center_x);
        ret.setCenterY(data.center_y);
        ret.setX1(data.x_1);
        ret.setX2(data.x_2);
        ret.setY1(data.y_1);
        ret.setY2(data.y_2);
        ret.setRadius(data.radius);
        ret.setColor(data.color);
        ret.setStroke(data.stroke);
        ret.setStrokeColor(data.stroke_color);
        ret.setShape(data.shape);
        ret.setTileNumber(data.tile_number);
        ret.setIsEndingFor(data.is_ending_for);
        ret.setIsStartingFor(data.is_starting_for);
        ret.setGameId(data.game_id);
        ret.setQuestionId(data.question_id);
        ret.setCantBeEliminatedOnTile(data.cant_be_eliminated_on_tile);
        ret.setSkip(data.skip);
        ret.setRepeat(data.repeat);
        ret.setForward(data.forward);
        ret.setBackward(data.backward);
        ret.setMustThrown(data.must_thrown);
        ret.setNextTilesIds(data.next_tiles_ids);
        ret.setRandomQuestion(data.random_question);
        return ret;
    };
    return Tile_db;
}());
exports.Tile_db = Tile_db;
