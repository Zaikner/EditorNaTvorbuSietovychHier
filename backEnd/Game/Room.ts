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
        private spectators:Array<Player>=[]

       
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

                if (this.numOfPresentPlayers == this.maxPlayers){
                    ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'room is full',{})
                    player.setToken('spectator')
                    this.spectators.push(player)
                    console.log('premenil na spectator')
                }
                else{
                    this.players.push(player)
                    player.setToken('Player '+ (this.numOfPresentPlayers+1))
                  
                    this.numOfPresentPlayers++;
                 }
               
            }
            else{
                this.spectators.push(player)
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
            else{
                this.spectators = this.spectators.filter((t) => {return t != player});
            }
           
        }
        public broadcast(msg:string){

        }

        public nextTurn()
        {
            if (!this.gameEnded()){
                
                if (this.playerOnTurn.getRepeat()!=0){
                    this.playerOnTurn.setRepeat((this.playerOnTurn.getRepeat()-1))
                    console.log('zopakoval')
                    console.log(this.playerOnTurn.getRepeat())
                }
                else{
                    if (this.lastPlayerId+1  == this.players.length){
                        this.lastPlayerId = 0
                    }
                    else{
                        this.lastPlayerId++;
                    }
                    this.playerOnTurn = this.players[this.lastPlayerId]
    
                    if (!this.gameEnded() && this.playerOnTurn.getPlace()!=0){
                        this.nextTurn()
                    }
                }
              
            }

          
    
        }
        //constructor(){}
        
        gameEnded(){
            let ret = true
            this.players.forEach((player:Player)=>{
                if (player.getPlace()==0){
                    ret = false
                }
            })
            return ret
        }
        findPlayerByToken(token:string){
            let ret = undefined
            this.players.forEach((player:Player)=>{
                if (player.getToken() == token){
                    ret = player
                }
            })
            return ret
        }
        findPlayerOnAccount(acc:Account){
            let ret = undefined
            this.players.forEach((player:Player)=>{
                if (player.getAccount() == acc){
                    ret = player
                }
            })
            return ret
        }
        isSpectator(acc:Account){
            let ret = false
            this.spectators.forEach((player:Player)=>{
                if (player.getAccount() == acc){
                    ret = true
                }
            })
            return ret
        }
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
        public getSpectators(){
            return this.spectators
        }
        public setSpectators(newSpectator:Array<Player>){
            this.spectators = newSpectator
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
