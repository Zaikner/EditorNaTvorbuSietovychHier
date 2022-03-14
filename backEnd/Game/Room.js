"use strict";
exports.__esModule = true;
exports.Room = void 0;
var Room = /** @class */ (function () {
    function Room(id, numOfPlayers, gameName) {
        this.id = 0;
        this.socketId = '';
        this.numOfPlayers = 0;
        this.players = [];
        this.gameName = '';
        this.id = id;
        this.numOfPlayers = numOfPlayers;
        this.gameName = gameName;
    }
    //constructor(){}
    Room.prototype.getId = function () {
        return this.id;
    };
    Room.prototype.setId = function (newId) {
        this.id = newId;
    };
    Room.prototype.getNumOfPlayers = function () {
        return this.numOfPlayers;
    };
    Room.prototype.setNumOfPlayers = function (newNum) {
        this.numOfPlayers = newNum;
    };
    Room.prototype.getPlayers = function () {
        return this.players;
    };
    Room.prototype.setPlayers = function (newPlayers) {
        this.players = newPlayers;
    };
    Room.prototype.getGameName = function () {
        return this.gameName;
    };
    Room.prototype.setGameName = function (newName) {
        this.gameName = newName;
    };
    Room.prototype.getSocketId = function () {
        return this.socketId;
    };
    Room.prototype.setSocketId = function (newId) {
        this.socketId = newId;
    };
    return Room;
}());
exports.Room = Room;
module.exports = Room;
