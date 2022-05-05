
import { BlobOptions } from "buffer";
import { ctx, editor,  reload } from "./canvas";
import { editorSocket, getCookie} from './clientSocket.js'
import { drawPawnType1, pawnDeleteMenu } from "./PawnEditor";
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
            actuallTile = editor.getGame().findTileByTileId(actuallTile.getNextTilesIds().get(this.player)!)!
                
                
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
                actuallTile = editor.getGame().findTileByTileId(actuallTile.getNextTilesIds().get(p.player)!)!
                

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
                editor.reactToTile(actuallTile,numOfTiles,p)
                console.log(actuallTile)
                console.log(editor)
                reload(editor,ctx)
          
            }, 550*numOfTiles)
        }
        console.log('vykonal move pawn')
        console.log(editor.getGame().getIsOnturn())
        console.log(numOfTiles)
        
    }
    returnToStart(){
        this.tile.removePawn(this)
        this.tileId = this.startingTileId
        this.tile = editor.findTileById(this.tileId)
        this.tile.getPawns().push(this)
        reload(editor,ctx)
    }
    JSONfyPawn(){
        return{player:this.player,
               tileId:this.tileId}
    }
}