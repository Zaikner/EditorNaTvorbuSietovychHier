import {Path} from './Path.js'
import {Tile} from './Tile.js'
import {Background} from './Background.js'
import { editorSocket,editor } from './canvas.js';
import {getDataUrlFromImage} from './utilityFunctions.js'
class Game{
    private name:String = "";
    private author:String = "";
    private path:Path = new Path();
    //players:Array<Player>
    private numOfPlayers:number = 2;
    private tiles:Array<Tile> = [];
    private playerTokens:Array<string> = ['Player 1','Player 2']
    private background:Background = new Background()
    private nextTileNumber = 1
    

    constructor(){}

    saveGame(){
    
        
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
    setAuthor(newAuthor:String){
        this.author = newAuthor;
    }
    getName(){
        return this.name;
    }
    setName(newName:String){
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
    
}

export{Game}