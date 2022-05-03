import { DbConnect } from "../DbConnect";
import { Question } from "./Question";
import { QuestionOption } from "./QuestionOption";
import { QuestionWithAnswers } from "./QuestionsWithAnswers";


export class QuestionWithAnswersFinder{
    private static INSTANCE:QuestionWithAnswersFinder = new QuestionWithAnswersFinder()
    public static getInstance():QuestionWithAnswersFinder{return this.INSTANCE}

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
                   
                    ret.push(QuestionWithAnswers.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
        
          public async findById(id:number){
            
            let client = DbConnect.get()
            try {
              
                const query = {
                    name: 'select-question-with-answer-id',
                    text: 'SELECT o.id as "optionId",o.text as "optionText",o."questionId",o."isAnswer",q.text as "questionText",q.author FROM "bachelorsThesis"."Question" as q inner join "bachelorsThesis"."Option" as o on q.id = o."questionId" where q.id = $1;',
                    values: [id],
                  }
                var results = await  client.query(query)
                var ret:Array<QuestionWithAnswers> = []
              
                await results.rows.forEach((row:any) => {
              
                    ret.push(QuestionWithAnswers.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log(err)
              console.log("Connection failed")
            } 
          }
          public async findByAuthor(author:string){
            
            let client = DbConnect.get()
            try {
              
                const query = {
                    name: 'select-question-with-answer-Author',
                    text: 'SELECT o.id as "optionId",o.text as "optionText",o."questionId",o."isAnswer",q.text as "questionText",q.author FROM "bachelorsThesis"."Question" as q inner join "bachelorsThesis"."Option" as o on q.id = o."questionId" where q.author = $1;',
                    values: [author],
                  }
                var results = await  client.query(query)
                var ret:Array<QuestionWithAnswers> = []
              
                await results.rows.forEach((row:any) => {
              
                    ret.push(QuestionWithAnswers.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log(err)
              console.log("Connection failed")
            } 
          }
          public deleteOptionsByQuestionId(questionId:number){
            let client = DbConnect.get()
                const query = {
                    name: 'delete-option',
                    text: 'DELETE FROM "bachelorsThesis"."Option" WHERE "questionId" = $1',
                    values: [questionId],
                  }
                  client
                  .query(query)
                  .then((res:any) => console.log(res.rows[0]))
                  .catch((e:Error) => console.error(e.stack))}
}