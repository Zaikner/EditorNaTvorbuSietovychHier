import { DbConnect } from "../DbConnect";
import { Question } from "./Question";
import { QuestionOption } from "./QuestionOption";
import { QuestionWithAnswers } from "./QuestionsWIthAnswers";

export class QuestionWithAnswersFinder{
    private static INSTANCE:QuestionWithAnswersFinder = new QuestionWithAnswersFinder()
    public static getIntance():QuestionWithAnswersFinder{return this.INSTANCE}

    private constructor(){

    }
    
    public async findAll(){
            let client = DbConnect.get()
            try {
              
                const query = {
                    name: 'select-question-with-answer-all-id',
                    text: 'SELECT o.id as "optionId",o.text as "optionText",o."questionId",o."isAnswer",q.text as "questionText",q.author FROM "bachelorsThesis"."Question" as q inner join "bachelorsThesis"."Option" as o on q.id = o."questionId";',
                    values: [],
                  }
                var results = await  client.query(query)
                var ret:Array<QuestionWithAnswers> = []
              
                await results.rows.forEach((row:any) => {
                    console.log('precital')
                    ret.push(QuestionWithAnswers.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }

         
}