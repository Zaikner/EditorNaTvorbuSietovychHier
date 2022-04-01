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
        let startTile = this.tile;
        let actuallTile = this.tile;
        let endTile = this.tile;

        for (let i = 0;i < numOfTiles ; i++){
            actuallTile = editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber())!
        }

        this.tile = actuallTile
    }
    JSONfyPawn(){
        return{player:this.player,
               tileId:this.tileId}
    }
}