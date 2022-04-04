"use strict";
exports.__esModule = true;
exports.Room = void 0;
var SocketServer_1 = require("../../services/socket/SocketServer");
var Room = /** @class */ (function () {
    function Room(id, numOfPlayers, gameName) {
        this.id = 0;
        this.socketId = '';
        this.maxPlayers = 0;
        this.numOfPresentPlayers = 0;
        this.players = [];
        this.gameName = '';
        this.hasStarted = false;
        this.id = id;
        this.maxPlayers = numOfPlayers;
        this.gameName = gameName;
    }
    Room.prototype.join = function (player) {
        if (player.getToken() != 'spectator') {
            this.players.push(player);
            player.setToken('Player ' + (this.numOfPresentPlayers + 1));
            this.numOfPresentPlayers++;
        }
        SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'join Room', { id: this.id.toString() });
        console.log(' joinol a emitol playerovi: ' + player.getAccount().getSocketId());
    };
    Room.prototype.leave = function (player) {
        if (player.getToken() != 'spectator') {
            this.players = this.players.filter(function (t) { return t != player; });
            this.numOfPresentPlayers--;
        }
    };
    Room.prototype.broadcast = function (msg) {
    };
    //constructor(){}
    Room.prototype.getId = function () {
        return this.id;
    };
    Room.prototype.setId = function (newId) {
        this.id = newId;
    };
    Room.prototype.getNumOfPlayers = function () {
        return this.numOfPresentPlayers;
    };
    Room.prototype.setNumOfPlayers = function (newNum) {
        this.numOfPresentPlayers = newNum;
    };
    Room.prototype.getMaxPlayers = function () {
        return this.maxPlayers;
    };
    Room.prototype.setMaxPlayers = function (newNum) {
        this.maxPlayers = newNum;
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
    Room.prototype.setHasStarted = function (has) {
        this.hasStarted = has;
    };
    Room.prototype.getHasStarted = function () {
        return this.hasStarted;
    };
    return Room;
}());
exports.Room = Room;
