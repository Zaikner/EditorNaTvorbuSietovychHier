import { DbConnect } from "../DbConnect";
import { Account_db } from "./Account_db";
import { PawnStyles } from "./PawnStyle";
export class PawnStyleFinder{
    private static INSTANCE:PawnStyleFinder = new PawnStyleFinder()
    public static getIntance():PawnStyleFinder{return this.INSTANCE}

    private constructor(){

    }
    public async findByGameId(id:number){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-pawn-style',
                text: 'SELECT * FROM bachelors_thesis.pawn_styles WHERE game_id = $1',
                values: [id],
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
  public async deleteById(id:number){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'delete-pawn-style',
                text: 'DELETE FROM bachelors_thesis.pawn_styles WHERE game_id = $1',
                values: [id],
              }
            var results = await  client.query(query)
            var ret:Array<PawnStyles> = []
          
            await results.rows.forEach((row:any) => {
            
                ret.push(PawnStyles.load(row))
            });
           
            return ret
    
        }
        catch(err){
          console.log(err)
          console.log("Connection failed Styles")
        } 
      }
       
}