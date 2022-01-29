"use strict";
exports.__esModule = true;
exports.Socket = void 0;
var socket_io_client_1 = require("socket.io-client");
var socket_io_1 = require("socket.io");
//const SocketServer = require('socket.io');
var Socket = /** @class */ (function () {
    function Socket() {
    }
    Socket.get = function () {
        if (!Socket.socket) {
            Socket.socket = new Socket();
        }
        return Socket.socket;
    };
    Socket.prototype.getClientSocket = function () {
        return this.clientSocket;
    };
    Socket.prototype.setClientSocket = function (URL) {
        this.clientSocket = (0, socket_io_client_1.io)(URL);
        console.log("Socket connected to Client!");
    };
    Socket.prototype.getServerSocket = function () {
        return this.serverSocket;
    };
    Socket.prototype.setServerSocket = function (server) {
        this.serverSocket = new socket_io_1.Server(server);
        console.log("Socket connected to Server!");
    };
    return Socket;
}());
exports.Socket = Socket;
