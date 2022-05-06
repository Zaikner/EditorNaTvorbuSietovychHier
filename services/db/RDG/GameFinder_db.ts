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
                    text: 'SELECT * FROM bachelors_thesis.games WHERE name=$1;',
                    values: [name],
                  }
                var results = await  client.query(query)
                var ret:Array<Game_db> = []
              
                await results.rows.forEach((row:any) => {
                   
                    ret.push(Game_db.load(row))
                });
                console.log('find by name vracia:')
                console.log(ret)
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
                    name: 'select-game-last',
                    text: 'SELECT * FROM bachelors_thesis.games ORDER BY id DESC LIMIT 1;',
                    values: [],
                  }
                var results = await  client.query(query)
                var ret:Array<Game_db> = []
              
                await results.rows.forEach((row:any) => {
                   
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
        
            try {
                const query = {
                    name: 'select-game-all',
                    text: 'SELECT * FROM bachelors_thesis.games;',
                    values: [],
                  }
               
                var results = await  client.query(query)
           
                var ret:Array<Game_db> = []
               
                await results.rows.forEach((row:any) => {
              
                    ret.push(Game_db.load(row))
                });
              
                return ret
        
            }
            catch(err){
              console.log(err)
              console.log("Connection failed")
            } 
          }
      public async findAllPublished(){
            let client = DbConnect.get()
        
            try {
                const query = {
                    name: 'select-game-all-published',
                    text: 'SELECT * FROM bachelors_thesis.games WHERE is_published = true;',
                    values: [],
                  }
               
                var results = await  client.query(query)
           
                var ret:Array<Game_db> = []
               
                await results.rows.forEach((row:any) => {
              
                    ret.push(Game_db.load(row))
                });
              
                return ret
        
            }
            catch(err){
              console.log(err)
              console.log("Connection failed")
            } 
          }
  
}