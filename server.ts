import { Server } from "http";

const path = require('path');
const http = require('http');
const express = require('express');
const a = require('./services/db/DbConnect.js')

import {Socket} from './services/socket/Socket.js';

const app = express();
const server:Server = http.createServer(app);
//const io = socketio(server);


const socketConnection = Socket.get();
socketConnection.setServerSocket(server);
const io = socketConnection.getServerSocket()
const Path = require('./editor/js/Path');


app.use(express.static(__dirname));
const editor = require("./routes/editor.js")
const main = require("./routes/main.js")
const gameSpace = require("./routes/gameSpace.js")
app.use('/',main);
app.use('/editor',editor);
app.use('/gameSpace',gameSpace);
const PORT = process.env.PORT || 8001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on('connection', (socket:any) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

