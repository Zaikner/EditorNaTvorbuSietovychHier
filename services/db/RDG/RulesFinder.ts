
import { DbConnect } from "../DbConnect";
import { Question } from "./Question";
import { Rules } from "./Rules";

export class RulesFinder{
    private static INSTANCE:RulesFinder = new RulesFinder()
    public static getIntance():RulesFinder{return this.INSTANCE}

    private constructor(){

    }
    

    public async findByGameId(id:number){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-rule-id',
                    text: 'SELECT * FROM "bachelorsThesis"."Rule" WHERE "gameId"=$1;',
                    values: [id],
                  }
                var results = await  client.query(query)
                var ret:Array<Rules> = []
              
                await results.rows.forEach((row:any) => {
              
                    ret.push(Rules.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
}