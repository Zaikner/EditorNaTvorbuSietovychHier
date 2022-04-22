
import { DbConnect } from "../DbConnect";

export class Game_db{
    private id:number = 0;
    private name:string = '';
    private author:string = '';
    private numOfPlayers:number = 0;
    private nextTilesIds:Array<string> = []
    constructor(){

    }

    
    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
    public getNumOfPlayers() : number {
        return this.numOfPlayers
    }
    public setNumOfPlayers(newNum:number){
        this.numOfPlayers  = newNum
    }
      
    public getName() : string {
        return this.name
    }
    public setName(newName:string){
        this.name  = newName
    }
    public getAuthor() : string {
        return this.author
    }
    public setAuthor(newAuthor:string){
        this.author  = newAuthor
    }
    public setNextTilesIds(newIds:Array<string>){
        this.nextTilesIds= newIds
    }
    public getNextTilesIds(){
        return this.nextTilesIds
    }
    
    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-game',
                text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers","nextTilesIds") VALUES($1,$2,$3,$4);',
                values: [this.name,this.author,this.numOfPlayers,this.nextTilesIds],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}

      
    public upsert(){
                let client = DbConnect.get()
                    const query = {
                        name: 'upsert-game',
                        
                        text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers","nextTilesIds") VALUES($1,$2,$3,$4)  ON CONFLICT(name) DO UPDATE SET name = EXCLUDED.name, author = EXCLUDED.author,"numOfPlayers" = EXCLUDED."numOfPlayers","nextTilesIds"= EXCLUDED."nextTilesIds";',
                        values: [this.name,this.author,this.numOfPlayers,this.nextTilesIds],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}
                
        

    public static load(data:any){
                let ret = new Game_db()
                ret.setId(data.id)
                ret.setName(data.name)
                ret.setAuthor(data.author)
                ret.setNumOfPlayers(data.numOfPlayers)
                ret.setNextTilesIds(data.nextTilesIds)
                return ret
                }
    
}