import {Point} from './Point.js'
class Path{
    private path:Array<Point> =[];
    private type:String = '';
    private tilesNumber:Number = 0;
    private length:Number = 0;
    private toggle:boolean = true;

    constructor(){
       
    }

    public add(newPoint:Point){
    this.path.push(newPoint);
    }
    
    public makeLastPointEnding(){
        this.path[this.path.length-1].setEnd(true)
    }

    public setType(type:string){
        this.type = type;
    }

    public getType(){
        return(this.type)
    }
    public getPath(){
        return this.path;
    }
    public setPath(newPath:Array<Point>){
        this.path = newPath;
    }
}

export{Path}