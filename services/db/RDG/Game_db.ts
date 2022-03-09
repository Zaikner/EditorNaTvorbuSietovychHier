
import { DbConnect } from "../DbConnect";

export class Game_db{
    private id:number = 0;
    private name:string = '';
    private author:string = '';
    private numOfPlayers:number = 0;

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
        return this.name
    }
    public setAuthor(newAuthor:string){
        this.author  = newAuthor
    }
       
    
    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-game',
                text: 'INSERT INTO "bachelorsThesis"."Game"(name,author,"numOfPlayers") VALUES($1,$2,$3);',
                values: [this.name,this.author,this.numOfPlayers],
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
                return ret
                }
    
}