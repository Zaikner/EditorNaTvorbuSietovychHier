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
        this.spectators = [];
        this.timeLeft = 0;
        this.lastDiceValue = 0;
        this.usedTokens = [];
        this.pawnPositions = new Map();
        this.id = id;
        this.maxPlayers = numOfPlayers;
        this.gameName = gameName;
    }
    // public  async initGameData(){
    //     this.gameData = await GameManager.loadGame(this.gameName)
    //     ////console.log('zavolal initGameData')
    //     ////console.log(this.gameData)
    // }
    Room.prototype.join = function (player) {
        ////console.log('skusil join')
        ////console.log(this.hasStarted)
        if (this.numOfPresentPlayers == this.maxPlayers || this.hasStarted) {
            ////console.log('nepustil')
            SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'room is full', {});
            return;
        }
        ////console.log('aktivoval room join')
        if (player.getToken() != 'spectator') {
            if (this.numOfPresentPlayers == this.maxPlayers) {
                SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'room is full', {});
                player.setToken('spectator');
                this.spectators.push(player);
                ////console.log('premenil na spectator')
            }
            else {
                this.players.push(player);
                ////console.log('aspon zavoalal pridelenie tokenu')
                player.getAccount().setActiveInRoom(this);
                player.setToken('');
                for (var i = 1; i <= this.players.length; i++) {
                    if (!this.usedTokens.includes('Player ' + i) && player.getToken() == '') {
                        player.setToken('Player ' + i);
                        this.usedTokens.push('Player ' + i);
                        this.numOfPresentPlayers++;
                        ////console.log('pridelil token:' + player.getToken())
                    }
                    else {
                        ////console.log('nechcel Player '+i)
                    }
                }
            }
        }
        else {
            this.spectators.push(player);
        }
        SocketServer_1.ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(), 'join Room', { id: this.id.toString(), started: this.hasStarted, name: player.getAccount().getName() });
        ////console.log(' joinol a emitol playerovi: '+ player.getAccount().getSocketId())
        GameManager_1.GameManager.reloadTables();
        //console.log('refreshol lobby')
        if (this.numOfPresentPlayers == 1 && player.getToken() != 'spectator') {
            this.playerOnTurn = this.players[0];
        }
    };
    Room.prototype.leave = function (player) {
        if (player.getToken() != 'spectator') {
            this.players = this.players.filter(function (t) { return t != player; });
            this.usedTokens = this.usedTokens.filter(function (t) { return t != player.getToken(); });
            this.numOfPresentPlayers--;
            player.getAccount().setActiveInRoom(undefined);
            this.nextTurn();
        }
        else {
            this.spectators = this.spectators.filter(function (t) { return t != player; });
        }
        if (this.numOfPresentPlayers == 0) {
            GameManager_1.GameManager.getActiveRooms()["delete"](this.id);
        }
        SocketServer_1.ServerSocket.emitToRoom(this.id.toString(), 'player left', { msg: player.getAccount().getName(), token: player.getToken() });
        GameManager_1.GameManager.reloadTables();
        //'player left',(msg:{msg:string})
    };
    Room.prototype.startGame = function () {
        this.setHasStarted(true);
        var r = this;
        this.timeLeft = 120;
        setInterval(function () {
            if (r.players.length > 0) {
                r.timeLeft--;
                ////console.log('time left --->' + r.timeLeft)
                if (r.timeLeft == 0) {
                    r.timeLeft = 120;
                    ////console.log('ended turn')
                    SocketServer_1.ServerSocket.emitToRoom(r.id.toString(), 'end turn', {});
                    r.nextTurn();
                    var stop_1 = true;
                    if (r.getPlayerOnTurn().getSkip() != 0) {
                        //r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
                        SocketServer_1.ServerSocket.emitToRoom(r.id.toString(), 'react to event: skip', { token: r.getPlayerOnTurn().getAccount().getName(), left: r.getPlayerOnTurn().getSkip() - 1 });
                        stop_1 = false;
                    }
                    while (!stop_1) {
                        //////console.log('skipped:' + r.getPlayerOnTurn().getAccount().getName())
                        //////console.log('skipped:' + r.getPlayerOnTurn().getSkip())
                        if (r.getPlayerOnTurn().getSkip() == 0) {
                            stop_1 = true;
                        }
                        else {
                            r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip() - 1);
                            r.nextTurn();
                            //this.io.in(msg.room).emit('react to event: skip',{token: r.getPlayerOnTurn().getToken(),left:r.getPlayerOnTurn().getSkip()})
                        }
                    }
                    //////console.log('ide:'+ r.getPlayerOnTurn().getAccount().getName())
                    ////////console.log(r)
                    SocketServer_1.ServerSocket.emitToRoom(r.id.toString(), 'turn', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
                    SocketServer_1.ServerSocket.emitToRoom(r.getPlayerOnTurn().getAccount().getSocketId(), 'turnMove', { player: r.getPlayerOnTurn().getAccount().getName(), token: r.getPlayerOnTurn().getToken() });
                    r.setReturnValue(-1);
                    r.setChoosedPawnId(-1);
                    //ServerSocket.emitToRoom(r.id.toString(),'show Dice value',{value:r.getLastDiceValue()})
                }
            }
        }, 1000);
    };
    Room.prototype.broadcast = function (msg) {
    };
    Room.prototype.nextTurn = function () {
        ////console.log('teraz je next ID :')
        ////console.log(this.playerOnTurn)
        ////console.log(this.lastPlayerId)
        if (!this.gameEnded()) {
            if (this.playerOnTurn.getRepeat() != 0) {
                this.playerOnTurn.setRepeat((this.playerOnTurn.getRepeat() - 1));
                SocketServer_1.ServerSocket.emitToRoom(this.id.toString(), 'player repeat his turn', { name: this.playerOnTurn.getAccount().getName() });
                ////console.log('zopakoval')
                ////console.log(this.playerOnTurn.getRepeat())
            }
            else {
                if (this.lastPlayerId + 1 >= this.players.length) {
                    this.lastPlayerId = 0;
                }
                else {
                    this.lastPlayerId++;
                }
                this.playerOnTurn = this.players[this.lastPlayerId];
                ////console.log('teraz je next ID :')
                ////console.log(this.playerOnTurn)
                ////console.log(this.lastPlayerId)
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
    Room.prototype.findPlayerOnAccount = function (acc) {
        var ret = undefined;
        this.players.forEach(function (player) {
            if (player.getAccount() == acc) {
                ret = player;
            }
        });
        return ret;
    };
    Room.prototype.isSpectator = function (acc) {
        var ret = false;
        this.spectators.forEach(function (player) {
            if (player.getAccount() == acc) {
                ret = true;
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
    Room.prototype.getSpectators = function () {
        return this.spectators;
    };
    Room.prototype.setSpectators = function (newSpectator) {
        this.spectators = newSpectator;
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
