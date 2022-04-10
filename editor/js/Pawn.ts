
import { ctx, editor, editorSocket, getCookie, reload } from "./canvas";
import { drawPawnType1, pawnDeleteMenu } from "./PawnEditor";
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
    canMove(numOfTiles:number){
        let ret = true
        let actuallTile = this.tile;
      

        for (let i = 0;i < numOfTiles ; i++){
            actuallTile = editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber())!
                
                
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
        let endTile = this.tile;
      
        
        let p = this;
        for (let i = 0;i < numOfTiles ; i++){
        
            setTimeout(function(){
             
                actuallTile.removePawn(p)
                actuallTile = editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber())!
                

                actuallTile.getPawns().push(p)
               
                p.tileId = actuallTile.getId()
                p.tile = actuallTile
          
            reload(editor,ctx)
            }, 500*i)
        }
     
        const params = new URLSearchParams(window.location.search);
        if (editor.getGame().getIsOnturn()){
            setTimeout(function(){
                editorSocket.emit('change Pawn position',{pawnId:p.id,tileId:p.tileId,room:params.get('id'),id:getCookie('id')})
                startTile.setIsChoosen(false)
                editor.setChoosenTile(undefined!)
                editor.reactToTile(actuallTile)
                console.log(actuallTile)
                reload(editor,ctx)
          
            }, 550*numOfTiles)
        }
     
        
    }
    JSONfyPawn(){
        return{player:this.player,
               tileId:this.tileId}
    }
}