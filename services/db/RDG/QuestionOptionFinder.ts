import { DbConnect } from "../DbConnect"
import { QuestionOption } from "./QuestionOption"


export class QuestionOptionFinder{
    private static INSTANCE:QuestionOptionFinder = new QuestionOptionFinder()
    public static getIntance():QuestionOptionFinder{return this.INSTANCE}

    private constructor(){

    }
    

    // public async findAllByQuestionId(id:number){
    //         let client = DbConnect.get()
    //         try {
              
    //             const query = {
    //                 name: 'select-question-all-id',
    //                 text: 'SELECT * FROM "bachelorsThesis"."Option" WHERE "questionId"=$1;',
    //                 values: [id],
    //               }
    //             var results = await  client.query(query)
    //             var ret:Array<QuestionOption> = []
              
    //             await results.rows.forEach((row:any) => {
    //                 console.log('precital')
    //                 ret.push(QuestionOption.load(row))
    //             });
               
    //             return ret
        
    //         }
    //         catch(err){
    //           console.log("Connection failed")
    //         } 
    //       }
    //       public async findById(id:number){
    //         let client = DbConnect.get()
    //         try {
              
    //             const query = {
    //                 name: 'select-question-all-id',
    //                 text: 'SELECT * FROM "bachelorsThesis"."Option" WHERE id"=$1;',
    //                 values: [id],
    //               }
    //             var results = await  client.query(query)
    //             var ret:Array<QuestionOption> = []
              
    //             await results.rows.forEach((row:any) => {
    //                 console.log('precital')
    //                 ret.push(QuestionOption.load(row))
    //             });
               
    //             return ret
        
    //         }
    //         catch(err){
    //           console.log("Connection failed")
    //         } 
    //       }

         
}