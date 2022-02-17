
import { DbConnect } from "../DbConnect";
export class BackgroundFinder{
    private static INSTANCE:BackgroundFinder = new BackgroundFinder()
    public static getIntance():BackgroundFinder{return this.INSTANCE}

    private constructor(){

    }
    public findBackgroundByGameName(name:string){
        let client = DbConnect.get()
        const query = {
            name: 'select-gameTiles',
            text: 'SELECT * FROM "bachelorsThesis"."Game" as g INNER JOIN "bachelorsThesis"."Background" as t on t."gameName" = g.name  WHERE g.name=$1;',
            values: [name],
          }
          client
          .query(query)
          .then((res:any) => console.log(res.rows[0]))
          .catch((e:Error) => console.error(e.stack))}    
}