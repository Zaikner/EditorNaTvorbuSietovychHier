import {Account_db} from '../../services/db/RDG/Account_db.js'
import { AccountFinder } from '../../services/db/RDG/AccountFinder.js';
import{Account} from './Account.js'
var CryptoJS = require("crypto-js");
require("dotenv").config('.env')

class AccountManager{
    private static loggedAccounts:Array<Account> = []
    private static clientIds:Array<String> = []
    private static numberOfGuests:number = 0
    public static isValidRegistration(name:string,password:string,confirm:string){
        return password == confirm && this.isValidName(name)
    }
    public static async isValidName(name:string){
        let names =await AccountFinder.getIntance().findByName(name)
        if(names!.length != 0){
            return false
        }
        return true
    }
    public static encode(txt:string){
        return CryptoJS.AES.encrypt(txt, process.env.Secret).toString();
    }
    public static decode(txt:string){
        return CryptoJS.AES.decrypt(txt, process.env.Secret).toString(CryptoJS.enc.Utf8)
    }
    public static async register(name:string,password:string,confirm:string){
        let names =await AccountFinder.getIntance().findByName(name)
        if(names!.length != 0){    
            return false
        }
        else if(password != confirm){
            return false
        }
        else{
            let acc = new Account_db()
            acc.setName(name)
            acc.setPassword(this.encode(password))
            acc.insert()
            return true
        }
    }
    public static async authenticate(name:string,password:string){
        let accounts = await AccountFinder.getIntance().findByName(name)
     
        if(accounts!.length != 0){
            if (this.decode(accounts![0].getPassword())  == password && !this.isLogged(name)){
                
                return [true,this.login(accounts![0])]
            }
        }
        else{
            return [false,undefined]
        }
    }
    public static login(acc:Account_db){
        let newAcc = new Account(acc.getName(),acc.getPassword())
        newAcc.setAvatar(acc.getAvatar())
        newAcc.setClientId(this.createNewClientId())
        this.loggedAccounts.push(newAcc)
        return newAcc
    }
    public static logout(name:string){
        let lout:Account = undefined!;
        console.log('ucty su')
        console.log(this.loggedAccounts)
        this.loggedAccounts.forEach((acc:Account)=>{
            if (acc.getClientId() == name){
                lout = acc
                console.log('odlogol' + acc.getName())
            }
            else{
                console.log('nerovnaju sa')
                console.log(acc.getClientId())
                console.log(name)
            }
        })
        if (lout != undefined!){
            this.loggedAccounts = this.loggedAccounts.filter((acc:Account) => acc!=lout)
            this.clientIds = this.clientIds.filter((id) => id != name)
        }
     
    }
    public static logGuest(){
        let newAcc = new Account((this.numberOfGuests+1).toString(),'guestHaveNoPassword')
        this.numberOfGuests++;
        newAcc.setIsGuest(true)
        newAcc.setClientId(this.createNewClientId())
        this.loggedAccounts.push(newAcc)
        return newAcc
        

    }
    
    public static isLogged(name:string){
        let ret = false
        this.loggedAccounts.forEach((acc:Account) =>{
            if (acc.getName()===name){
                ret = true
            }
            console.log('Ucet sa rovna:'+acc.getName()===name+' ')
            
        })
        return ret
    }
    public static createNewClientId(){
        let ret = ''
        for (let i = 0; i < 12; i++){
            ret+=String.fromCharCode(Math.floor(Math.random()*20+65))
        }
        if (this.clientIds.includes(ret)){
            ret = this.createNewClientId()
        }
        return ret
    }
    public static getAccountByClientId(clientId:string){
        let ret = undefined
        this.loggedAccounts.forEach((acc:Account) =>{
            if (acc.getClientId()===clientId){
                ret = acc
            }
            console.log('PRe ucey s id : ' + clientId + ' nasiel ucet s nazvom ' + acc.getName())
            
        })
        return ret
    }
    public static async changePassword(name:string, newPassword:string, clientId:string){
        let accounts = await AccountFinder.getIntance().findByName(name)
        if (accounts!= undefined){
            console.log(accounts[0])
            accounts[0].setPassword(this.encode(newPassword))
            accounts[0].update();
            
        }
    
        
    }
    public static async changeAvatar(name:string, newAvatar:string){
        let accounts = await AccountFinder.getIntance().findByName(name)
        if (accounts!= undefined){
            
            accounts[0].setAvatar(newAvatar)
            //console.log(accounts[0])
            accounts[0].update();
            
        }
    }
    public static getLogedAccounts(){
        return this.loggedAccounts
    }

}
module.exports = AccountManager