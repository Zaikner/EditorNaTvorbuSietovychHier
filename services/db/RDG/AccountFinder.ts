import { DbConnect } from "../DbConnect";
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
            return results.rows
    
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
            return results.rows
    
        }
        catch(err){
          console.log("Connection failed")
        } 
      }
       
}