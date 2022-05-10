
import { DbConnect } from "../DbConnect";
import { BackgroundComponent_db } from "./BackgroundComponent_db";
import { Background_db } from "./Background_db";
export class BackgroundComponentFinder{
    private static INSTANCE:BackgroundComponentFinder = new BackgroundComponentFinder()
    public static getIntance():BackgroundComponentFinder{return this.INSTANCE}

    private constructor(){

    }
   
public async findByName(name:string){
    let client = DbConnect.get()
    try {
        const query = {
            name: 'select-backgroundComponent',
            text: 'SELECT * FROM "bachelorsThesis"."Background_component" WHERE "gameName"=$1;',
            values: [name],
          }
        var results = await  client.query(query)
        var ret:Array<BackgroundComponent_db> = []
      
        await results.rows.forEach((row:any) => {
          
            ret.push(BackgroundComponent_db.load(row))
        });
       
        return ret

    }
    catch(err){
      console.log("Connection failed")
    } 
  }

  public async deleteByGameName(name:string){
    let client = DbConnect.get()
    try {
        const query = {
            name: 'delete-backgroundComponent',
            text: 'DELETE FROM "bachelorsThesis"."Background_component" WHERE "gameName"=$1;',
            values: [name],
          }
        var results = await  client.query(query)
        var ret:Array<BackgroundComponent_db> = []
      
        await results.rows.forEach((row:any) => {
          
            ret.push(BackgroundComponent_db.load(row))
        });
       
        return ret

    }
    catch(err){
      console.log(err)
      console.log("Connection failed components")
    } 
  }
}

