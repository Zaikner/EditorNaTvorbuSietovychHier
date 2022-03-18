
import { DbConnect } from "../DbConnect";

export class QuestionWithAnswers{
    private questionId:number = 0;
    private optionId:number = 0;
    private questionText:string = '';
    private optionText:string = '';
    private author:string = '';
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
    public getAuthor() : string {
        return this.author
    }
    public setAuthor(newAuthor:string){
        this.author  = newAuthor
    }
    public getIsAnswer() : boolean {
        return this.isAnswer
    }
    public setIsAnswer(newAnswer:boolean){
        this.isAnswer  = newAnswer
    }

    public static load(data:any){
     
        console.log(data)
                let ret = new QuestionWithAnswers()
                ret.setQuestionId(data.questionId)
                ret.setOptionId(data.optionId)
                ret.setQuestionText(data.questionText)
                ret.setOptionText(data.optionText)
                ret.setAuthor(data.author)
                ret.setIsAnswer(data.isAnswer)
                return ret
                }
    
}