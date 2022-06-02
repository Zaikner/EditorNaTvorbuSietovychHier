
import { DbConnect } from "../DbConnect";

export class Rules{
    private id:number = 0;
    private text:string = '';
    private gameId:number = 0;

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
    public getGameId() : number {
        return this.gameId
    }
    public setGameId(newId:number){
        this.gameId  = newId
    }
       
    
    public upsert(){
        let client = DbConnect.get()
            const query = {
                name: 'upsert-rules',
                text: 'INSERT INTO bachelors_thesis.rules(text,game_id) VALUES($1,$2) ON CONFLICT(game_id) DO UPDATE SET text = EXCLUDED.text,game_id=EXCLUDED.game_id;',
                values: [this.text,this.gameId],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}

    public static load(data:any){
                let ret = new Rules()
                ret.setId(data.id)
                ret.setText(data.text)
                ret.setGameId(data.game_id)
                return ret
                }
    
}