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
        private spectators:Array<Player>=[]
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

        // public  async initGameData(){
        //     this.gameData = await GameManager.loadGame(this.gameName)
        //     //console.log('zavolal initGameData')
        //     //console.log(this.gameData)
        // }
        public join(player:Player){
            //console.log('skusil join')
            //console.log(this.hasStarted)
            if (this.numOfPresentPlayers == this.maxPlayers || this.hasStarted){
                //console.log('nepustil')
                ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'room is full',{})
                return;
            }
            //console.log('aktivoval room join')
            if (player.getToken() != 'spectator'){

                if (this.numOfPresentPlayers == this.maxPlayers){
                    ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'room is full',{})
                    player.setToken('spectator')
                    this.spectators.push(player)
                    //console.log('premenil na spectator')
                }
                else{
                    this.players.push(player)
                    //console.log('aspon zavoalal pridelenie tokenu')
                    player.getAccount().setActiveInRoom(this)
                    player.setToken('')
                    for (let i = 1; i <= this.players.length;i++){
                        if (!this.usedTokens.includes('Player '+i) && player.getToken()==''){
                            player.setToken('Player '+ i)
                            this.usedTokens.push('Player '+ i)
                            this.numOfPresentPlayers++;
                            //console.log('pridelil token:' + player.getToken())
                        }
                        else{
                            //console.log('nechcel Player '+i)
                        }
                    }
                  
                    
                 }
               
            }
            else{
                this.spectators.push(player)
            }
         
            ServerSocket.emitToSpecificSocket(player.getAccount().getSocketId(),'join Room',{id:this.id.toString(),started:this.hasStarted,name:player.getAccount().getName()})
            //console.log(' joinol a emitol playerovi: '+ player.getAccount().getSocketId())
           
            if (this.numOfPresentPlayers == 1 && player.getToken() != 'spectator'){
                this.playerOnTurn = this.players[0]
             }
        }

        public leave(player:Player){
            
            if (player.getToken() != 'spectator'){
                this.players = this.players.filter((t) => {return t != player});
                this.usedTokens= this.usedTokens.filter((t) => {return t != player.getToken()});
                this.numOfPresentPlayers--;
                player.getAccount().setActiveInRoom(undefined!)
                this.nextTurn()
            }
            else{
                this.spectators = this.spectators.filter((t) => {return t != player});
            }
            if (this.numOfPresentPlayers == 0){

                GameManager.getActiveRooms().delete(this.id)
            
            }
            ServerSocket.emitToRoom(this.id.toString(),'player left',{msg:player.getAccount().getName(),token:player.getToken()})
            
            //'player left',(msg:{msg:string})
        }
        
        public startGame(){
            this.setHasStarted(true)
            let r = this
            this.timeLeft = 120
            setInterval(function(){
                if (r.players.length > 0){

                    r.timeLeft--;
                    //console.log('time left --->' + r.timeLeft)
                    if (r.timeLeft == 0){
                        r.timeLeft = 120
                        //console.log('ended turn')
                        ServerSocket.emitToRoom(r.id.toString(),'end turn',{})
                        r.nextTurn()
                        let stop = true
                        if (r.getPlayerOnTurn().getSkip() !=0){
                          //r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
                          ServerSocket.emitToRoom(r.id.toString(),'react to event: skip',{token: r.getPlayerOnTurn().getAccount().getName(),left:r.getPlayerOnTurn().getSkip()-1})
                          stop = false
                        }
                        while(!stop){
                          ////console.log('skipped:' + r.getPlayerOnTurn().getAccount().getName())
                          ////console.log('skipped:' + r.getPlayerOnTurn().getSkip())
                          
                          
                          if (r.getPlayerOnTurn().getSkip() ==0){
                               stop = true
                          }
                          else{
                            r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
                            r.nextTurn()
                            //this.io.in(msg.room).emit('react to event: skip',{token: r.getPlayerOnTurn().getToken(),left:r.getPlayerOnTurn().getSkip()})
                          }
                        }
                        ////console.log('ide:'+ r.getPlayerOnTurn().getAccount().getName())
                        //////console.log(r)
                   
                        ServerSocket.emitToRoom(r.id.toString(),'turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                        ServerSocket.emitToRoom(r.getPlayerOnTurn().getAccount().getSocketId(),'turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
                        
                        r.setReturnValue(-1)
                        r.setChoosedPawnId(-1)
                        //ServerSocket.emitToRoom(r.id.toString(),'show Dice value',{value:r.getLastDiceValue()})
                    }
                }
                
            },1000)
        }
        public broadcast(msg:string){

        }

        public nextTurn()
        {
            //console.log('teraz je next ID :')
            //console.log(this.playerOnTurn)
            //console.log(this.lastPlayerId)
            if (!this.gameEnded()){
                
                if (this.playerOnTurn.getRepeat()!=0){
                    this.playerOnTurn.setRepeat((this.playerOnTurn.getRepeat()-1))
                    ServerSocket.emitToRoom(this.id.toString(),'player repeat his turn',{name:this.playerOnTurn.getAccount().getName()})
                    //console.log('zopakoval')
                    //console.log(this.playerOnTurn.getRepeat())
                }
                else{
                    if (this.lastPlayerId+1  >= this.players.length){
                        this.lastPlayerId = 0
                    }
                    else{
                        this.lastPlayerId++;
                    }
                    this.playerOnTurn = this.players[this.lastPlayerId]
                    
            //console.log('teraz je next ID :')
            //console.log(this.playerOnTurn)
            //console.log(this.lastPlayerId)

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
