import { Account } from "../Accounts/Account";

export class Room{
        private id:number = 0;
        private socketId:string = '';
        private numOfPlayers:number = 0;
        private players:Array<Account> = []
        private gameName:string = ''

        constructor(id:number,numOfPlayers:number,gameName:string){
            this.id = id;
            this.numOfPlayers = numOfPlayers;
            this.gameName = gameName;
        }
        //constructor(){}


        public getId() : number {
            return this.id
        }
        public setId(newId:number){
            this.id = newId
        }

        public getNumOfPlayers() : number {
            return this.numOfPlayers
        }
        public setNumOfPlayers(newNum:number){
            this.numOfPlayers = newNum
        }
        public getPlayers(){
            return this.players
        }
        public setPlayers(newPlayers:Array<Account>){
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

module.exports = Room