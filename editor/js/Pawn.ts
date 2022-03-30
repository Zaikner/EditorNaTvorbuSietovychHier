import { editor, reload } from "./canvas";
import { drawPawnType1 } from "./PawnEditor";
import { Tile } from "./Tile";

export class Pawn{
    player:string;
    tile:Tile;
    tileId:number;
    color:string = '#000000';
   
    constructor(player:string,tile:Tile){
        this.player = player
        this.tile = tile
        this.tileId = tile.getId()
        tile.getPawns().push(this)     
    }


    move(numOfTiles:number){

    }
    JSONfyPawn(){
        return{player:this.player,
               tileId:this.tileId}
    }
}