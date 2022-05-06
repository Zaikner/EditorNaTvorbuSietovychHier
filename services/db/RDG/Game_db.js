"use strict";
exports.__esModule = true;
exports.Game_db = void 0;
var DbConnect_1 = require("../DbConnect");
var Game_db = /** @class */ (function () {
    function Game_db() {
        this.id = 0;
        this.name = '';
        this.authorId = 0;
        this.numOfPlayers = 0;
        this.nextTilesIds = [];
        this.initSizeX = 0;
        this.initSizeY = 0;
        this.isPublished = false;
        this.toogleNumber = false;
        this.numOfPawnsPerTile = 0;
    }
    Game_db.prototype.getId = function () {
        return this.id;
    };
    Game_db.prototype.setId = function (newId) {
        this.id = newId;
    };
    Game_db.prototype.getNumOfPlayers = function () {
        return this.numOfPlayers;
    };
    Game_db.prototype.setNumOfPlayers = function (newNum) {
        this.numOfPlayers = newNum;
    };
    Game_db.prototype.getName = function () {
        return this.name;
    };
    Game_db.prototype.setName = function (newName) {
        this.name = newName;
    };
    Game_db.prototype.getAuthorId = function () {
        return this.authorId;
    };
    Game_db.prototype.setAuthorId = function (newAuthor) {
        this.authorId = newAuthor;
    };
    Game_db.prototype.setNextTilesIds = function (newIds) {
        this.nextTilesIds = newIds;
    };
    Game_db.prototype.getNextTilesIds = function () {
        return this.nextTilesIds;
    };
    Game_db.prototype.getInitSizeX = function () {
        return this.initSizeX;
    };
    Game_db.prototype.setInitSizeX = function (newCoord) {
        return this.initSizeX = newCoord;
    };
    Game_db.prototype.getInitSizeY = function () {
        return this.initSizeY;
    };
    Game_db.prototype.setInitSizeY = function (newCoord) {
        return this.initSizeY = newCoord;
    };
    Game_db.prototype.setIsPublished = function (is) {
        this.isPublished = is;
    };
    Game_db.prototype.getIsPublished = function () {
        return this.isPublished;
    };
    Game_db.prototype.setToogleNumber = function (is) {
        this.toogleNumber = is;
    };
    Game_db.prototype.getToggleNumber = function () {
        return this.toogleNumber;
    };
    Game_db.prototype.setNumOfPawnsPerTile = function (num) {
        this.numOfPawnsPerTile = num;
    };
    Game_db.prototype.getNumOfPawnsPerTile = function () { return this.numOfPawnsPerTile; };
    // public insert(){
    //     let client = DbConnect.get()
    //         const query = {
    //             name: 'insert-game',
    //             text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers","nextTilesIds","initSizeX","initSizeY","isPublished","toogleNumber") VALUES($1,$2,$3,$4,$5,$6,$7,$8);',
    //             values: [this.name,this.author,this.numOfPlayers,this.nextTilesIds,this.initSizeX,this.initSizeY,this.isPublished,this.toogleNumber],
    //           }
    //           client
    //           .query(query)
    //           .then((res:any) => console.log(res.rows[0]))
    //           .catch((e:Error) => console.error(e.stack))}
    Game_db.prototype.upsert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'upsert-game',
            text: 'INSERT INTO bachelors_thesis.games(id,name,author_id,num_of_players,next_tiles_ids,init_size_x,init_size_y,is_published,toogle_number,num_of_pawns_per_tile) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)  ON CONFLICT(id) DO UPDATE SET name = EXCLUDED.name, author_id = EXCLUDED.author_id,num_of_players = EXCLUDED.num_of_players,next_tiles_ids= EXCLUDED.next_tiles_ids,init_size_x=EXCLUDED.init_size_x,init_size_y=EXCLUDED.init_size_y,is_published=EXCLUDED.is_published,toogle_number = EXCLUDED.toogle_number, num_of_pawns_per_tile = EXCLUDED.num_of_pawns_per_tile;',
            values: [this.id, this.name, this.authorId, this.numOfPlayers, this.nextTilesIds, this.initSizeX, this.initSizeY, this.isPublished, this.toogleNumber, this.numOfPawnsPerTile]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Game_db.load = function (data) {
        var ret = new Game_db();
        ret.setId(data.id);
        ret.setName(data.name);
        ret.setAuthorId(data.author_id);
        ret.setNumOfPlayers(data.num_of_players);
        ret.setNextTilesIds(data.next_tiles_ids);
        ret.setInitSizeX(data.init_size_x);
        ret.setInitSizeY(data.init_size_y);
        ret.setIsPublished(data.is_published);
        ret.setToogleNumber(data.toogle_number);
        ret.setNumOfPawnsPerTile(data.num_of_pawns_per_tile);
        return ret;
    };
    return Game_db;
}());
exports.Game_db = Game_db;
