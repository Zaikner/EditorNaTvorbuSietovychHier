import { DbConnect } from "../DbConnect";
import { Tile_db } from "./Tile_db";
export class TileFinder{
    private static INSTANCE:TileFinder = new TileFinder()
    public static getIntance():TileFinder{return this.INSTANCE}

    private constructor(){

    }
  
    
    public async findByGameId(id:number){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-gameTiles',
                    text: 'SELECT * FROM bachelors_thesis.games as g INNER JOIN bachelors_thesis.tiles as t on t.game_id = g.id  WHERE g.id=$1;',
                    values: [id],
                  }
                var results = await  client.query(query)
                var ret:Array<Tile_db> = []
              
                await results.rows.forEach((row:any) => {
                  
                    ret.push(Tile_db.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }

    public async findByAuthorAndRandomQuestion(authorId:number){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-gameTiles',
                    text: 'SELECT * FROM bachelors_thesis.games as g INNER JOIN bachelors_thesis.tiles as t on t.game_id = g.id  WHERE g.author_id=$1 AND t.random_question = true;',
                    values: [authorId],
                  }
                var results = await  client.query(query)
                var ret:Array<Tile_db> = []
              
                await results.rows.forEach((row:any) => {
                  
                    ret.push(Tile_db.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }

  public async findByQuestionId(id:number){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-tile-by-questionId',
                    text: 'SELECT * FROM bachelors_thesis.tiles WHERE question_id=$1;',
                    values: [id],
                  }
                var results = await  client.query(query)
                var ret:Array<Tile_db> = []
              
                await results.rows.forEach((row:any) => {
                  
                    ret.push(Tile_db.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
  
          public async findLast(){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-last-gameTiles',
                    text: 'SELECT * FROM  bachelors_thesis.tiles ORDER BY id DESC LIMIT 1',
                    values: [],
                  }
                var results = await  client.query(query)
                var ret:Array<Tile_db> = []
              
                await results.rows.forEach((row:any) => {
                   
                    ret.push(Tile_db.load(row))
                });
             
                if (ret.length >= 1){
              
                  return ret[0]
                }
                else{
               
                  return new Tile_db()
                }
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }    

  public async deleteByGameId(id:number){
            let client = DbConnect.get()
            try {
            
                const query = {
                    name: 'delete-gameTiles',
                    text: 'DELETE FROM bachelors_thesis.tiles WHERE game_id=$1;',
                    values: [id],
                  }
                var results = await  client.query(query)
                var ret:Array<Tile_db> = []
              
                await results.rows.forEach((row:any) => {
                    ret.push(Tile_db.load(row))
                  
                });
             
                return ret
        
            }
            catch(err){
              console.log(err)
              console.log("Connection failed")
            } 
          }
}