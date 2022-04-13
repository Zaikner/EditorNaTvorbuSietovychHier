"use strict";
exports.__esModule = true;
exports.Room = void 0;
var SocketServer_1 = require("../../services/socket/SocketServer");
var GameManager = require('./GameManager');
var Room = /** @class */ (function () {
    function Room(id, numOfPlayers, gameName) {
        this.id = 0;
        this.socketId = '';
        this.maxPlayers = 0;
        this.numOfPresentPlayers = 0;
        this.players = [];
        this.gameName = '';
        this.hasStarted = false;
        this.playerOnTurn = undefined;
        this.lastPlayerId = 0;
        this.gameData = undefined;
        this.returnValue = -1;
        this.choosedPawnId = -1;
        this.playersWhichEnded = [];
        this.pawnPositions = new Map();
        this.id = id;
        this.maxPlayers = numOfPlayers;
        this.gameName = gameName;
    }
    // public  async initGameData(){
    //     this.gameData = await GameManager.loadGame(this.gameName)
    //     console.log('zavolal initGameData')
    //     console.log(this.gameData)
    // }
    Room.prototype.join = function (player) {
        if (player.getToken() != 'spectator') {
            this.players.push(player);
            player.setToken('Player ' + (this.numOfPresentPlayers + 1));
            this.numOfPresentPlayers++;
        }
        SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'join Room', { id: this.id.toString(), started: this.hasStarted });
        console.log(' joinol a emitol playerovi: ' + player.getAccount().getSocketId());
        if (this.numOfPresentPlayers == 1 && player.getToken() != 'spectator') {
            this.playerOnTurn = this.players[0];
        }
    };
    Room.prototype.leave = function (player) {
        if (player.getToken() != 'spectator') {
            this.players = this.players.filter(function (t) { return t != player; });
            this.numOfPresentPlayers--;
        }
    };
    Room.prototype.broadcast = function (msg) {
    };
    Room.prototype.nextTurn = function () {
        if (!this.gameEnded()) {
            if (this.playerOnTurn.getRepeat() != 0) {
                this.playerOnTurn.setRepeat((this.playerOnTurn.getRepeat() - 1));
                console.log('zopakoval');
                console.log(this.playerOnTurn.getRepeat());
            }
            else {
                if (this.lastPlayerId + 1 == this.players.length) {
                    this.lastPlayerId = 0;
                }
                else {
                    this.lastPlayerId++;
                }
                this.playerOnTurn = this.players[this.lastPlayerId];
                if (!this.gameEnded() && this.playerOnTurn.getPlace() != 0) {
                    this.nextTurn();
                }
            }
        }
    };
    //constructor(){}
    Room.prototype.gameEnded = function () {
        var ret = true;
        this.players.forEach(function (player) {
            if (player.getPlace() == 0) {
                ret = false;
            }
        });
        return ret;
    };
    Room.prototype.findPlayerByToken = function (token) {
        var ret = undefined;
        this.players.forEach(function (player) {
            if (player.getToken() == token) {
                ret = player;
            }
        });
        return ret;
    };
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
    Room.prototype.getPlayersWhichEnded = function () {
        return this.playersWhichEnded;
    };
    Room.prototype.setPlayersWhichEnded = function (newPlayersWhichEnded) {
        this.playersWhichEnded = newPlayersWhichEnded;
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
    Room.prototype.getPlayerOnTurn = function () {
        return this.playerOnTurn;
    };
    Room.prototype.setPlayerOnTurn = function (newPlayer) {
        this.playerOnTurn = newPlayer;
    };
    Room.prototype.setPawnPositions = function (newPos) {
        this.pawnPositions = newPos;
    };
    Room.prototype.getPawnPositions = function () {
        return this.pawnPositions;
    };
    Room.prototype.getGameData = function () {
        return this.gameData;
    };
    Room.prototype.setGameData = function (newData) {
        this.gameData = newData;
    };
    Room.prototype.getReturnValue = function () {
        return this.returnValue;
    };
    Room.prototype.setReturnValue = function (newValue) {
        this.returnValue = newValue;
    };
    Room.prototype.getChoosedPawnId = function () {
        return this.choosedPawnId;
    };
    Room.prototype.setChoosedPawnId = function (newValue) {
        this.choosedPawnId = newValue;
    };
    return Room;
}());
exports.Room = Room;
