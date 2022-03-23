import { DbConnect } from "../DbConnect";

export class PawnStyles{
    id:number = 0
    player:string = '';
    color:string = '#000000';
    image:string = ''
    gameName:string = ''
    type:string = ''
   
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
    public setGameName(gameName:string){
        this.gameName = gameName
    }
    public getGameName(){
        return this.gameName
    }
    public setId(id:number){
        this.id = id
    }
    public getId(){
        return this.id
    }
    public setType(newType:string){
        this.type = newType
    }
    public getType(){
        return this.type
    }
    
    public insert(){
        let client = DbConnect.get()
        console.log('insertuje')
            const query = {
                name: 'insert-pawn-style',
                text: 'INSERT INTO "bachelorsThesis"."PawnStyle"(player,color,image,"gameName",type) VALUES($1,$2,$3,$4,$5);',
                values: [this.player,this.color,this.image,this.gameName,this.type],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows[0]))
              .catch((e:Error) => console.error(e.stack))}


    public static load(data:any){
                let ret = new PawnStyles()
                ret.setId(data.id)
                ret.setPlayer(data.player)
                ret.setColor(data.color)
                ret.setImage(data.image)
                ret.setGameName(data.gameName)
                ret.setType(data.type)
                return ret
                }
}