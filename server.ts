import { Server } from "http";

const path = require('path');
const http = require('http');
const express = require('express');

const Path = require('./editor/js/Path');
//import {Socket} from './services/socket/Socket.js';

const app = express();
//const server:Server = http.createServer(app);
//const io = socketio(server);

//const socketConnection = Socket.get();
//socketConnection.setServerSocket(server);
//socketConnection.setClientSocket('http://localhost:8001');
//const io = socketConnection.getServerSocket()



app.use(express.static(__dirname));
const editor = require("./routes/editor.js")

app.use('/',editor);
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// io.on('connection', (socket:any) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//     socket.on('skuska',() => {console.log("Client pripojeny, vysiela.")})
//     socket.on('saveEditingTrack', (data:any) => {
//         var newPath = new Path(data.points,data.type,data.length);
//       console.log(newPath);
//     });
//   });

