import { editor, reload } from "./canvas";
import { Tile } from "./Tile";

export class Pawn{
    id:number
    player:string;
    tile:Tile;
    color:string = '#000000';
    image:HTMLImageElement = undefined!;
   
    constructor(id:number,player:string,tile:Tile){
        this.id = id
        this.player = player
        this.tile = tile
    
        
    }

    draw(ctx:CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.save()
        ctx.strokeStyle ="#000"; ctx.lineWidth=1; ctx.setLineDash([]);
        ctx.fillStyle = this.color
        ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
        ctx.arc(this.tile.getCenterX(), this.tile.getCenterY(), this.tile.getRadius()/4, 0, 2 * Math.PI);
        ctx.fill()
        ctx.resetTransform();
        ctx.restore()
        ctx.strokeStyle ="#000"; ctx.lineWidth=1; ctx.setLineDash([]);
        ctx.fillStyle = 'black'
        ctx.closePath()
    }

    move(numOfTiles:number){

    }
}