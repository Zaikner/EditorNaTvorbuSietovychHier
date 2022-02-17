import { DbConnect } from "../DbConnect";
export class GameFinder{
    private static INSTANCE:GameFinder = new GameFinder()
    public static getIntance():GameFinder{return this.INSTANCE}

    private constructor(){

    }
    public findByName(name:string){
        let client = DbConnect.get()
        const query = {
            name: 'select-game',
            text: 'SELECT * FROM "bachelorsThesis"."Game" WHERE name=$1;',
            values: [name],
          }
          client
          .query(query)
          .then((res:any) => console.log(res.rows[0]))
          .catch((e:Error) => console.error(e.stack))}    
}