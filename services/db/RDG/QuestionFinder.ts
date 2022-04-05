import { DbConnect } from "../DbConnect";
import { Question } from "./Question";

export class QuestionFinder{
    private static INSTANCE:QuestionFinder = new QuestionFinder()
    public static getIntance():QuestionFinder{return this.INSTANCE}

    private constructor(){

    }
    

    public async findById(id:number){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-question-id',
                    text: 'SELECT * FROM "bachelorsThesis"."Question" WHERE id=$1;',
                    values: [id],
                  }
                var results = await  client.query(query)
                var ret:Array<Question> = []
              
                await results.rows.forEach((row:any) => {
               
                    ret.push(Question.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
    public async findWithLastId(){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-question-id',
                    text: 'SELECT * FROM "bachelorsThesis"."Question" ORDER BY id DESC LIMIT 1;',
                    values: [],
                  }
                var results = await  client.query(query)
                var ret:Array<Question> = []
               
                await results.rows.forEach((row:any) => {
              
                    ret.push(Question.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
}