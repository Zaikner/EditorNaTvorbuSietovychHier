

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
                        
                        text: 'INSERT INTO bachelors_thesis.games(id,name,author_id,num_of_players,next_tiles_ids,init_size_x,init_size_y,is_published,toogle_number,num_of_pawns_per_tile) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)  ON CONFLICT(id) DO UPDATE SET name = EXCLUDED.name, author_id = EXCLUDED.author_id,num_of_players = EXCLUDED.num_of_players,next_tiles_ids= EXCLUDED.next_tiles_ids,init_size_x=EXCLUDED.init_size_x,init_size_y=EXCLUDED.init_size_y,is_published=EXCLUDED.is_published,toogle_number = EXCLUDED.toogle_number, num_of_pawns_per_tile = EXCLUDED.num_of_pawns_per_tile;',
                        values: [this.id,this.name,this.authorId,this.numOfPlayers,this.nextTilesIds,this.initSizeX,this.initSizeY,this.isPublished,this.toogleNumber,this.numOfPawnsPerTile],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows[0]))
                      .catch((e:Error) => console.error(e.stack))}

    public delete(){
                        let client = DbConnect.get()
                            const query = {
                                name: 'delete-game',
                                
                                text: 'DELETE FROM bachelors_thesis.games WHERE id = $1;',
                                values: [this.id],
                              }
                              client
                              .query(query)
                              .then((res:any) => console.log(res.rows[0]))
                              .catch((e:Error) => console.error(e.stack))}
                
        

    public static load(data:any){
                let ret = new Game_db()
                ret.setId(data.id)
                ret.setName(data.name)
                ret.setAuthorId(data.author_id)
                ret.setNumOfPlayers(data.num_of_players)
                ret.setNextTilesIds(data.next_tiles_ids)
                ret.setInitSizeX(data.init_size_x)
                ret.setInitSizeY(data.init_size_y)
                ret.setIsPublished(data.is_published)
                ret.setToogleNumber(data.toogle_number)
                ret.setNumOfPawnsPerTile(data.num_of_pawns_per_tile)
                return ret
                }
    
}