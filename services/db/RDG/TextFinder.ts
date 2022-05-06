import { Game_db } from "./Game_db";
import { DbConnect } from "../DbConnect";
import { Tile_db } from "./Tile_db";
import { Texts } from "./Texts";
export class TextsFinder{
    private static INSTANCE:TextsFinder = new TextsFinder()
    public static getIntance():TextsFinder{return this.INSTANCE}

    private constructor(){

    }
  
    
    public async findAll(){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-allTexts',
                    text: 'SELECT * FROM bachelors_thesis.texts ORDER BY id ASC ',
                    values: [],
                  }
                var results = await  client.query(query)
                var ret:Array<Texts> = []
              
                await results.rows.forEach((row:any) => {
                   
                    ret.push(Texts.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
    
      
      
}