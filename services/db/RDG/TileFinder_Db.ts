import { Game_db } from "./Game_db";
import { DbConnect } from "../DbConnect";
export class TileFinder{
    private static INSTANCE:TileFinder = new TileFinder()
    public static getIntance():TileFinder{return this.INSTANCE}

    private constructor(){

    }
    public findTileByGameName(name:string){
        let client = DbConnect.get()
        const query = {
            name: 'select-gameTiles',
            text: 'SELECT * FROM "bachelorsThesis"."Game" as g INNER JOIN "bachelorsThesis"."Tile" as t on t."gameName" = g.name  WHERE g.name=$1;',
            values: [name],
          }
          client
          .query(query)
          .then((res:any) => console.log(res.rows[0]))
          .catch((e:Error) => console.error(e.stack))}    
}