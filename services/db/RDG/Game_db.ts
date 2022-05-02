
import { DbConnect } from "../DbConnect";

export class Game_db{
    private id:number = 0;
    private name:string = '';
    private author:string = '';
    private numOfPlayers:number = 0;
    private nextTilesIds:Array<string> = []
    private initSizeX:number = 0;
    private initSizeY:number = 0;
    private isPublished:boolean = false;
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
    getInitSizeX(){
        return this.initSizeX
    }
    setInitSizeX(newCoord:number){
        return this.initSizeX = newCoord
    }
    getInitSizeY(){
        return this.initSizeY
    }
    setInitSizeY(newCoord:number){
        return this.initSizeY = newCoord
    }
    setIsPublished(is:boolean){
        this.isPublished = is
    }
    getIsPublished(){
        return this.isPublished
    }
    
    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-game',
                text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers","nextTilesIds","initSizeX","initSizeY","isPublished") VALUES($1,$2,$3,$4,$5,$6,$7);',
                values: [this.name,this.author,this.numOfPlayers,this.nextTilesIds,this.initSizeX,this.initSizeY,this.isPublished],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}

      
    public upsert(){
                let client = DbConnect.get()
                    const query = {
                        name: 'upsert-game',
                        
                        text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers","nextTilesIds","initSizeX","initSizeY","isPublished") VALUES($1,$2,$3,$4,$5,$6,$7)  ON CONFLICT(name) DO UPDATE SET name = EXCLUDED.name, author = EXCLUDED.author,"numOfPlayers" = EXCLUDED."numOfPlayers","nextTilesIds"= EXCLUDED."nextTilesIds","initSizeX"=EXCLUDED."initSizeX","initSizeY"=EXCLUDED."initSizeY","isPublished"=EXCLUDED."isPublished";',
                        values: [this.name,this.author,this.numOfPlayers,this.nextTilesIds,this.initSizeX,this.initSizeY,this.isPublished],
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
                ret.setInitSizeX(data.initSizeX)
                ret.setInitSizeY(data.initSizeY)
                ret.setIsPublished(data.isPublished)
                return ret
                }
    
}