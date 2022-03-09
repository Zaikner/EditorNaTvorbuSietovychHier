"use strict";
exports.__esModule = true;
var path = require('path');
var AccountManager = require('../../backEnd/Accounts/AccountManager.js');
var GameManager = require('../../backEnd/Game/GameManager.js');
var ServerSocket = /** @class */ (function () {
    function ServerSocket() {
    }
    ServerSocket.serverListen = function () {
        this.io.on('connection', function (socket) {
            //         console.log('a user connected');
            //         console.log(socket.id)
            //         socket.emit('pipi')
            //         socket.on('load game',async (msg:{id:string,name:string}) => {
            //                 let acc = AccountManager.getAccountByClientId(msg.id)
            //                 acc.setSocketId(msg.id)
            //                 console.log('toto returnol:'+await GameManager.loadGame(msg.name))
            //                 this.emitToSpecificSocket(socket.id,'connected',await GameManager.loadGame(msg.name))
            //                 console.log('zapol som hru'+ msg.name);
            //         });
            //         socket.on('disconnect', () => {
            //                 console.log('user disconnected');
            //         });
            //     socket.on('saveGame', (data:any) => {
            //   console.log('odchytil')
            //     console.log(data)
            //     console.log('odchytil')
            //     let g = new Game_db()
            //     g.setAuthor(data.author)
            //     g.setName(data.name)
            //     g.setNumOfPlayers(data.numOfPlayers)
            //     data.tiles.forEach((tile:any) =>{
            //       let t = new Tile_db()
            //       t.setType(tile.type)
            //       t.setCenterX(tile.centerX)
            //       t.setCenterY(tile.centerY)
            //       t.setX1(tile.x1)
            //       t.setX2(tile.x2)
            //       t.setY1(tile.y1)
            //       t.setY2(tile.y2)
            //       t.setRadius(tile.radius)
            //       t.setIsOccupied(tile.isOccupied)
            //       t.setColor(tile.color)
            //       t.setStroke(tile.stroke)
            //       t.setStrokeColor(tile.strokeColor)
            //       t.setShape(tile.shape)
            //       t.setBackgroundFile(tile.backgroundFile)
            //       t.setPatternFile(tile.patternFile)
            //       t.setTileNumber(tile.tileNumber) 
            //       t.setIsEnding(tile.isEnding)
            //       t.setIsEndingFor(tile.isEndingFor)
            //       t.setIsStarting(tile.isStarting)
            //       t.setIsStartingFor(tile.isStartingFor)     
            //       t.setBelongTo(tile.belongTo)     
            //       t.setCanOccupy(tile.canOccupy)
            //       t.setToogleNumber(tile.toggleNumber)
            //       t.setNumberingColor(tile.numberingColor)
            //       t.setFollowingTileNumber(tile.numberOfFollowingTile)
            //       t.setGameName(data.name)
            //       t.insert()
            //     })
            //     g.insert()
            //     let b = new Background_db()
            //     b.setGameName(data.name)
            //     b.setColor(data.background.color)
            //     b.setImage(data.background.backgroundImage)
            //     b.insert()
            //     this.io.emit('chat message');
            //   });
        });
    };
    ServerSocket.getIo = function () {
        return this.io;
    };
    ServerSocket.setIo = function (io) {
        this.io = io;
    };
    ServerSocket.emitToSpecificSocket = function (socketId, event, msg) {
        this.io.to(socketId).emit(event, msg);
    };
    return ServerSocket;
}());
module.exports = ServerSocket;
