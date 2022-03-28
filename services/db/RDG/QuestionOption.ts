
import { DbConnect } from "../DbConnect";

export class QuestionOption{
    private id:number = 0
    private text:string = '';
    private questionId:number = 0;
    private isAnswer:boolean = true;
    constructor(){

    }

    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
    public getQuestionId() : number {
        return this.questionId
    }
    public setQuestionId(newId:number){
        this.questionId  = newId
    }
 
    public getText() : string {
        return this.text
    }
    public setText(newName:string){
        this.text  = newName
    }
    public getIsAnswer() : boolean {
        return this.isAnswer
    }
    public setIsAnswer(newAnswer:boolean){
        this.isAnswer  = newAnswer
    }
   
   
        
    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-option',
                text: 'INSERT INTO "bachelorsThesis"."Option"(text,"questionId","isAnswer") VALUES($1,$2,$3);',
                values: [this.text,this.questionId,this.isAnswer],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}

    public update(){
                let client = DbConnect.get()
                console.log('updatol')
                console.log(this)
                    const query = {
                        name: 'update-option',
                        
                        text: 'UPDATE "bachelorsThesis"."Option" SET text = $1, "isAnswer" = $2, "questionId" = $3 WHERE id = $4;',
                        values: [this.text,this.isAnswer,this.questionId,this.id],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}

    public delete(){
                        let client = DbConnect.get()
                        console.log('updatol')
                        console.log(this)
                            const query = {
                                name: 'update-option',
                                
                                text: 'DELETE FROM "bachelorsThesis"."Option" WHERE id = $1;',
                                values: [this.id],
                              }
                              client
                              .query(query)
                              .then((res:any) => console.log(res.rows[0]))
                              .catch((e:Error) => console.error(e.stack))}

    
    public static load(data:any){
                let ret = new QuestionOption()
                ret.setId(data.id)
                ret.setQuestionId(data.questionId)
                ret.setText(data.text)
                ret.setIsAnswer(data.isAnswer)
                return ret
                }
    
}