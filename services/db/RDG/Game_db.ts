
import { BlobOptions } from "buffer";
import { DbConnect } from "../DbConnect";

export class Game_db{
    private id:number = 0;
    private name:string = '';
    private authorId:number = 0;
    private numOfPlayers:number = 0;
    private nextTilesIds:Array<string> = []
    private initSizeX:number = 0;
    private initSizeY:number = 0;
    private isPublished:boolean = false;
    private toogleNumber:boolean = false
    private numOfPawnsPerTile:number = 0
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
    public getAuthorId() : number {
        return this.authorId
    }
    public setAuthorId(newAuthor:number){
        this.authorId  = newAuthor
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
    public setToogleNumber(is : boolean) {
        this.toogleNumber = is;
    }
    public getToggleNumber(){
        return this.toogleNumber}
    
    setNumOfPawnsPerTile(num:number){
        this.numOfPawnsPerTile = num
    }
    getNumOfPawnsPerTile()
    {return this.numOfPawnsPerTile}
    // public insert(){
    //     let client = DbConnect.get()
    //         const query = {
    //             name: 'insert-game',
    //             text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers","nextTilesIds","initSizeX","initSizeY","isPublished","toogleNumber") VALUES($1,$2,$3,$4,$5,$6,$7,$8);',
    //             values: [this.name,this.author,this.numOfPlayers,this.nextTilesIds,this.initSizeX,this.initSizeY,this.isPublished,this.toogleNumber],
    //           }
    //           client
    //           .query(query)
    //           .then((res:any) => console.log(res.rows[0]))
    //           .catch((e:Error) => console.error(e.stack))}

      
    public upsert(){
                let client = DbConnect.get()
                    const query = {
                        name: 'upsert-game',
                        
                        text: 'INSERT INTO "bachelorsThesis"."Game"(id,name,"authorId","numOfPlayers","nextTilesIds","initSizeX","initSizeY","isPublished","toogleNumber","numOfPawnsPerTile") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)  ON CONFLICT(id) DO UPDATE SET name = EXCLUDED.name, "authorId" = EXCLUDED."authorId","numOfPlayers" = EXCLUDED."numOfPlayers","nextTilesIds"= EXCLUDED."nextTilesIds","initSizeX"=EXCLUDED."initSizeX","initSizeY"=EXCLUDED."initSizeY","isPublished"=EXCLUDED."isPublished","toogleNumber" = EXCLUDED."toogleNumber", "numOfPawnsPerTile" = EXCLUDED."numOfPawnsPerTile";',
                        values: [this.id,this.name,this.authorId,this.numOfPlayers,this.nextTilesIds,this.initSizeX,this.initSizeY,this.isPublished,this.toogleNumber,this.numOfPawnsPerTile],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}
                
        

    public static load(data:any){
                let ret = new Game_db()
                ret.setId(data.id)
                ret.setName(data.name)
                ret.setAuthorId(data.authorId)
                ret.setNumOfPlayers(data.numOfPlayers)
                ret.setNextTilesIds(data.nextTilesIds)
                ret.setInitSizeX(data.initSizeX)
                ret.setInitSizeY(data.initSizeY)
                ret.setIsPublished(data.isPublished)
                ret.setToogleNumber(data.toogleNumber)
                ret.setNumOfPawnsPerTile(data.numOfPawnsPerTile)
                return ret
                }
    
}