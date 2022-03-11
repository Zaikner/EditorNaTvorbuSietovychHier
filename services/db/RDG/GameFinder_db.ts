import { DbConnect } from "../DbConnect";
import { Game_db } from "./Game_db";
export class GameFinder{
    private static INSTANCE:GameFinder = new GameFinder()
    public static getIntance():GameFinder{return this.INSTANCE}

    private constructor(){

    }
    

    public async findByName(name:string){
            let client = DbConnect.get()
            try {
                const query = {
                    name: 'select-game-name',
                    text: 'SELECT * FROM "bachelorsThesis"."Game" WHERE name=$1;',
                    values: [name],
                  }
                var results = await  client.query(query)
                var ret:Array<Game_db> = []
              
                await results.rows.forEach((row:any) => {
                    console.log('precital')
                    ret.push(Game_db.load(row))
                });
               
                return ret
        
            }
            catch(err){
              console.log("Connection failed")
            } 
          }
          public async findAll(){
            let client = DbConnect.get()
            console.log(process.env.DATABASE_URL,)
            console.log('pripojil')
            try {
                const query = {
                    name: 'select-game-all',
                    text: 'SELECT * FROM "bachelorsThesis"."Game";',
                    values: [],
                  }
                  console.log('vykonal query')
                var results = await  client.query(query)
                console.log('query zbehlo')
                var ret:Array<Game_db> = []
                console.log('travelz')
                await results.rows.forEach((row:any) => {
                    console.log('precital')
                    ret.push(Game_db.load(row))
                });
                console.log('presiel traverz')
                console.log(ret)
                return ret
        
            }
            catch(err){
              console.log(err)
              console.log("Connection failed")
            } 
          }
  
}