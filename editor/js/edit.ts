import { io } from "socket.io-client";
const editorSocket = io('http://localhost:8001/');//http://sietove-hry.herokuapp.com/
//socket.emit('chat message', 'hi');
editorSocket.on('chat message', function(msg) {
console.log(msg)
});