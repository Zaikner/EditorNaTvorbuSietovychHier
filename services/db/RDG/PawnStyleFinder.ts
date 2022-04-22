import { DbConnect } from "../DbConnect";
import { Account_db } from "./Account_db";
import { PawnStyles } from "./PawnStyle";
export class PawnStyleFinder{
    private static INSTANCE:PawnStyleFinder = new PawnStyleFinder()
    public static getIntance():PawnStyleFinder{return this.INSTANCE}

    private constructor(){

    }
    public async findByName(name:string){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-pawn-style',
                text: 'SELECT * FROM "bachelorsThesis"."PawnStyle" WHERE "gameName" = $1',
                values: [name],
              }
            var results = await  client.query(query)
            var ret:Array<PawnStyles> = []
          
            await results.rows.forEach((row:any) => {
            
                ret.push(PawnStyles.load(row))
            });
           
            return ret
    
        }
        catch(err){
          console.log("Connection failed")
        } 
      }
  public async deleteByName(name:string){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-pawn-style',
                text: 'DELETE FROM "bachelorsThesis"."PawnStyle" WHERE "gameName" = $1',
                values: [name],
              }
            var results = await  client.query(query)
            var ret:Array<PawnStyles> = []
          
            await results.rows.forEach((row:any) => {
            
                ret.push(PawnStyles.load(row))
            });
           
            return ret
    
        }
        catch(err){
          console.log("Connection failed Styles")
        } 
      }
       
}