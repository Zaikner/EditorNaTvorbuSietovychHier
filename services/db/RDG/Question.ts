
import { DbConnect } from "../DbConnect";

export class Question{
    private id:number = 0;
    private text:string = '';
    private author:string = '';
    constructor(){

    }

    
    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
 
    public getText() : string {
        return this.text
    }
    public setText(newName:string){
        this.text  = newName
    }
    public getAuthor() : string {
        return this.author
    }
    public setAuthor(newAuthor:string){
        this.author  = newAuthor
    }
       
    
    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-question',
                text: 'INSERT INTO "bachelorsThesis"."Question"(id,text,author) VALUES($1,$2,$3);',
                values: [this.id,this.text,this.author],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}
    public upsert(){
                let client = DbConnect.get()
                    const query = {
                        name: 'upsert-question',
                        text: 'INSERT INTO "bachelorsThesis"."Question"(id,text,author) VALUES($1,$2,$3)  ON CONFLICT(id) DO UPDATE SET id = EXCLUDED.id, text = EXCLUDED.text, author = EXCLUDED.author',
                        values: [this.id,this.text,this.author],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}
        
    public update(){
                let client = DbConnect.get()
                    const query = {
                        name: 'update-question',
                        
                        text: 'UPDATE "bachelorsThesis"."Question" SET text = $1 ,author = $2 WHERE id = $3;',
                        values: [this.text,this.author,this.id],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}


    public static load(data:any){
                let ret = new Question()
                ret.setId(data.id)
                ret.setText(data.text)
                ret.setAuthor(data.author)
                return ret
                }
    
}