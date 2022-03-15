import {Path} from './Path.js'
import {Tile} from './Tile.js'
import {Background} from './Background.js'
import { editorSocket} from './canvas.js';
import {getDataUrlFromImage} from './utilityFunctions.js'
import { Warning } from './Warning.js';
class Game{
    private name:string = "";
    private author:string = "";
    private path:Path = new Path();
    //players:Array<Player>
    private numOfPlayers:number = 2;
    private tiles:Array<Tile> = [];
    private playerTokens:Array<string> = ['Player 1','Player 2']
    private background:Background = new Background()
    private nextTileNumber = 1
    private initSizeX:number = 0
    private initSizeY:number = 0;
    private scaleX:number = 2;
    private scaleY:number = 2;
    

    constructor(){}

    saveGame(){
        if (this.name.length == 0){
            Warning.show("You can't create game without name!")
        }
        else{
            let savedTiles:any = []
            this.tiles.forEach((tile:Tile)=>{
                savedTiles.push(tile.JSONfyTile())
            })
            editorSocket.emit('saveGame',{name:this.name,
                                          author:this.author,
                                          background:{
                                                    backgroundImage:this.background.getBackgroundImage() === undefined?'none':getDataUrlFromImage(this.background.getBackgroundImage()),
                                                    color:this.background.getColor()
                                          },
                                          tiles:savedTiles,
                                          numOfPlayers:this.numOfPlayers,
                                        })
            window.location.replace('/')
        }
        
       
    }
    removeTile(tile:Tile){
        this.tiles = this.tiles.filter((t) => {return t != tile});
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
        console.log('aspon spustil')
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
    setScaleY(newCoord:number){
        return this.scaleY = newCoord
    }
    
}

export{Game}