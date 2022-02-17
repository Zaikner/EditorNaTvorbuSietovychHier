import {Account} from '../services/db/RDG/Account.js'
import { AccountFinder } from '../services/db/RDG/AccountFinder.js';
var CryptoJS = require("crypto-js");
require("dotenv").config('.env')

class AccountManager{
    private loggedAccounts = []
    public static isValidRegistration(name:string,password:string,confirm:string){
        return password == confirm && this.isValidName(name)
    }
    public static async isValidName(name:string){
        let names =await AccountFinder.getIntance().findByName(name)
        if(names.length != 0){
            return false
        }
        console.log('nasiel:'+names)
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
        if(names.length != 0){
            console.log('vela')          
            return false
        }
        else if(password != confirm){
            return false
        }
        else{
            let acc = new Account()
            acc.setName(name)
            acc.setPassword(this.encode(password))
            acc.insert()
            return true
        }
    }
    public static async authenticate(name:string,password:string){
        let accounts = await AccountFinder.getIntance().findByName(name)
    
        if(accounts.length != 0){
            if (this.decode(accounts[0].password)  == password ){
                return true
            }
           
        }
        else{
            console.log('prazdne')
            return false
        }
    }
    public static login(name:string){

    }

}
module.exports = AccountManager