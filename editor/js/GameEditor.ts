import {canvas,ctx, calibreEventCoords} from './canvas.js'
import {Tile} from './Tile.js'
import { Game } from './Game.js'

import {editTiles} from './TileEditor.js'
import { Pawn } from './Pawn.js';

class GameEditor{
    private game= new Game();
    private choosenTile?:Tile = undefined;
    private undoLog:Array<Array<Tile>> = []
    private isMoving = false
    private image:HTMLImageElement = undefined!;
    private pattern:HTMLImageElement = undefined!;
    private startForPlayers:Array<string> = []
    private endForPlayers:Array<string> = []
    private enabledForPlayers:Array<string> = []
    constructor(){
        this.initNewGame()
    }

    initNewGame(){
        this.game = new Game()
        console.log(this.getGame())
    }

    initTile(coords:{x:number,y:number},color:string,size:number,stroke:number,strokeColor:string,shape:string,background?:HTMLImageElement,pattern?:HTMLImageElement):Tile{
        let tileNumber = this.nextTileNumber()
        let newTile = new Tile('',coords.x,coords.y,coords.x-size,coords.x+size,coords.y-size,coords.y+size,size,color,this.game.getNextTileNumber())
        if (stroke!=0){
            newTile.setStroke(stroke)
            newTile.setStrokeColor(strokeColor)
            
        }
        if (background!=undefined){
            newTile.setBackgroundFile(background)
        }
        if (pattern!=undefined){
            newTile.setPatternFile(pattern)
        }
   
        newTile.setShape(shape)
        
        this.game.addTile(newTile)
        newTile.drawTile(canvas,ctx);
        //this.game.increaseTileNumber()
        newTile.setTileNumber(tileNumber)
        newTile.setFollowingTileNumber(tileNumber+1)
        console.log('cislo dalsieho je :'+ this.game.getNextTileNumber())
        return newTile
  }
    findTile(event:MouseEvent){
        
        let coords = calibreEventCoords(event)
        let tiles = this.game.getTiles()
        
        for (let i = tiles.length-1; i >= 0;i--){
            if (tiles[i].isPointedAt(coords.x,coords.y)){
                
                if (tiles[i] == this.choosenTile){
                    tiles[i].setIsChoosen(false)               
                    this.choosenTile = undefined
                }
                else{
                    if (this.choosenTile!= undefined){
                        this.choosenTile!.setIsChoosen(false) 
                    }              
                    tiles[i].setIsChoosen(true)
                    this.choosenTile = tiles[i]
                    if (!this.isMoving)editTiles()
                }
                break
            }
        }
    }
  
    deleteTile(event:MouseEvent){
        
        let coords = calibreEventCoords(event)
        let tiles = this.game.getTiles()
        
        for (let i = tiles.length-1; i >= 0;i--){
            if (tiles[i].isPointedAt(coords.x,coords.y)){
                this.game.removeTile(tiles[i])
                tiles[i].getPawns().forEach((pawn:Pawn)=>{
                    this.game.removePawn(pawn)
                })
                
                break
            }
        }
      
    }
    updateChoosenTile(color:string,size:number,hasStroke:boolean,stroke:number,strokeColor:string,shape:string,image?:HTMLImageElement){
        this.choosenTile?.setColor(color)
        // this.choosenTile?.setCenterX(centerX)
        // this.choosenTile?.setCenterY(centerY)
        // this.choosenTile?.setX1(centerX-size)
        // this.choosenTile?.setX2(centerX+size)
        // this.choosenTile?.setY1(centerY-size)
        // this.choosenTile?.setY2(centerY+size)
        this.choosenTile?.setRadius(size)
        this.choosenTile?.setShape(shape)
        this.choosenTile?.setBackgroundFile(image!)
        if (hasStroke){
            this.choosenTile?.setStroke(stroke)
            this.choosenTile?.setStrokeColor(strokeColor)
        }
        else{
            this.choosenTile?.setStroke(0)
        }
    }
    moveTile(event:MouseEvent){
        let coords = calibreEventCoords(event)
        this.choosenTile?.setCenterX(coords.x)
        this.choosenTile?.setCenterY(coords.y)
        this.choosenTile?.setX1(coords.x-this.choosenTile?.getRadius())
        this.choosenTile?.setX2(coords.x+this.choosenTile?.getRadius())
        this.choosenTile?.setY1(coords.y-this.choosenTile?.getRadius())
        this.choosenTile?.setY2(coords.y+this.choosenTile?.getRadius())
    }
    makeAllTilesNotChoosen(){
        let tiles = this.game.getTiles()
        tiles.forEach((tile) => {tile.setIsChoosen(false)})
        this.choosenTile = undefined
    }
    addToUndoLog(addition:Array<Tile>){
        this.undoLog.push(addition)
    }
    removeLastFromUndoLog(){
        let removed = this.undoLog.pop()
        removed?.forEach((tile:Tile) =>{
            this.game.removeTile(tile)
        })
    }
    nextTileNumber(){
        let i = 1;
        let cont = true
        while (cont){
            cont = false
            this.game.getTiles().forEach((tile:Tile)=>{
                if (tile.getTileNumber() == i){
                    i++
                    cont = true
                }
            })
        }
        return i
    }
    tileWithNumberExists(num:number){
        let res = false
        this.game.getTiles().forEach((tile:Tile)=>{
            if (tile.getTileNumber() === num){
                res = true
            }
            console.log('rovna sa '+tile.getTileNumber()+' : '+ (tile.getTileNumber() === num))
        })
        return res
    }
    
   
  getGame(){
    return this.game
}
    setGame(newGame:Game){
        this.game = newGame;
}
    getChoosenTile(){
        return this.choosenTile
    }
    public getIsMoving() : boolean {
        return this.isMoving
    }
    public setIsMoving(is:boolean) {
        this.isMoving = is
    }
    public getImage() : HTMLImageElement {
        return this.image
    }
    public setImage(newImage: HTMLImageElement) {
        this.image = newImage
    }
    public getPattern() : HTMLImageElement {
        return this.pattern
    }
    public setPattern(newPattern: HTMLImageElement) {
        this.pattern = newPattern
    }
    public setStartForPlayers(newStartForPlayers:Array<string>){
        this.startForPlayers = newStartForPlayers
    }
    public getStartForPlayers():Array<string>{
        return this.startForPlayers
    }
    public setEndForPlayers(newEndForPlayers:Array<string>){
        this.endForPlayers = newEndForPlayers
    }
    public getEndForPlayers():Array<string>{
        return this.endForPlayers
    }
    public setEnabledForPlayers(newEnabledForPlayers:Array<string>){
        this.enabledForPlayers = newEnabledForPlayers
    }
    public getEnabledForPlayers():Array<string>{
        return this.enabledForPlayers
    }
    
}




export{GameEditor}