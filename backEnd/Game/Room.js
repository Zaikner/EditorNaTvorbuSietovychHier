"use strict";
exports.__esModule = true;
exports.Room = void 0;
var SocketServer_1 = require("../../services/socket/SocketServer");
var GameManager_1 = require("./GameManager");
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
        this.timeLeft = 0;
        this.lastDiceValue = 0;
        this.usedTokens = [];
        this.pawnPositions = new Map();
        this.id = id;
        this.maxPlayers = numOfPlayers;
        this.gameName = gameName;
    }
    Room.prototype.join = function (player) {
        if (this.numOfPresentPlayers == this.maxPlayers || this.hasStarted) {
            SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'room is full', {});
            return;
        }
        if (this.numOfPresentPlayers == this.maxPlayers) {
            SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'room is full', {});
        }
        else {
            this.players.push(player);
            player.getAccount().setActiveInRoom(this);
            player.setToken('');
            for (var i = 1; i <= this.players.length; i++) {
                if (!this.usedTokens.includes('Player ' + i) && player.getToken() == '') {
                    player.setToken('Player ' + i);
                    this.usedTokens.push('Player ' + i);
                    this.numOfPresentPlayers++;
                }
            }
        }
        SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'join Room', { id: this.id.toString(), started: this.hasStarted, name: player.getAccount().getName() });
        GameManager_1.GameManager.reloadTables();
        if (this.numOfPresentPlayers == 1 && player.getToken() != 'spectator') {
            this.playerOnTurn = this.players[0];
        }
    };
    Room.prototype.leave = function (player) {
        this.players = this.players.filter(function (t) { return t != player; });
        this.usedTokens = this.usedTokens.filter(function (t) { return t != player.getToken(); });
        this.numOfPresentPlayers--;
        player.getAccount().setActiveInRoom(undefined);
        this.nextTurn();
        if (this.numOfPresentPlayers == 0) {
            GameManager_1.GameManager.getActiveRooms()["delete"](this.id);
        }
        SocketServer_1.ServerSocket.emitToRoom(this.id.toString(), 'player left', { msg: player.getAccount().getName(), token: player.getToken() });
        GameManager_1.GameManager.reloadTables();
    };
    Room.prototype.startGame = function () {
        this.setHasStarted(true);
        var r = this;
        this.timeLeft = 120;
        setInterval(function () {
            if (r.players.length > 0) {
                r.timeLeft--;
                if (r.timeLeft == 0) {
                    r.timeLeft = 120;
                    SocketServer_1.ServerSocket.emitToRoom(r.id.toString(), 'end turn', {});
                    r.nextTurn();
                    var stop_1 = true;
                    if (r.getPlayerOnTurn().getSkip() != 0) {
                        SocketServer_1.ServerSocket.emitToRoom(r.id.toString(), 'react to event: skip', { token: r.getPlayerOnTurn().getAccount().getName(), left: r.getPlayerOnTurn().getSkip() - 1 });
                        stop_1 = false;
                    }
                    while (!stop_1) {
                        if (r.getPlayerOnTurn().getSkip() == 0) {
                            stop_1 = true;
                        }
                        else {
                            r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip() - 1);
                            r.nextTurn();
                        }
                    }
                    SocketServer_1.ServerSocket.emitToRoom(r.id.toString(), 'turn', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
                    SocketServer_1.ServerSocket.emitToRoom(r.getPlayerOnTurn().getAccount().getSocketId(), 'turnMove', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
                    r.setReturnValue(-1);
                    r.setChoosedPawnId(-1);
                }
            }
        }, 1000);
    };
    Room.prototype.nextTurn = function () {
        if (!this.gameEnded()) {
            if (this.playerOnTurn.getRepeat() != 0) {
                this.playerOnTurn.setRepeat((this.playerOnTurn.getRepeat() - 1));
                SocketServer_1.ServerSocket.emitToRoom(this.id.toString(), 'player repeat his turn', { name: this.playerOnTurn.getAccount().getName() });
            }
            else {
                if (this.lastPlayerId + 1 >= this.players.length) {
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
    Room.prototype.findPlayerOnAccount = function (acc) {
        var ret = undefined;
        this.players.forEach(function (player) {
            if (player.getAccount() == acc) {
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
    Room.prototype.getTimeLeft = function () {
        return this.timeLeft;
    };
    Room.prototype.setTimeLeft = function (newTime) {
        this.timeLeft = newTime;
    };
    Room.prototype.getLastDiceValue = function () {
        return this.lastDiceValue;
    };
    Room.prototype.setLastDiceValue = function (newValue) {
        this.lastDiceValue = newValue;
    };
    Room.activeInRoom = undefined;
    return Room;
}());
exports.Room = Room;
