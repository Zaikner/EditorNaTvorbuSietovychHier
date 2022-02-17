import { Server } from "http";

const path = require('path');
const http = require('http');
const express = require('express');
const DbConnect = require('./services/db/DbConnect.js')
import { Server as ioServer } from "socket.io";
import {Game} from './services/db/RDG/Game_db.js'
import {GameFinder} from './services/db/RDG/GameFinder_db.js'
import {Tile} from './services/db/RDG/Tile_db.js'
//import {Socket} from './services/socket/Socket.js';

const app = express();
const server:Server = http.createServer(app);
const io = new ioServer(server);
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.set('views', __dirname + '/editor/views');


//const socketConnection = Socket.get();
// socketConnection.setServerSocket(server);
// const io = socketConnection.getServerSocket()
const Path = require('./editor/js/Path');


app.use(express.static(__dirname));
const editor = require("./routes/editor.js")
const main = require("./routes/main.js")
const gameLobby = require("./routes/gameLobby.js")


app.use('/',main);
app.use('/editor',editor);
app.use('/gameLobby',gameLobby);
const PORT = process.env.PORT || 8001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


io.on('connection', (socket:any) => {
    console.log('a user connected');

    //GameFinder.getIntance().findByName('dsasda')
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('saveGame', (data:any) => {
      
      console.log('odchytil')
        console.log(data)
        console.log('odchytil')
        let g = new Game()
        g.setAuthor(data.author)
        g.setName(data.name)
        g.setNumOfPlayers(data.numOfPlayers)
        data.tiles.forEach((tile:any) =>{
          let t = new Tile()
          t.setType(tile.type)
          t.setCenterX(tile.centerX)
          t.setCenterY(tile.centerY)
          t.setX1(tile.x1)
          t.setX2(tile.x2)
          t.setY1(tile.y1)
          t.setY2(tile.y2)
          t.setRadius(tile.radius)
          t.setIsOccupied(tile.isOccupied)
          t.setColor(tile.color)
          t.setStroke(tile.stroke)
          t.setStrokeColor(tile.strokeColor)
          t.setShape(tile.shape)
          t.setBackgroundFile(tile.backgroundFile)
          t.setPatternFile(tile.patternFile)
          t.setTileNumber(tile.tileNumber) 
          t.setIsEnding(tile.isEnding)
          t.setIsEndingFor(tile.isEndingFor)
          t.setIsStarting(tile.isStarting)
          t.setIsStartingFor(tile.isStartingFor)     
          t.setBelongTo(tile.belongTo)     
          t.setCanOccupy(tile.canOccupy)
          t.setToogleNumber(tile.toggleNumber)
          t.setNumberingColor(tile.numberingColor)
          t.setFollowingTileNumber(tile.numberOfFollowingTile)
          t.setGameName(data.name)
          t.insert()
        })
        g.insert()
        io.emit('chat message');
      });
  });

