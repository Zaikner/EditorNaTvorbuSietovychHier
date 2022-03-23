import { DbConnect } from "../DbConnect";
import { Tile_db } from "./Tile_db";
export class TileFinder{
    private static INSTANCE:TileFinder = new TileFinder()
    public static getIntance():TileFinder{return this.INSTANCE}

    private constructor(){

    }
  
    
    public async findByName(name:string){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-gameTiles',
                    text: 'SELECT * FROM "bachelorsThesis"."Game" as g INNER JOIN "bachelorsThesis"."Tile" as t on t."gameName" = g.name  WHERE g.name=$1;',
                    values: [name],
                  }
                var results = await  client.query(query)
                var ret:Array<Tile_db> = []
              
                await results.rows.forEach((row:any) => {
                    console.log('precital')
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
                    text: 'SELECT * FROM  "bachelorsThesis"."Tile" ORDER BY id DESC LIMIT 1',
                    values: [],
                  }
                var results = await  client.query(query)
                var ret:Array<Tile_db> = []
              
                await results.rows.forEach((row:any) => {
                    console.log('precital')
                    ret.push(Tile_db.load(row))
                });
                console.log('query preslo')
                if (ret.length >= 1){
                  console.log('plne')
                  return ret[0]
                }
                else{
                  console.log('prazdne')
                  return new Tile_db()
                }
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }    
}