
import { DbConnect } from "../DbConnect";

export class Question{
    private id:number = 0;
    private text:string = '';
    private authorId:number = 0;;
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
    public getAuthorId() : number {
        return this.authorId
    }
    public setAuthorId(newAuthor:number){
        this.authorId  = newAuthor
    }
       
    
    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-question',
                text: 'INSERT INTO bachelors_thesis.questions(id,text,author_id) VALUES($1,$2,$3);',
                values: [this.id,this.text,this.authorId],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}
    public upsert(){
                let client = DbConnect.get()
                    const query = {
                        name: 'upsert-question',
                        text: 'INSERT INTO bachelors_thesis.questions(id,text,author_id) VALUES($1,$2,$3)  ON CONFLICT(id) DO UPDATE SET id = EXCLUDED.id, text = EXCLUDED.text, author_id = EXCLUDED.author_id',
                        values: [this.id,this.text,this.authorId],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}
        
    public update(){
                let client = DbConnect.get()
                    const query = {
                        name: 'update-question',
                        
                        text: 'UPDATE bachelors_thesis.questions SET text = $1 ,author_id = $2 WHERE id = $3;',
                        values: [this.text,this.authorId,this.id],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}
    public delete(){
                        let client = DbConnect.get()
                            const query = {
                                name: 'delete-question',
        
                                text: 'DELETE from bachelors_thesis.questions WHERE id = $1;',
                                values: [this.id],
                              }
                              client
                              .query(query)
                              .then((res:any) => console.log(res.rows[0]))
                              .catch((e:Error) => console.error(e.stack))}


    public static load(data:any){
                let ret = new Question()
                ret.setId(data.id)
                ret.setText(data.text)
                ret.setAuthorId(data.author_id)
                return ret
                }
    
}