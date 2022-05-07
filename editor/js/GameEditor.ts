import {canvas,ctx, calibreEventCoords, game, reload} from './canvas.js'
import { editorSocket, getCookie} from './clientSocket.js'
import {Tile} from './Tile.js'
import { Game } from './Game.js'

import {editTiles, insert} from './TileEditor.js'
import { Pawn } from './Pawn.js';
import { totalmem } from 'os';
import { timeStamp } from 'console';


class GameEditor{
//     private game= new Game();
//     private choosenTile?:Tile = undefined;
//     private undoLog:Array<Array<Tile>> = []
//     private isMoving = false
//     private image:HTMLImageElement = undefined!;
//     private pattern:HTMLImageElement = undefined!;
//     private startForPlayers:Array<string> = []
//     private endForPlayers:Array<string> = []
//     private enabledForPlayers:Array<string> = []
//     private cantBeEliminatedOnTile:Array<string> = []

//     private nextTileId = 0;
//     private questionId = -1;
//     private skip = 0;
//     private repeat = 0;
//     private forward = 0;
//     private backward = 0;
//     private mustThrown = 0;
//     private turnToSetFree = 0;
//     private randomQuestion = false;

   
//     constructor(){
//         this.initNewGame()
      
      
//     }
//     nullEditor(){
//         this.startForPlayers = []
//         this.endForPlayers = []
//         this.enabledForPlayers = []
//         this.image = undefined!
//         this.pattern = undefined!
//     }

//     initNewGame(){
//         this.game = new Game()
        
//         this.game.getPlayerTokens().forEach((token:string)=>{
//             this.game.getNextTilesIds().set(token,2)
//         })
//     }   

//     initTile(add:boolean,coords:{x:number,y:number},color:string,size:number,stroke:number,strokeColor:string,shape:string,background?:HTMLImageElement):Tile{
//         let tileNumber = this.nextTileNumber()
//         let newTile = new Tile(coords.x,coords.y,coords.x-size,coords.x+size,coords.y-size,coords.y+size,size,color,this.game.getNextTileNumber())
        
//         if (stroke!=0){
//             newTile.setStroke(stroke)
//             newTile.setStrokeColor(strokeColor)
            
//         }
//         if (background!=undefined){
//             newTile.setImage(background)
//         }
       
   
//         newTile.setShape(shape)
//         if (add){
//             this.game.addTile(newTile)
//             this.nextTileId++;
//         }
        
//         newTile.drawTile(canvas,ctx,false);
//         //this.game.increaseTileNumber()
//         newTile.setTileNumber(tileNumber)
//         //newTile.setFollowingTileNumber(tileNumber+1)
        
     
//         newTile.setId(this.nextTileId)
    
//         return newTile
//   }
//     findTile(event:MouseEvent,edit:boolean){
//         console.log('zavolal find tile')
//         let found = false;
//         let coords = calibreEventCoords(event)
//         let tiles = this.game.getTiles()
        
//         for (let i = tiles.length-1; i >= 0;i--){
//             if (tiles[i].isPointedAt(coords.x,coords.y)){
//                 console.log('nasiel')
//                 found = true
//                 if (tiles[i] == this.choosenTile){
//                     tiles[i].setIsChoosen(false)               
//                     this.choosenTile = undefined
//                 }
//                 else{
//                     if (this.choosenTile!= undefined){
//                         this.choosenTile!.setIsChoosen(false) 
//                     }              
//                     tiles[i].setIsChoosen(true)
//                     this.choosenTile = tiles[i]
//                     //if (!this.isMoving && edit)editTiles()
                    
//                 }
//                 break
//             }
//         }
//         console.log('found je :')
//         console.log(found)
//         if (!found){
//             insert(event)
//         }
//         else if (!this.isMoving && edit){
//             editTiles()
//         }
//     }
  
//     deleteTile(){
        
//         // let coords = calibreEventCoords(event)
//         // let tiles = this.game.getTiles()
        
//         // for (let i = tiles.length-1; i >= 0;i--){
//         //     if (tiles[i].isPointedAt(coords.x,coords.y)){
//         //         this.game.removeTile(tiles[i])
//         //         tiles[i].getPawns().forEach((pawn:Pawn)=>{
//         //             this.game.removePawn(pawn)
//         //         })
                
//         //         break
//         //     }
//         // }
    
//       if(this.choosenTile!=undefined){
//         this.game.removeTile(this.choosenTile)
//         this.game.renumber(this.choosenTile.getTileNumber())
//         this.choosenTile.getPawns().forEach((pawn:Pawn)=>{
//                         this.game.removePawn(pawn)
//                      })
        
//         reload(game,ctx)
//       }
      

     
//     }
//     updateChoosenTile(color:string,size:number,stroke:number,strokeColor:string,shape:string,image?:HTMLImageElement){
//         this.choosenTile?.setColor(color)
//         // this.choosenTile?.setCenterX(centerX)
//         // this.choosenTile?.setCenterY(centerY)
//         // this.choosenTile?.setX1(centerX-size)
//         // this.choosenTile?.setX2(centerX+size)
//         // this.choosenTile?.setY1(centerY-size)
//         // this.choosenTile?.setY2(centerY+size)
//         this.choosenTile?.setRadius(size)
//         this.choosenTile?.setShape(shape)
//         this.choosenTile?.setImage(image!)
//         this.choosenTile?.setStroke(stroke)
//         this.choosenTile?.setStrokeColor(strokeColor)
//         this.choosenTile?.setX1(this.choosenTile.getCenterX()-size)
//         this.choosenTile?.setX2(this.choosenTile.getCenterX()+size)
//         this.choosenTile?.setY1(this.choosenTile.getCenterY()-size)
//         this.choosenTile?.setY2(this.choosenTile.getCenterY()+size)
        
//         this.choosenTile
//     }
//     moveTile(event:MouseEvent){
//         let coords = calibreEventCoords(event)
//         this.choosenTile?.setCenterX(coords.x)
//         this.choosenTile?.setCenterY(coords.y)
//         this.choosenTile?.setX1(coords.x-this.choosenTile?.getRadius())
//         this.choosenTile?.setX2(coords.x+this.choosenTile?.getRadius())
//         this.choosenTile?.setY1(coords.y-this.choosenTile?.getRadius())
//         this.choosenTile?.setY2(coords.y+this.choosenTile?.getRadius())
//     }
//     makeAllTilesNotChoosen(){
//         let tiles = this.game.getTiles()
//         tiles.forEach((tile) => {tile.setIsChoosen(false)})
//         this.choosenTile = undefined
//     }
//     addToUndoLog(addition:Array<Tile>){
  
//         this.undoLog.push(addition)
//     }
//     removeLastFromUndoLog(){
//         let removed = this.undoLog.pop()
//         removed?.forEach((tile:Tile) =>{
//             this.game.removeTile(tile)
//         })
//     }
//     nextTileNumber(){
//         let i = 1;
//         let cont = true
//         while (cont){
//             cont = false
//             this.game.getTiles().forEach((tile:Tile)=>{
//                 if (tile.getTileNumber() == i){
//                     i++
//                     cont = true
//                 }
//             })
//         }
    
//         return i
//     }
//     tileWithNumberExists(num:number){
//         let res = false
//         this.game.getTiles().forEach((tile:Tile)=>{
//             if (tile.getTileNumber() === num){
//                 res = true
//             }
        
//         })
//         return res
//     }
//     findTileById(id:number):Tile{
//         let t:Tile = undefined!
//         this.game.getTiles().forEach((tile:Tile)=>{
//             if (tile.getId() == id){
//                 t = tile
              
//             }
      
//         })
//         return t
//     }
//     findTileByNextTileNumber(id:number,token:string):Tile{
//         let t:Tile = undefined!
//         this.game.getTiles().forEach((tile:Tile)=>{
//             if (tile.getNextTilesIds().get(token) == id){
//                 t = tile
              
//             }
      
//         })
//         return t
//     }


  
//     reactToTile(tile:Tile,returnValue:number,pawn:Pawn){
//         const params = new URLSearchParams(window.location.search);
        
//         if (this.game.getIsOnturn()){
//             console.log('emited react to tile')
//             console.log(this.game.getIsOnturn())
//             let canRemovePawnIds:Array<number> = []
//             this.game.getPlayerTokens().forEach((token:string)=>{
//                 if (!tile.getCantBeEliminatedOnTile().includes(token) && token!=pawn.player){
//                     tile.getPawns().forEach((p:Pawn)=>{
//                         if (p.player == token && !p.hasEnded){
//                             canRemovePawnIds.push(p.id)
//                         }
//                     })
//                 }
//             })
//             editorSocket.emit('react to tile',{room:params.get('id'),
//                                             questionId:tile.getQuestionId(),
//                                             randomQuestion:tile.getRandomQuestion(),
//                                             id:getCookie('id'),
//                                             returnValue:returnValue,
//                                             pawnId:pawn.id,
//                                             forward:tile.getForward(),
//                                             backward:tile.getBackward(),
//                                             skip:tile.getSkip(),
//                                             repeat:tile.getRepeat(),
//                                             mustThrown:tile.getMustThrown(),
//                                             turnsToSetFree:tile.getTurnsToSetFree(),
//                                             canRemovePawnIds:canRemovePawnIds
//                                         })
//             this.game.setIsOnTurn(false)
//         }
        
        
//     }
//     findPawnById(id:number){
//         let res:Pawn = undefined!;
//         this.getGame().getPawns().forEach((pawn:Pawn)=>{
//             if (pawn.id == id){
//                 res = pawn
//             }
//         })
//         return res
//     }
 
//     playerEnded(token:string){
//         let ret = true
//         this.getGame().getTiles().forEach((tile:Tile)=>{
//             if (tile.getIsEndingFor().includes(token) && !tile.isSuccessfullyEnding(token)){
//                 ret =  false
//                 console.log(tile)
//                 console.log(tile.getIsEndingFor().includes(token))
//                 console.log(!tile.isSuccessfullyEnding(token))
//             }
          
//         })
//         return ret
//     }
   
//     movePawnBack(pawnId:number,value:number,react:boolean){
       
//         console.log('vykonal move back pawnId:', pawnId , value, react)
//         let pawn = this.findPawnById(pawnId)
//         let tile = this.findTileById(pawn.tileId)
//         tile.removePawn(pawn)
//         for (let i = 0;i < value;i++){
//             //console.log('Previous tile with id: '+tile.getFollowingTileNumber())
//             console.log('Previous tile with id: '+tile.getNextTilesIds().get(pawn.player))
//             tile = this.findTileByNextTileNumber(tile.getTileNumber()!,pawn.player)
//             console.log('otocil')
//             console.log(tile)
//         }
//         tile.getPawns().push(pawn)
//         pawn.tileId = tile.getId()
//         pawn.tile = tile
//         reload(game,ctx)

//         if (react){
//             this.reactToTile(tile,value,pawn)
//         }
//         // console.log('tile id: '+ tileId + ' pawn id: ' + pawnId)
//         // console.log()
//         // let addTo:Tile =  this.findTileById(tileId);
//         // console.log(addTo)
//         // let pawn:Pawn;
//         // this.getGame().getTiles().forEach((tile:Tile)=>{
//         //     tile.getPawns().forEach((p:Pawn)=>{
//         //         if (p.id == pawnId){
//         //            pawn = p
//         //            p.tileId = tileId
//         //            p.tile = addTo
//         //            addTo.getPawns().push(p)
//         //            tile.removePawn(p)
//         //            console.log('tento pawn:')
//         //            console.log(pawn)
//         //            console.log('tento tile')
//         //            console.log(addTo)
//         //            reload(game,ctx)
//         //         }
//         //     })
            
//         // })
       
//     }

//     setEvents(type:string,values:{num:number,value:number}){
//         this.skip = 0
//         this.repeat = 0
//         this.forward = 0
//         this.backward = 0
//         this.mustThrown = 0;
//         this.turnToSetFree = 0;
//         this.questionId = -1;
//         this.randomQuestion = false;

//         if (type == 'skip'){
//             this.skip = values.num   
//         }
//         else  if (type == 'repeat'){
//             this.repeat = values.num
//         }
//         else  if (type == 'forward'){
//             this.forward = values.num
//         }
//         else if (type == 'backward'){       
//             this.backward = values.num
//         }
//         else if (type == 'stop'){
//             this.mustThrown = values.value;
//             this.turnToSetFree = values.num;
//         }
//         else if (type == 'random'){
//             this.randomQuestion = true
//         }
//         else if(type == 'question'){
//             this.questionId = values.num
//         }
        
//     }
//     checkIfAllPlayersHaveStartingTile():Array<string>{
//         let all = this.game.getPlayerTokens()
//         let present:Set<string> = new Set()
        
//         this.game.getTiles().forEach((tile:Tile)=>{
//             all.forEach((token:string)=>{
//                 if (tile.getIsStartingFor().includes(token)){
//                     present.add(token)
//                 }
//             })

//         })

//         let p = Array.from(present)
//         let notStarted:Array<string> = []
//         all.forEach((token:string)=>{
//             if(!p.includes(token)){
//                 notStarted.push(token)
//             }
//         })
    
//         return notStarted
        
//     }
//     checkIfAllPlayersHaveFinishTile(){
//         let all = this.game.getPlayerTokens()
//         let present:Set<string> = new Set()
        
//         this.game.getTiles().forEach((tile:Tile)=>{
//             all.forEach((token:string)=>{
//                 if (tile.getIsEndingFor().includes(token)){
//                     present.add(token)
//                 }
//             })

//         })

//         let p = Array.from(present)
//         let notFinished:Array<string> = []
//         all.forEach((token:string)=>{
//             if(!p.includes(token)){
//                 notFinished.push(token)
//             }
//         })
    
//         return notFinished
//     }
//     checkIfPathFromStartToEndExists(){

//     }

//   getGame(){
//     return this.game
// }
//     setGame(newGame:Game){
//         this.game = newGame;
// }
//     getChoosenTile(){
//         return this.choosenTile
//     }
//     setChoosenTile(newTile: Tile){
//          this.choosenTile = newTile
//     }
//     public getIsMoving() : boolean {
//         return this.isMoving
//     }
//     public setIsMoving(is:boolean) {
//         this.isMoving = is
//     }
//     public getImage() : HTMLImageElement {
//         return this.image
//     }
//     public setImage(newImage: HTMLImageElement) {
//         this.image = newImage
//     }
//     public getPattern() : HTMLImageElement {
//         return this.pattern
//     }
//     public setPattern(newPattern: HTMLImageElement) {
//         this.pattern = newPattern
//     }
//     public setStartForPlayers(newStartForPlayers:Array<string>){
//         this.startForPlayers = newStartForPlayers
//     }
//     public getStartForPlayers():Array<string>{
//         return this.startForPlayers
//     }
//     public setEndForPlayers(newEndForPlayers:Array<string>){
//         this.endForPlayers = newEndForPlayers
//     }
//     public getEndForPlayers():Array<string>{
//         return this.endForPlayers
//     }
//     public setEnabledForPlayers(newEnabledForPlayers:Array<string>){
//         this.enabledForPlayers = newEnabledForPlayers
//     }
//     public getEnabledForPlayers():Array<string>{
//         return this.enabledForPlayers
//     }
//     public setCantBeEliminatedOnTile(newPlayers:Array<string>){
//         this.cantBeEliminatedOnTile = newPlayers
//     }
//     public getCantBeEliminatedOnTile():Array<string>{
//         return this.cantBeEliminatedOnTile
//     }
//     public getQuestionId(){
//         return this.questionId
//     }
//     public setQuestionId(newId:number){
//         this.questionId = newId
//     }
//     public getSkip(){
//         return this.skip
//     }
//     public setSkip(newSkip:number){
//         this.skip = newSkip
//     }
//     public getRepeat(){
//         return this.repeat
//     }
//     public setRepeat(newRepeat:number){
//         this.repeat = newRepeat
//     }
//     public getForward(){
//         return this.forward
//     }
//     public setForward(newForward:number){
//         this.forward = newForward
//     }
//     public getBackward(){
//         return this.backward
//     }
//     public setBackward(newBackward:number){
//         this.backward = newBackward
//     }
//     public getNextTileId(){
//         return this.nextTileId
//     }
//     public setNextTileId(newId:number){
//         this.nextTileId = newId
//     }
//     public getMustThrown(){
//         return this.mustThrown
//     }
//     public setMustThrown(newThrown:number){
//         this.mustThrown = newThrown
//     }
//     public getTurnsToSetFree(){
//         return this.turnToSetFree
//     }
//     public setTurnsToSetFree(newTurns:number){
//         this.turnToSetFree = newTurns
//     }
//     public setRandomQuestion(is:boolean){
//         this.randomQuestion = is
//     }
//     public getRandomQuestion(){
//         return this.randomQuestion
//     }
  
    
}




export{GameEditor}