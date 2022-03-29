
import { DbConnect } from "../DbConnect";

export class Rules{
    private id:number = 0;
    private text:string = '';
    private gameName:string = '';

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
    public getGameName() : string {
        return this.gameName
    }
    public setGameName(newName:string){
        this.gameName  = newName
    }
       
    
    public upsert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-rules',
                text: 'INSERT INTO "bachelorsThesis"."Rule"(text,"gameName") VALUES($1,$2);',
                values: [this.text,this.gameName],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}

    // public update(){
    //             let client = DbConnect.get()
    //                 const query = {
    //                     name: 'update-rules',
                        
    //                     text: 'UPDATE "bachelorsThesis"."Rules" SET text = $1 WHERE id = $2;',
    //                     values: [this.text,this.id],
    //                   }
    //                   client
    //                   .query(query)
    //                   .then((res:any) => console.log(res.rows[0]))
    //                   .catch((e:Error) => console.error(e.stack))}


    public static load(data:any){
                let ret = new Rules()
                ret.setId(data.id)
                ret.setText(data.text)
                ret.setGameName(data.gameName)
                return ret
                }
    
}