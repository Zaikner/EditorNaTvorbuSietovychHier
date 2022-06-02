import { Account } from "../Accounts/Account";
import { Player } from "./Player";
import { ServerSocket } from "../../services/socket/SocketServer";
import {GameManager} from './GameManager'
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
        private static activeInRoom:Room = undefined!;
        private timeLeft:number = 0;
        private lastDiceValue:number = 0
        private usedTokens:Array<string> = []       
        private pawnPositions:Map<number,number> = new Map()
 
        constructor(id:number,numOfPlayers:number,gameName:string){
            this.id = id;
            this.maxPlayers = numOfPlayers;
            this.gameName = gameName;
            
        }
        public join(player:Player){
          
            if (this.numOfPresentPlayers == this.maxPlayers || this.hasStarted){
                ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'room is full',{})
                return;
            }
          

            if (this.numOfPresentPlayers == this.maxPlayers){
                ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'room is full',{})
            }
            else{
                this.players.push(player)    
                 player.getAccount().setActiveInRoom(this)
                    player.setToken('')
                    for (let i = 1; i <= this.players.length;i++){
                        if (!this.usedTokens.includes('Player '+i) && player.getToken()==''){
                            player.setToken('Player '+ i)
                            this.usedTokens.push('Player '+ i)
                            this.numOfPresentPlayers++;        
                        }
                    }
                 }
          
         
            ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'join Room',{id:this.id.toString(),started:this.hasStarted,name:player.getAccount().getName()})
            GameManager.reloadTables()
           
            if (this.numOfPresentPlayers == 1 && player.getToken() != 'spectator'){
                this.playerOnTurn = this.players[0]
             }
        }

        public leave(player:Player){
            this.players = this.players.filter((t) => {return t != player});
            this.usedTokens= this.usedTokens.filter((t) => {return t != player.getToken()});
            this.numOfPresentPlayers--;
            player.getAccount().setActiveInRoom(undefined!)
            this.nextTurn()
            if (this.numOfPresentPlayers == 0){
                GameManager.getActiveRooms().delete(this.id)
            }
            ServerSocket.emitToRoom(this.id.toString(),'player left',{msg:player.getAccount().getName(),token:player.getToken()})
            GameManager.reloadTables()
        }
        
        public startGame(){
            this.setHasStarted(true)
            let r = this


           
    
            this.timeLeft = 120
            setInterval(function(){
                if (r.players.length > 0){
                    r.timeLeft--;
                    if (r.timeLeft == 0){
                        r.timeLeft = 120
                        ServerSocket.emitToRoom(r.id.toString(),'end turn',{})
                        r.nextTurn()
                        let stop = true
                        if (r.getPlayerOnTurn().getSkip() !=0){
                          ServerSocket.emitToRoom(r.id.toString(),'react to event: skip',{token: r.getPlayerOnTurn().getAccount().getName(),left:r.getPlayerOnTurn().getSkip()-1})
                          stop = false
                        }
                        while(!stop){
                       
                          if (r.getPlayerOnTurn().getSkip() ==0){
                               stop = true
                          }
                          else{
                            r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
                            r.nextTurn()
                       
                          }
                        }
                      
                        ServerSocket.emitToRoom(r.id.toString(),'turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                        ServerSocket.emitToRoom(r.getPlayerOnTurn().getAccount().getSocketId(),'turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                        
                        r.setReturnValue(-1)
                        r.setChoosedPawnId(-1)
                    }
                }
                
            },1000)
        }
      

        public nextTurn()
        {
            if (!this.gameEnded()){
                
                if (this.playerOnTurn.getRepeat()!=0){
                    this.playerOnTurn.setRepeat((this.playerOnTurn.getRepeat()-1))
                    ServerSocket.emitToRoom(this.id.toString(),'player repeat his turn',{name:this.playerOnTurn.getAccount().getName()})
                  
                }
                else{
                    if (this.lastPlayerId+1  >= this.players.length){
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
     
        public  getTimeLeft(){
            return this.timeLeft
        }
        public setTimeLeft(newTime:number){
            this.timeLeft = newTime
        }
        public  getLastDiceValue(){
            return this.lastDiceValue
        }
        public setLastDiceValue(newValue:number){
            this.lastDiceValue= newValue
        }
        
    }
