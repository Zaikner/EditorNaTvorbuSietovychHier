import { Account } from "../Accounts/Account";
import { Player } from "./Player";
import { ServerSocket } from "../../services/socket/SocketServer";
const GameManager = require('./GameManager')
export class Room{
        private id:number = 0;
        private socketId:string = '';
        private maxPlayers:number = 0;
        private numOfPresentPlayers = 0;
        private players:Array<Player> = []
        private gameName:string = ''
        private hasStarted:boolean = false;
        private playerOnTurn:Player = undefined!
        private lastPlayerId:number = 0
        private gameData:any = undefined!;
        private returnValue:number = -1;
        private choosedPawnId:number = -1
        private playersWhichEnded:Array<Player> = []
       
        private pawnPositions:Map<number,number> = new Map()

        constructor(id:number,numOfPlayers:number,gameName:string){
            this.id = id;
            this.maxPlayers = numOfPlayers;
            this.gameName = gameName;
            
        }

        // public  async initGameData(){
        //     this.gameData = await GameManager.loadGame(this.gameName)
        //     console.log('zavolal initGameData')
        //     console.log(this.gameData)
        // }
        public join(player:Player){
            if (player.getToken() != 'spectator'){
                this.players.push(player)
                player.setToken('Player '+ (this.numOfPresentPlayers+1))
              
                this.numOfPresentPlayers++;
            }
         
            ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'join Room',{id:this.id.toString(),started:this.hasStarted})
            console.log(' joinol a emitol playerovi: '+ player.getAccount().getSocketId())
           
            if (this.numOfPresentPlayers == 1 && player.getToken() != 'spectator'){
                this.playerOnTurn = this.players[0]
             }
        }

        public leave(player:Player){
        
            if (player.getToken() != 'spectator'){
                this.players = this.players.filter((t) => {return t != player});
                this.numOfPresentPlayers--;
            }
           
        }
        public broadcast(msg:string){

        }

        public nextTurn()
        {

            if (this.lastPlayerId+1  == this.players.length){
                this.lastPlayerId = 0
            }
            else{
                this.lastPlayerId++;
            }
            this.playerOnTurn = this.players[this.lastPlayerId]
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
        public getPlayersWhichEnded(){
            return this.playersWhichEnded
        }
        public setPlayersWhichEnded(newPlayersWhichEnded:Array<Player>){
            this.playersWhichEnded = newPlayersWhichEnded
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
        public setHasStarted(has:boolean){
            this.hasStarted = has
        }
        public getHasStarted(){
            return this.hasStarted
        }
        public getPlayerOnTurn(){
            return this.playerOnTurn
        }
        public setPlayerOnTurn(newPlayer:Player){
            this.playerOnTurn = newPlayer
        }
      
        public setPawnPositions(newPos:Map<number,number>){
            this.pawnPositions = newPos;
        }
        public getPawnPositions(){
            return this.pawnPositions
        }
        public getGameData(){
            return this.gameData
        }
        public setGameData(newData:any){
            this.gameData = newData!
        }
        public getReturnValue(){
            return this.returnValue
        }
        public setReturnValue(newValue:any){
            this.returnValue = newValue!
        }
        public getChoosedPawnId(){
            return this.choosedPawnId
        }
        public setChoosedPawnId(newValue:any){
            this.choosedPawnId = newValue!
        }
            
        
    }
