class Point{
    private x: number;
    private y: number;
    private end:boolean;

    constructor(x:number,y:number,end:boolean){
        this.x = x;
        this.y = y;
        this.end = end;
    }

    public isInRange(otherX:number,otherY:number,range:number):boolean{
        return Math.sqrt( Math.pow((this.x-otherX), 2) + Math.pow((this.y-otherY), 2)) >= range 
    }

    public getX(){
        return this.x;
    }
    public getY(){
        return this.y;
    }
    public getEnd(){
        return this.end;
    }
    public setX(x:number){
        this.x = x;
    }
    public setY(y:number){
        this.y = y;
    }
    public setEnd(end:boolean){
        this.end = end;
    }
    
}
export{Point}