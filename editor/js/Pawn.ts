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


    move(numOfTiles:number){
        console.log('movol')
        let startTile = this.tile;
        let actuallTile = this.tile;
        let endTile = this.tile;
        console.log(actuallTile)
        
        let p = this;
        for (let i = 0;i < numOfTiles ; i++){
        
            setTimeout(function(){
                console.log('pohol som pawnom:')
                console.log(p)
                actuallTile.removePawn(p)
                actuallTile = editor.getGame().findTileByTileId(actuallTile.getFollowingTileNumber())!
                console.log('nextTile je:')
                actuallTile.getPawns().push(p)
                console.log('pawny tohto policka su:')
                console.log(actuallTile.getPawns())
                p.tileId = actuallTile.getId()
                p.tile = actuallTile
                console.log(actuallTile)
            reload(editor,ctx)
            }, 500*i)
        }
     
        const params = new URLSearchParams(window.location.search);
    
        setTimeout(function(){
            editorSocket.emit('change Pawn position',{pawnId:p.id,tileId:p.tileId,room:params.get('id'),id:getCookie('id')})
            startTile.setIsChoosen(false)
            editor.setChoosenTile(undefined!)
            editor.reactToTile(actuallTile)
            console.log('posunuty tile:')
            console.log(p.tile)
            console.log('posunuta figurka')
            console.log(p)
            reload(editor,ctx)
        console.log('posunul')
        }, 550*numOfTiles)
        
    }
    JSONfyPawn(){
        return{player:this.player,
               tileId:this.tileId}
    }
}