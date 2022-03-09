
import { DbConnect } from "../DbConnect";
import { Background_db } from "./Background_db";
export class BackgroundFinder{
    private static INSTANCE:BackgroundFinder = new BackgroundFinder()
    public static getIntance():BackgroundFinder{return this.INSTANCE}

    private constructor(){

    }
   
public async findByName(name:string){
    let client = DbConnect.get()
    try {
        const query = {
            name: 'select-background',
            text: 'SELECT * FROM "bachelorsThesis"."Game" as g INNER JOIN "bachelorsThesis"."Background" as t on t."gameName" = g.name  WHERE g.name=$1;',
            values: [name],
          }
        var results = await  client.query(query)
        var ret:Array<Background_db> = []
      
        await results.rows.forEach((row:any) => {
            console.log('precital')
            ret.push(Background_db.load(row))
        });
       
        return ret

    }
    catch(err){
      console.log("Connection failed")
    } 
  }
}