import { DbConnect } from "../DbConnect";
import { Account_db } from "./Account_db";
export class AccountFinder{
    private static INSTANCE:AccountFinder = new AccountFinder()
    public static getIntance():AccountFinder{return this.INSTANCE}

    private constructor(){

    }
    public async findByName(name:string){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-account-name',
                text: 'SELECT * FROM "bachelorsThesis"."Account" WHERE name=$1;',
                values: [name],
              }
            var results = await  client.query(query)
            var ret:Array<Account_db> = []
          
            await results.rows.forEach((row:any) => {
         
                ret.push(Account_db.load(row))
            });
           
            return ret
    
        }
        catch(err){
          console.log("Connection failed")
        } 
      }
      public async findByNameAndPassword(name:string,password:string){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-account-name-password',
                text: 'SELECT * FROM "bachelorsThesis"."Account" WHERE name=$1 AND password=$2;',
                values: [name,password],
              }
            var results = await  client.query(query)
            var ret:Array<Account_db> = []
            results.rows.forEach((row:any) => {
                ret.push(Account_db.load(row))
            });
            return ret
        }
        catch(err){
          console.log("Connection failed")
        } 
      }
      public async findAllByOrderedScore(){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-account-name-password',
                text: 'SELECT * FROM "bachelorsThesis"."Account" ORDER BY score DESC;',
                values: [],
              }
            var results = await  client.query(query)
            var ret:Array<Account_db> = []
            results.rows.forEach((row:any) => {
                ret.push(Account_db.load(row))
            });
            return ret
        }
        catch(err){
          console.log("Connection failed")
        } 
      }
       
}