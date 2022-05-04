import {Path} from './Path.js'
import {Tile} from './Tile.js'
import {Background} from './Background.js'
import { editor} from './canvas.js';
import { editorSocket, getCookie, texts} from './clientSocket.js'
import {getDataUrlFromImage} from './utilityFunctions.js'
import { Warning } from './Warning.js';
import { Pawn } from './Pawn.js';
import { PawnStyle } from './PawnStyle.js';
class Game{
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
                                          
                                          tiles:savedTiles,
                                          numOfPlayers:this.numOfPlayers,
                                          pawns:savedPawns,
                                          styles:savedPawnStyles,
                                          rules:this.rules,
                                          id:getCookie('id'),
                                          nextTilesIds:this.mapNextTiles(),
                                          initSizeX:this.initSizeX,
                                          initSizeY:this.initSizeY,
                                          isPublished:this.isPublished,
                                          toogleNumber:this.toogleNumber
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
            console.log(p)
            if (p.id == id && !moved){
                console.log('pohol som idkcom' + id + ' o ' + value)
                
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
        let pawn = editor.findPawnById(id)
      
        while (!pawn.canMove(value)){
          value--;
        }
        return value
    }
    howManyCanMoveBack(id:number,value:number){
        let pawn = editor.findPawnById(id)

        let originalTile = editor.findTileById(pawn.tileId)
        let tileId = originalTile.getTileNumber()
        let ret = 0
        while (value > 0){
            let tileId = originalTile.getTileNumber()
            for (let i = 0;i < value;i++){
                
                let tile = editor.findTileByNextTileNumber(tileId,pawn.player)
                if (tile != undefined)
                {
                    tileId = tile.getTileNumber()
                    if (i+1 == value){
                        ret = value
                    }
                }
               
        
              
            }
            value--;
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
        let numOfQuestions = Array.from(editor.getGame().getQuestions().entries()).length
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
    // getHasStarted(){
    //     return  this.hasStarted
    // }
    // setHasStarted(newStarted:boolean){
    //     this.hasStarted = newStarted
    // }
}

export{Game}