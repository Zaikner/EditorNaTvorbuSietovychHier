import { DbConnect } from "../DbConnect";
import { Account_db } from "./Account_db";
import { Pawn } from "./Pawn";
export class PawnFinder{
    private static INSTANCE:PawnFinder = new PawnFinder()
    public static getIntance():PawnFinder{return this.INSTANCE}

    private constructor(){

    }
    public async findByGameId(id:number){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-pawn-find-name',
                text: 'SELECT p."tileId",p.id,p.player,p.color,p.image FROM "bachelorsThesis"."Pawn" as p INNER JOIN "bachelorsThesis"."Tile" as t on t.id = p."tileId" WHERE t."gameId" = $1',
                values: [id],
               
              }
            var results = await  client.query(query)
            var ret:Array<Pawn> = []
          
            await results.rows.forEach((row:any) => {
               
                ret.push(Pawn.load(row))
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
                name: 'delete-pawn-by-name',
                text: 'DELETE FROM "bachelorsThesis"."Pawn" where id in (SELECT p.id FROM "bachelorsThesis"."Pawn" as p INNER JOIN "bachelorsThesis"."Tile" as t on t.id = p."tileId" WHERE t."gameName" = $1)',
                values: [name],
               
              }
            var results = await  client.query(query)
            var ret:Array<Pawn> = []
          
            await results.rows.forEach((row:any) => {
               
                ret.push(Pawn.load(row))
            });
           
            return ret
    
        }
        catch(err){
          console.log("Connection failed Pawn")
        } 
      }
       
}