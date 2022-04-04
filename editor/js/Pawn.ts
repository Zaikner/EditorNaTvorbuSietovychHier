import { ctx, editor, reload } from "./canvas";
import { drawPawnType1 } from "./PawnEditor";
import { Tile } from "./Tile";

export class Pawn{
    id:number = 0;
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
        console.log('movol')
        let startTile = this.tile;
        let actuallTile = this.tile;
        let endTile = this.tile;
        console.log(actuallTile)
        let p = this;
        for (let i = 0;i < numOfTiles ; i++){
        
            setTimeout(function(){
                actuallTile.removePawn(p)
                actuallTile = editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber())!
                actuallTile.getPawns().push(p)
                console.log(actuallTile)
            reload(editor,ctx)
            }, 1000)
        }

        this.tile = actuallTile
        //this.tile.getPawns().push(this)
        //startTile.removePawn(this)
        console.log('posunul')
    }
    JSONfyPawn(){
        return{player:this.player,
               tileId:this.tileId}
    }
}