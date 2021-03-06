import { DbConnect } from "../DbConnect"
import { QuestionOption } from "./QuestionOption"


export class QuestionOptionFinder{
    private static INSTANCE:QuestionOptionFinder = new QuestionOptionFinder()
    public static getIntance():QuestionOptionFinder{return this.INSTANCE}

    private constructor(){

    }
    public async findWithLastId(){
        let client = DbConnect.get()
        try {
            const query = {
                name: 'select-option-id',
                text: 'SELECT * FROM bachelors_thesis.options ORDER BY id DESC LIMIT 1;',
                values: [],
              }
            var results = await  client.query(query)
            var ret:Array<QuestionOption> = []
           
            await results.rows.forEach((row:any) => {
          
                ret.push(QuestionOption.load(row))
            });
           
            return ret
    
        }
        catch(err){
          console.log("Connection failed")
        } 
      }         
}