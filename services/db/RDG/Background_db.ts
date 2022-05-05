import { DbConnect } from "../DbConnect";
export class Background_db{
    private id:number= 0;
    private color:string = '';
    private image:string = '';
    private gameId:number = 0;

    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
      
    public getGameId() : number {
        return this.gameId
    }
    public setGameId(newId:number){
        this.gameId  = newId
    }
    public getColor() : string {
        return this.color
    }
    public setColor(newColor:string){
        this.color  = newColor
    }
    public getImage() : string {
        return this.image
    }
    public setImage(newImage:string){
        this.image  = newImage
    }

    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-background',
                text: 'INSERT INTO "bachelorsThesis"."Background"(image,color,"gameId") Values($1,$2,$3);',
                values: [this.image,this.color,this.gameId],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows))
              .catch((e:Error) => console.error(e.stack))}
    
    public upsert(){
        let client = DbConnect.get()
            const query = {
                name: 'upsert-background',
                text: 'INSERT INTO "bachelorsThesis"."Background"(image,color,"gameId") Values($1,$2,$3) ON CONFLICT("gameId") DO UPDATE SET image = EXCLUDED.image, color = EXCLUDED.color, "gameId" = EXCLUDED."gameId";',
                values: [this.image,this.color,this.gameId],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows))
              .catch((e:Error) => console.error(e.stack))}
 
    
    public static load(data:any){
            let ret = new Background_db()
            ret.setId(data.id)
            ret.setGameId(data.gameId)
            ret.setColor(data.color)
            ret.setImage(data.image)
            return ret
            }
}