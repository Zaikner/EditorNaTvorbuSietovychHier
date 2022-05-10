
import { DbConnect } from "../DbConnect";

export class QuestionWithOptions{
    private questionId:number = 0;
    private optionId:number = 0;
    private questionText:string = '';
    private optionText:string = '';
    private authorId:number = 0;
    private isAnswer:boolean = false;
    constructor(){

    }

    
    public getQuestionId() : number {
        return this. questionId
    }
    public setQuestionId(newId:number){
        this. questionId  = newId
    }
    public getOptionId() : number {
        return this.optionId
    }
    public setOptionId(newId:number){
        this.optionId  = newId
    }
 
    public getOptionText() : string {
        return this.optionText
    }
    public setOptionText(newText:string){
        this.optionText  = newText
    }
    public getQuestionText() : string {
        return this.questionText
    }
    public setQuestionText(newText:string){
        this.questionText  = newText
    }
    public getAuthorId() : number {
        return this.authorId
    }
    public setAuthorId(newAuthor:number){
        this.authorId  = newAuthor
    }
    public getIsAnswer() : boolean {
        return this.isAnswer
    }
    public setIsAnswer(newAnswer:boolean){
        this.isAnswer  = newAnswer
    }

    
    
    public static load(data:any){
     
      
                let ret = new QuestionWithOptions()
                ret.setQuestionId(data.question_id)
                ret.setOptionId(data.option_id)
                ret.setQuestionText(data.question_text)
                ret.setOptionText(data.option_text)
                ret.setAuthorId(data.author_id)
                ret.setIsAnswer(data.is_answer)
                return ret
                }
    
}