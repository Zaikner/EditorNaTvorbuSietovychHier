// import { Game_db } from "./Game_db";
// import { DbConnect } from "../DbConnect";
// import { Tile_db } from "./Tile_db";
// export class TileFinder{
//     private static INSTANCE:TileFinder = new TileFinder()
//     public static getIntance():TileFinder{return this.INSTANCE}

//     private constructor(){

//     }
  
    
//     public async findByName(name:string){
//             return 1
//             let client = DbConnect.get()
//             try {
//                 const query = {
//                     name: 'select-gameTiles',
//                     text: 'SELECT * FROM "bachelorsThesis"."Game" as g INNER JOIN "bachelorsThesis"."Tile" as t on t."gameName" = g.name  WHERE g.name=$1;',
//                     values: [name],
//                   }
//                 var results = await  client.query(query)
//                 var ret:Array<Tile_db> = []
              
//                 await results.rows.forEach((row:any) => {
//                     console.log('precital')
//                     ret.push(Tile_db.load(row))
//                 });
               
//                 return ret
        
//             }
//             catch(err){
//               console.log("Connection failed")
//             } 
//           }    
// }


import { DbConnect } from "../DbConnect";
import { Game_db } from "./Game_db";
export class TileFinder{
    private static INSTANCE:TileFinder = new TileFinder()
    public static getIntance():TileFinder{return this.INSTANCE}

    private constructor(){

    }
  

}