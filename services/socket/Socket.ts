import { Server } from "http";
import { io } from "socket.io-client";

export class Socket{
    private static socket:Socket;
    clientSocket:any;
    serverSocket:any;
    private constructor(){
    }

    public static get(): Socket {
        if (!Socket.socket) {
            Socket.socket = new Socket();
        }

        return Socket.socket;
    }
    getClientSocket(){
        return this.clientSocket
    }

    setClientSocket(URL:string){
        this.clientSocket = io(URL);
        console.log("Socket connected to Client!" )
    }

    getServerSocket(){
        return this.serverSocket
    }

    setServerSocket(server:Server){
        console.log("Socket connected to Server!")
    }
}