import {Path} from './Path.js'
import {Tile} from './Tile.js'
import {Background} from './Background.js'
import { calibreEventCoords, canvas, ctx, game, reload} from './canvas.js';
import { editorSocket, getCookie, texts} from './clientSocket.js'
import {getDataUrlFromImage} from './utilityFunctions.js'
import { Warning } from './Warning.js';
import { Pawn } from './Pawn.js';
import { PawnStyle } from './PawnStyle.js';
import { editTiles, insert } from './TileEditor.js';
class Game{
    private id:number = 0
    private name:string = "";
    private author:string = "";
    private path:Path = new Path();
    //players:Array<Player>
    private numOfPlayers:number = 2;
    private tiles:Array<Tile> = [];
    private playerTokens:Array<string> = ['Player 1','Player 2']
    private pawnStyle:Map<string,PawnStyle>= new Map([['Player 1',new PawnStyle('Player 1','#000000','type1')],['Player 2',new PawnStyle('Player 2','#000000','type1')]])
                              
    private background:Background = new Background()
    private nextTileNumber = 1
    private initSizeX:number = 0
    private initSizeY:number = 0;
    private scaleX:number = 1;
    private scaleY:number = 1;
    private pawns:Array<Pawn> = []
    private rules:string = ''
    private isPublished:boolean = false;
    private numberOfStartingPawns:number = 1;
    
    //----------playing---------
    //private hasStarted = false;
    private isOnTurn = false
    private nextTilesIds:Map<string,number> = new Map()
    private canThrow = false;
    private toogleNumber = false;
    private questions:Map<number,string> = new Map()

    
    private choosenTile?:Tile = undefined;
    private undoLog:Array<Array<Tile>> = []
    private isMoving = false
    private image:HTMLImageElement = undefined!;
    private pattern:HTMLImageElement = undefined!;
    private startForPlayers:Array<string> = []
    private endForPlayers:Array<string> = []
    private enabledForPlayers:Array<string> = []
    private cantBeEliminatedOnTile:Array<string> = []

    private nextTileId = 0;
    private questionId = -1;
    private skip = 0;
    private repeat = 0;
    private forward = 0;
    private backward = 0;
    private mustThrown = 0;
    private turnToSetFree = 0;
    private randomQuestion = false;

    constructor(){

    }

    saveGame(){
        if (this.name.length == 0){
            Warning.show(texts[182])
        }
        else{
            let savedTiles:any = []
            this.tiles.forEach((tile:Tile)=>{
                savedTiles.push(tile.JSONfyTile())
            })
            let savedPawns:any = []
            this.pawns.forEach((pawn:Pawn)=>{
                savedPawns.push(pawn.JSONfyPawn())
            })
            let savedPawnStyles:any = []
            Array.from(this.pawnStyle.values()).forEach((pawnStyle:PawnStyle)=>{
                savedPawnStyles.push(pawnStyle.JSONfyStyle())
            })
            


            editorSocket.emit('saveGame',{name:this.name,
                                          author:this.author,
                                          background:this.background.save(),
                                          id:this.id,
                                          tiles:savedTiles,
                                          numOfPlayers:this.numOfPlayers,
                                          pawns:savedPawns,
                                          styles:savedPawnStyles,
                                          rules:this.rules,
                                          clientId:getCookie('id'),
                                          nextTilesIds:this.mapNextTiles(),
                                          initSizeX:this.initSizeX,
                                          initSizeY:this.initSizeY,
                                          isPublished:this.isPublished,
                                          toogleNumber:this.toogleNumber,
                                          numOfPawnsPerTile:this.numberOfStartingPawns
                                        })
           
        }
        
       
    }
    insertPawns(player:string,tile:Tile){
        for (let i = 0; i<this.numberOfStartingPawns; i++){
            let pwn = new Pawn(player,tile)
            this.pawns.push(pwn)
        }
       
    }

    findTileByTileId(id:number){
        let tile = undefined
        this.tiles.forEach((t:Tile)=>{
            if (t.getTileNumber() == id){
                tile = t
            }
        })

        return tile
    }
    movePawnById(id:number,value:number){
        let  moved = false
        this.pawns.forEach((p:Pawn)=>{
            if (p.id == id && !moved){    
                moved = true
                if (p.canMove(value)){
                    p.move(value)
                }
                else{
                    console.log('found pawn but cant move')
                }
               
                return p
            }
        })}
    howManyCanMove(id:number,value:number){
        let pawn = game.findPawnById(id)
      
        while (!pawn.canMove(value)){
          value--;
        }
        return value
    }
    howManyCanMoveBack(id:number,value:number){
        let pawn = game.findPawnById(id)

        let originalTile = game.findTileById(pawn.tileId)
        let tileId = originalTile.getTileNumber()
        let ret = 0
        // while (value > 0){
        //     let tileId = originalTile.getTileNumber()
        //     for (let i = 0;i < value;i++){
                
        //         let tile = game.findTileByNextTileNumber(tileId,pawn.player)
        //         if (tile != undefined)
        //         {
        //             tileId = tile.getTileNumber()
        //             console.log('posunul ale neprehodil hodnotu')
        //             //if (i+1 == value){
        //                 ret+=1
        //             //}
        //         }
               
        
              
        //     }
        //     value--;
        // }
        for (let i = 0;i < value;i++){
                
            let tile = game.findTileByNextTileNumber(tileId,pawn.player)
            if (tile != undefined)
            {
                tileId = tile.getTileNumber()
                //if (i+1 == value){
                    ret+=1
                //}
            }
           
    
          
        }
        
        return ret
    }

    mapNextTiles(){
        let ret:Array<string> = []
        Array.from(this.nextTilesIds.entries()).forEach(([key,value])=>{ret.push(key)
                                                                        ret.push(value.toString())})
        return ret
        
    }
    
    containsQuestionId(id:number){
        let ret = false;
        this.tiles.forEach((tile:Tile)=>{
            if (tile.getQuestionId()==id){
                ret = true
            }
        })

        return ret
    }
    containsRandomQuestionAndQuestionNumberIs1(){
        let numOfQuestions = Array.from(this.getQuestions().entries()).length
        let ret = false;
        this.tiles.forEach((tile:Tile)=>{
            if (tile.getRandomQuestion() && numOfQuestions == 1){
                ret = true
            }
        })

        return ret
    }
    removeTile(tile:Tile){
        this.tiles = this.tiles.filter((t) => {return t != tile});
    }
    removePawn(pawn:Pawn){
        this.pawns = this.pawns.filter((p) => {return p != pawn});
    }
    renumber(deleted:number){
        this.getTiles().forEach((tile:Tile)=>{
            if (tile.getTileNumber()>deleted){
                tile.setTileNumber(tile.getTileNumber()-1)

                this.getTiles().forEach((t:Tile)=>{
                    this.getPlayerTokens().forEach((token:string)=>{
                        if (t.getNextTilesIds().get(token) == (tile.getTileNumber()+1)){
                            t.getNextTilesIds().set(token,tile.getTileNumber())
                        }
                    })
                })
            }
        })
      
        reload(game,ctx)
        
    }
    nullEditor(){
        this.startForPlayers = []
        this.endForPlayers = []
        this.enabledForPlayers = []
        this.image = undefined!
        this.pattern = undefined!
    }

    // initNewGame(){
    //     this
        
    //     this.game.getPlayerTokens().forEach((token:string)=>{
    //         this.game.getNextTilesIds().set(token,2)
    //     })
    // }   

    initTile(add:boolean,coords:{x:number,y:number},color:string,size:number,stroke:number,strokeColor:string,shape:string,background?:HTMLImageElement):Tile{
        let tileNumber = this.makeNextTileNumber()
        let newTile = new Tile(coords.x,coords.y,coords.x-size,coords.x+size,coords.y-size,coords.y+size,size,color,this.getNextTileNumber())
        
        if (stroke!=0){
            newTile.setStroke(stroke)
            newTile.setStrokeColor(strokeColor)
            
        }
        if (background!=undefined){
            newTile.setImage(background)
        }
       
   
        newTile.setShape(shape)
        if (add){
            this.addTile(newTile)
            this.nextTileId++;
        }
        
        newTile.drawTile(canvas,ctx,false);
        //this.game.increaseTileNumber()
        newTile.setTileNumber(tileNumber)
        //newTile.setFollowingTileNumber(tileNumber+1)
        
     
        newTile.setId(this.nextTileId)
    
        return newTile
  }
    findTile(event:MouseEvent,edit:boolean){
        let found = false;
        let coords = calibreEventCoords(event)
        let tiles = this.getTiles()
        
        for (let i = tiles.length-1; i >= 0;i--){
            if (tiles[i].isPointedAt(coords.x,coords.y)){
                found = true
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
                    //if (!this.isMoving && edit)editTiles()
                    
                }
                break
            }
        }

        if (!found){
            insert(event)
        }
        else if (!this.isMoving && edit){
            editTiles()
        }
    }
  
    deleteTile(){
        
        // let coords = calibreEventCoords(event)
        // let tiles = this.game.getTiles()
        
        // for (let i = tiles.length-1; i >= 0;i--){
        //     if (tiles[i].isPointedAt(coords.x,coords.y)){
        //         this.game.removeTile(tiles[i])
        //         tiles[i].getPawns().forEach((pawn:Pawn)=>{
        //             this.game.removePawn(pawn)
        //         })
                
        //         break
        //     }
        // }
    
      if(this.choosenTile!=undefined){
        this.removeTile(this.choosenTile)
        this.renumber(this.choosenTile.getTileNumber())
        this.choosenTile.getPawns().forEach((pawn:Pawn)=>{
                        this.removePawn(pawn)
                     })
        
        reload(game,ctx)
      }
      

     
    }
    updateChoosenTile(color:string,size:number,stroke:number,strokeColor:string,shape:string,image?:HTMLImageElement){
        this.choosenTile?.setColor(color)
        // this.choosenTile?.setCenterX(centerX)
        // this.choosenTile?.setCenterY(centerY)
        // this.choosenTile?.setX1(centerX-size)
        // this.choosenTile?.setX2(centerX+size)
        // this.choosenTile?.setY1(centerY-size)
        // this.choosenTile?.setY2(centerY+size)
        this.choosenTile?.setRadius(size)
        this.choosenTile?.setShape(shape)
        this.choosenTile?.setImage(image!)
        this.choosenTile?.setStroke(stroke)
        this.choosenTile?.setStrokeColor(strokeColor)
        this.choosenTile?.setX1(this.choosenTile.getCenterX()-size)
        this.choosenTile?.setX2(this.choosenTile.getCenterX()+size)
        this.choosenTile?.setY1(this.choosenTile.getCenterY()-size)
        this.choosenTile?.setY2(this.choosenTile.getCenterY()+size)
        
        this.choosenTile
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
        let tiles = this.getTiles()
        tiles.forEach((tile) => {tile.setIsChoosen(false)})
        this.choosenTile = undefined
    }
    addToUndoLog(addition:Array<Tile>){
  
        this.undoLog.push(addition)
    }
    removeLastFromUndoLog(){
        let removed = this.undoLog.pop()
        removed?.forEach((tile:Tile) =>{
            this.removeTile(tile)
        })
    }
    makeNextTileNumber(){
        let i = 1;
        let cont = true
        while (cont){
            cont = false
            this.getTiles().forEach((tile:Tile)=>{
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
        this.getTiles().forEach((tile:Tile)=>{
            if (tile.getTileNumber() === num){
                res = true
            }
        
        })
        return res
    }
    findTileById(id:number):Tile{
        let t:Tile = undefined!
        this.getTiles().forEach((tile:Tile)=>{
            if (tile.getId() == id){
                t = tile
              
            }
      
        })
        return t
    }
    findTileByNextTileNumber(id:number,token:string):Tile{
        let t:Tile = undefined!
        this.getTiles().forEach((tile:Tile)=>{
            if (tile.getNextTilesIds().get(token) == id){
                t = tile
              
            }
      
        })
        return t
    }


  
    reactToTile(tile:Tile,returnValue:number,pawn:Pawn){
        const params = new URLSearchParams(window.location.search);
        
        if (this.getIsOnturn()){
    
            let canRemovePawnIds:Array<number> = []
            this.getPlayerTokens().forEach((token:string)=>{
                if (!tile.getCantBeEliminatedOnTile().includes(token) && token!=pawn.player){
                    tile.getPawns().forEach((p:Pawn)=>{
                        if (p.player == token && !p.hasEnded){
                            canRemovePawnIds.push(p.id)
                        }
                    })
                }
            })
            editorSocket.emit('react to tile',{room:params.get('id'),
                                            questionId:tile.getQuestionId(),
                                            randomQuestion:tile.getRandomQuestion(),
                                            id:getCookie('id'),
                                            returnValue:returnValue,
                                            pawnId:pawn.id,
                                            forward:tile.getForward(),
                                            backward:tile.getBackward(),
                                            skip:tile.getSkip(),
                                            repeat:tile.getRepeat(),
                                            mustThrown:tile.getMustThrown(),
                                            turnsToSetFree:tile.getTurnsToSetFree(),
                                            canRemovePawnIds:canRemovePawnIds
                                        })
            this.setIsOnTurn(false)
        }
        
        
    }
    findPawnById(id:number){
        let res:Pawn = undefined!;
        this.getPawns().forEach((pawn:Pawn)=>{
            if (pawn.id == id){
                res = pawn
            }
        })
        return res
    }
 
    playerEnded(token:string){
        let ret = true
        this.getTiles().forEach((tile:Tile)=>{
            if (tile.getIsEndingFor().includes(token) && !tile.isSuccessfullyEnding(token)){
                ret =  false
            }
          
        })
        return ret
    }
   
    movePawnBack(pawnId:number,value:number,react:boolean){
        let pawn = this.findPawnById(pawnId)
        let tile = this.findTileById(pawn.tileId)
        tile.removePawn(pawn)
        for (let i = 0;i < value;i++){
            tile = this.findTileByNextTileNumber(tile.getTileNumber()!,pawn.player)
        }
        tile.getPawns().push(pawn)
        pawn.tileId = tile.getId()
        pawn.tile = tile
        reload(game,ctx)

        if (react){
            this.reactToTile(tile,value,pawn)
        }
        // console.log('tile id: '+ tileId + ' pawn id: ' + pawnId)
        // console.log()
        // let addTo:Tile =  this.findTileById(tileId);
        // console.log(addTo)
        // let pawn:Pawn;
        // this.getGame().getTiles().forEach((tile:Tile)=>{
        //     tile.getPawns().forEach((p:Pawn)=>{
        //         if (p.id == pawnId){
        //            pawn = p
        //            p.tileId = tileId
        //            p.tile = addTo
        //            addTo.getPawns().push(p)
        //            tile.removePawn(p)
        //            console.log('tento pawn:')
        //            console.log(pawn)
        //            console.log('tento tile')
        //            console.log(addTo)
        //            reload(game,ctx)
        //         }
        //     })
            
        // })
       
    }

    setEvents(type:string,values:{num:number,value:number}){
        this.skip = 0
        this.repeat = 0
        this.forward = 0
        this.backward = 0
        this.mustThrown = 0;
        this.turnToSetFree = 0;
        this.questionId = -1;
        this.randomQuestion = false;

        if (type == 'skip'){
            this.skip = values.num   
        }
        else  if (type == 'repeat'){
            this.repeat = values.num
        }
        else  if (type == 'forward'){
            this.forward = values.num
        }
        else if (type == 'backward'){       
            this.backward = values.num
        }
        else if (type == 'stop'){
            this.mustThrown = values.value;
            this.turnToSetFree = values.num;
        }
        else if (type == 'random'){
            this.randomQuestion = true
        }
        else if(type == 'question'){
            this.questionId = values.num
        }
        
    }
    checkIfAllPlayersHaveStartingTile():Array<string>{
        let all = this.getPlayerTokens()
        let present:Set<string> = new Set()
        
        this.getTiles().forEach((tile:Tile)=>{
            all.forEach((token:string)=>{
                if (tile.getIsStartingFor().includes(token)){
                    present.add(token)
                }
            })

        })

        let p = Array.from(present)
        let notStarted:Array<string> = []
        all.forEach((token:string)=>{
            if(!p.includes(token)){
                notStarted.push(token)
            }
        })
    
        return notStarted
        
    }
    checkIfAllPlayersHaveFinishTile(){
        let all = this.getPlayerTokens()
        let present:Set<string> = new Set()
        
        this.getTiles().forEach((tile:Tile)=>{
            all.forEach((token:string)=>{
                if (tile.getIsEndingFor().includes(token)){
                    present.add(token)
                }
            })

        })

        let p = Array.from(present)
        let notFinished:Array<string> = []
        all.forEach((token:string)=>{
            if(!p.includes(token)){
                notFinished.push(token)
            }
        })
    
        return notFinished
    }
    checkIfPathFromStartToEndExists(){

    }
    setPath(newPath:Path){
        this.path = newPath;
    }
    getPath(){
        return this.path
    }
    setNumOfPlayers(num:number){
        this.numOfPlayers = num
    }
    getnumOfPlayers(){
        return this.numOfPlayers
    }
    setTiles(newTiles:Array<Tile>){
        this.tiles = newTiles;    
    }
    getTiles(){
        return this.tiles
    }
    addTile(newTile:Tile){
        
        this.tiles.push(newTile)
    }
    getAuthor(){
        return this.author;
    }
    setAuthor(newAuthor:string){
        this.author = newAuthor;
    }
    getName(){
        return this.name;
    }
    setRules(newRules:string){
        this.rules = newRules;
    }
    getRules(){
        return this.rules;
    }
    setName(newName:string){
        this.name = newName
    }
    getBackground(){
        return this.background
    }
    setBackground(newBackground:Background){
        this.background = newBackground
    }
    getNextTileNumber(){
        return this.nextTileNumber
    }
    setNextTileNumber(nextTileNumber:number){
        this.nextTileNumber = nextTileNumber
    }
   
   
    setPlayerTokens(newTokens:Array<string>){
        this.playerTokens = newTokens
    }
    getPlayerTokens(){
        return this.playerTokens
    }

    getInitSizeX(){
        return this.initSizeX
    }
    setInitSizeX(newCoord:number){
        return this.initSizeX = newCoord
    }
    getInitSizeY(){
        return this.initSizeY
    }
    setInitSizeY(newCoord:number){
        return this.initSizeY = newCoord
    }
    getScaleX(){
        return this.scaleX
    }
    setScaleX(newCoord:number){
        return this.scaleX = newCoord
    }
    getScaleY(){
        return this.scaleY
    }
    setNumberOfStartingPawns(newNum:number){
        return this.numberOfStartingPawns = newNum
    }
    getNumberOfStartingPawns(){
        return this.numberOfStartingPawns
    }
    setScaleY(newCoord:number){
        return this.scaleY = newCoord
    }
    setPawns(newPawns:Array<Pawn>){
        this.pawns = newPawns
    }
    getPawns(){
        return this.pawns
    }
    setPawnStyle(newPawns:Map<string,PawnStyle>){
        this.pawnStyle = newPawns
    }
    getPawnStyle(){
        return this.pawnStyle
    }

    setIsOnTurn(is:boolean){
        this.isOnTurn = is
    }
    getIsOnturn(){
        return this.isOnTurn
    }
    public setToogleNumber(is : boolean) {
        this.toogleNumber = is;
    }
    public getToogleNumber(){
        return this.toogleNumber}

    public setNextTilesIds(newIds:Map<string,number>){
        this.nextTilesIds = newIds
    }
    public getQuestions(){
        return this.questions}

    public setQuestions(newQuestions:Map<number,string>){
        this.questions = newQuestions
    }
    public getNextTilesIds(){
        return this.nextTilesIds
    }
    setCanThrow(is:boolean){
        this.canThrow = is
    }
    getCanThrow(){
        return this.canThrow
    }
    setIsPublished(is:boolean){
        this.isPublished = is
    }
    getIsPublished(){
        return this.isPublished
    }
    setId(newId:number){
        this.id = newId
    }
    getId(){
        return this.id
    }
    getChoosenTile(){
        return this.choosenTile
    }
    setChoosenTile(newTile: Tile){
         this.choosenTile = newTile
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
    public setCantBeEliminatedOnTile(newPlayers:Array<string>){
        this.cantBeEliminatedOnTile = newPlayers
    }
    public getCantBeEliminatedOnTile():Array<string>{
        return this.cantBeEliminatedOnTile
    }
    public getQuestionId(){
        return this.questionId
    }
    public setQuestionId(newId:number){
        this.questionId = newId
    }
    public getSkip(){
        return this.skip
    }
    public setSkip(newSkip:number){
        this.skip = newSkip
    }
    public getRepeat(){
        return this.repeat
    }
    public setRepeat(newRepeat:number){
        this.repeat = newRepeat
    }
    public getForward(){
        return this.forward
    }
    public setForward(newForward:number){
        this.forward = newForward
    }
    public getBackward(){
        return this.backward
    }
    public setBackward(newBackward:number){
        this.backward = newBackward
    }
    public getNextTileId(){
        return this.nextTileId
    }
    public setNextTileId(newId:number){
        this.nextTileId = newId
    }
    public getMustThrown(){
        return this.mustThrown
    }
    public setMustThrown(newThrown:number){
        this.mustThrown = newThrown
    }
    public getTurnsToSetFree(){
        return this.turnToSetFree
    }
    public setTurnsToSetFree(newTurns:number){
        this.turnToSetFree = newTurns
    }
    public setRandomQuestion(is:boolean){
        this.randomQuestion = is
    }
    public getRandomQuestion(){
        return this.randomQuestion
    }
    // getHasStarted(){
    //     return  this.hasStarted
    // }
    // setHasStarted(newStarted:boolean){
    //     this.hasStarted = newStarted
    // }
}

export{Game}