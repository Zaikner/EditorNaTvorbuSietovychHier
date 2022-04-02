import { Account } from "../Accounts/Account";
import { Player } from "./Player";
import { ServerSocket } from "../../services/socket/SocketServer";
export class Room{
        private id:number = 0;
        private socketId:string = '';
        private maxPlayers:number = 0;
        private numOfPresentPlayers = 0;
        private players:Array<Player> = []
        private gameName:string = ''

        constructor(id:number,numOfPlayers:number,gameName:string){
            this.id = id;
            this.maxPlayers = numOfPlayers;
            this.gameName = gameName;
        }

        public join(player:Player){
            this.players.push(player)
            player.setToken('Player '+ (this.numOfPresentPlayers+1))
            this.numOfPresentPlayers++;
            ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'join Room',{id:this.id.toString()})
            console.log(' joinol a emitol playerovi: '+ player.getAccount().getSocketId())
        }

        public leave(player:Player){
            this.players = this.players.filter((t) => {return t != player});
            this.numOfPresentPlayers--;
           
        }
        public broadcast(msg:string){

        }
    
        //constructor(){}


        public getId() : number {
            return this.id
        }
        public setId(newId:number){
            this.id = newId
        }

        public getNumOfPlayers() : number {
            return this.numOfPresentPlayers
        }
        public setNumOfPlayers(newNum:number){
            this.numOfPresentPlayers = newNum
        }
        public getMaxPlayers() : number {
            return this.maxPlayers
        }
        public setMaxPlayers(newNum:number){
            this.maxPlayers = newNum
        }
        public getPlayers(){
            return this.players
        }
        public setPlayers(newPlayers:Array<Player>){
            this.players = newPlayers
        }

        public getGameName() : string {
            return this.gameName
        }
        public setGameName(newName:string){
            this.gameName  = newName
        }
        public getSocketId() : string {
            return this.socketId
        }
        public setSocketId(newId:string){
            this.socketId = newId
        }
    }
