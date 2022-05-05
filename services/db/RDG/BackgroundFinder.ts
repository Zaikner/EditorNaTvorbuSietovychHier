
import { DbConnect } from "../DbConnect";
import { Background_db } from "./Background_db";
export class BackgroundFinder{
    private static INSTANCE:BackgroundFinder = new BackgroundFinder()
    public static getIntance():BackgroundFinder{return this.INSTANCE}

    private constructor(){

    }
   
public async findById(id:number){
    let client = DbConnect.get()
    try {
        const query = {
            name: 'select-background',
            text: 'SELECT * FROM  "bachelorsThesis"."Background"  WHERE "gameId"=$1;',
            values: [id],
          }
        var results = await  client.query(query)
        var ret:Array<Background_db> = []
      
        await results.rows.forEach((row:any) => {
          
            ret.push(Background_db.load(row))
        });
       
        return ret

    }
    catch(err){
      console.log("Connection failed")
    } 
  }
}