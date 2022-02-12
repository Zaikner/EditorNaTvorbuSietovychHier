import {Point} from './Point.js'
class Path{
    private path:Array<Point> =[];
    private type:String = '';
    constructor(){
       
    }

    public add(newPoint:Point){
    this.path.push(newPoint);
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