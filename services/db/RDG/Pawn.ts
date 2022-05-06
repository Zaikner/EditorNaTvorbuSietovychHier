import { DbConnect } from "../DbConnect";

export class Pawn{
    id:number = 0
    player:string = '';
    tileId:number = 0;
    color:string = '#000000';
    image:string = ''
   
    constructor(){
    }

    public setPlayer(player:string){
        this.player = player
    }
    public getPlayer(){
        return this.player
    }
    public setColor(color:string){
        this.color = color
    }
    public getColor(){
        return this.color
    }
    public setImage(image:string){
        this.image = image
    }
    public getImage(){
        return this.image
    }
    public setId(id:number){
        this.id = id
    }
    public getId(){
        return this.id
    }
    public setTileId(id:number){
        this.tileId= id
    }
    public getTileId(){
        return this.tileId
    }

    public insert(){
        let client = DbConnect.get()
      
            const query = {
                name: 'insert-pawn',
                text: 'INSERT INTO bachelors_thesis.pawn(player,tile_id,color,image) VALUES($1,$2,$3,$4);',
                values: [this.player,this.tileId,this.color,this.image],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}


    public static load(data:any){
                console.log('tooto vyplula dataza')
                console.log(data)
                let ret = new Pawn()
                ret.setId(data.id)
                ret.setTileId(data.tileId)
                ret.setPlayer(data.player)
                ret.setColor(data.color)
                ret.setImage(data.image)
                return ret
                }
}