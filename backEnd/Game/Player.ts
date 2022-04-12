import { Account } from "../Accounts/Account";

export class Player{
        private id:number = 0;
        private account:Account;
        private token:string = '';
        private place:number = 0;

        constructor(account:Account,token:string){
            //this.id = id;
            this.account = account;
        
          
        }
        //constructor(){}


        public getId() : number {
            return this.id
        }
        public setId(newId:number){
            this.id = newId
        }
        public getPlace() : number {
            return this.place
        }
        public setPlace(newPlace:number){
            this.place = newPlace
        }

        public getAccount() : Account {
            return this.account
        }
        public setAccount(newAccount:Account){
            this.account = newAccount
        }
       

        public getToken() : string {
            return this.token
        }
        public setToken(token:string){
            this.token  = token
        }
     
    }

module.exports = Player