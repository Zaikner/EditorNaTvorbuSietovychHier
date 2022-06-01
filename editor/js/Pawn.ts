import { ctx, game,  reload } from "./Canvas";
import { editorSocket, getCookie} from './ClientSocket.js'
import { Tile } from "./Tile";

export class Pawn{
    id:number = 0;
    player:string;
    tile:Tile;
    tileId:number;
    startingTileId:number;
    hasEnded:boolean = false;
   
    constructor(player:string,tile:Tile){
        this.player = player
        this.tile = tile
        this.tileId = tile.getId()
        this.startingTileId = tile.getId()
        tile.getPawns().push(this)     
    }
    canMove(numOfTiles:number){
        let ret = true
        let actuallTile = this.tile;
      

        for (let i = 0;i < numOfTiles ; i++){
            let newTile = game.findTileByTileId(actuallTile.getNextTilesIds().get(this.player)!)!
            if (newTile == actuallTile){
                ret = false
                break;
            }
            actuallTile = newTile
                
            if (actuallTile == undefined){
                ret = false
                break;
            }
        }
        return ret
    }


    move(numOfTiles:number){
        let startTile = this.tile;
        let actuallTile = this.tile;
        let p = this;
        for (let i = 0;i < numOfTiles ; i++){
        
                setTimeout(function(){   
                actuallTile.removePawn(p)
                actuallTile = game.findTileByTileId(actuallTile.getNextTilesIds().get(p.player)!)!
                actuallTile.getPawns().push(p)
               
                p.tileId = actuallTile.getId()
                p.tile = actuallTile
            reload(ctx)
            }, 500*i)
        }
     
        const params = new URLSearchParams(window.location.search);
        if (game.getHasThrown()){
            setTimeout(function(){
                editorSocket.emit('change Pawn position',{pawnId:p.id,tileId:p.tileId,room:params.get('id'),id:getCookie('id')})
                startTile.setIsChoosen(false)
                game.setChoosenTile(undefined!)
                game.reactToTile(actuallTile,numOfTiles,p)
               
                reload(ctx)
          
            }, 550*numOfTiles)
        }   
    }
    returnToStart(){
        this.tile.removePawn(this)
        this.tileId = this.startingTileId
        this.tile = game.findTileById(this.tileId)
        this.tile.getPawns().push(this)
        reload(ctx)
    }
    JSONfyPawn(){
        return{player:this.player,
               tileId:this.tileId}
    }
}