import { getDataUrlFromImage } from "./utilityFunctions";

export class PawnStyle{
    private player:string = '';
    private color:string = '';
    private type:string = ''
    private image:HTMLImageElement = undefined!;
 


    constructor(player:string,color:string,type:string){
        this.player = player
        this.color = color
        this.type = type
    }

    JSONfyStyle(){
        return {player:this.player,
                color:this.color,
                type:this.type,
                image:this.image === undefined?'none':getDataUrlFromImage(this.image)}
    }
    public setColor(newColor:string){
        this.color = newColor
    }
    public getColor(){
        return this.color
    }
    public setType(newType:string){
        this.type = newType
    }
    public getType(){
        return this.type
    }
    public setPlayer(newPlayer:string){
        this.player = newPlayer
    }
    public getPlayer(){
        return this.player
    }
    public setImage(newImage:HTMLImageElement){
        this.image = newImage
    }
    public getImage(){
        return this.image
    }

}