import {Path} from './Path.js'
import {Tile} from './Tile.js'
import {Background} from './Background.js'
class Game{
    private name:String = "";
    private author:String = "";
    private path:Path = new Path();
    //players:Array<Player>
    private numOfPlayers:number = 0;
    private tiles:Array<Tile> = [];
    private background:Background = new Background()
    

    constructor(){}


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
}

export{Game}