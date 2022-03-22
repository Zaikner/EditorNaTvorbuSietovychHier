import { editor, reload } from "./canvas";
import { Tile } from "./Tile";

export class Pawn{
    id:number
    player:string;
    tile:Tile;
    color:string = '#000000';
    image:HTMLImageElement = undefined!;
    type:string = ''
   
    constructor(id:number,player:string,tile:Tile){
        this.id = id
        this.player = player
        this.tile = tile
    
        
    }

    draw(ctx:CanvasRenderingContext2D){
        let style = editor.getGame().getPawnStyle().get(this.player)
        ctx.beginPath()
        ctx.save()
        ctx.strokeStyle ="#000"; ctx.lineWidth=1; ctx.setLineDash([]);
        ctx.fillStyle = style!.getColor()
        ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
        ctx.arc(this.tile.getCenterX(), this.tile.getCenterY(), this.tile.getRadius()/4, 0, 2 * Math.PI);
        ctx.fill()
        ctx.resetTransform();
        ctx.restore()
        ctx.strokeStyle ="#000"; ctx.lineWidth=1; ctx.setLineDash([]);
        ctx.fillStyle = "#000"
        ctx.closePath()
    }

    move(numOfTiles:number){

    }
}