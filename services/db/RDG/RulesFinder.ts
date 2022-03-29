
import { DbConnect } from "../DbConnect";
import { Question } from "./Question";
import { Rules } from "./Rules";

export class RulesFinder{
    private static INSTANCE:RulesFinder = new RulesFinder()
    public static getIntance():RulesFinder{return this.INSTANCE}

    private constructor(){

    }
    

    public async findByName(name:string){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-question-id',
                    text: 'SELECT * FROM "bachelorsThesis"."Rule" WHERE "gameName"=$1;',
                    values: [name],
                  }
                var results = await  client.query(query)
                var ret:Array<Rules> = []
              
                await results.rows.forEach((row:any) => {
                    console.log('precital')
                    ret.push(Rules.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
}