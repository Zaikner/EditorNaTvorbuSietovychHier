import { DbConnect } from "../DbConnect";

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
                    text: 'SELECT o.id as option_id,o.text as option_text,o.question_id,o.is_answer,q.text as question_text,q.author_id FROM bachelors_thesis.questions as q inner join bachelors_thesis.options as o on q.id = o.question_id;',
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
                    text: 'SELECT o.id as option_id,o.text as option_text,o.question_id,o.is_answer,q.text as question_text,q.author_id FROM bachelors_thesis.questions as q inner join bachelors_thesis.options as o on q.id = o.question_id where q.id = $1;',
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
          public async findByAuthor(id:number){
            
            let client = DbConnect.get()
            try {
              
                const query = {
                    name: 'select-question-with-options-author ',
                    text: 'SELECT o.id as option_id, '+
                          'o.text as option_text, '+
                          'o.question_id, '+
                          'o.is_answer, '+
                          'q.text as question_text,'+
                          'q.author_id '+
                          'FROM bachelors_thesis.questions as q '+
                          'INNER JOIN bachelors_thesis.options as o '+
                          'ON q.id = o.question_id '+
                          'WHERE q.author_id = $1;',
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
          public deleteOptionsByQuestionId(questionId:number){
            let client = DbConnect.get()
                const query = {
                    name: 'delete-option',
                    text: 'DELETE FROM bachelors_thesis.options WHERE question_id = $1',
                    values: [questionId],
                  }
                  client
                  .query(query)
                  .then((res:any) => console.log(res.rows[0]))
                  .catch((e:Error) => console.error(e.stack))}
}