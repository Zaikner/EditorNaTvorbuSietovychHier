
class Tile{
    private type:string;
    private centerX:number;
    private centerY:number;
    private x1:number;
    private x2:number;
    private y1:number;
    private y2:number;
    private radius:number;
    private isOccupied:boolean = false;
    private color:string = "";
    private stroke:number = 0;
    private strokeColor:string ='';
    private shape:string = 'circle'
    private isChoosen:boolean = false;
    private backgroundFile?:HTMLImageElement = undefined;
    private patternFile?:HTMLImageElement = undefined;
    private tileNumber:number;
    private isEnding:boolean = false;
    private isStarting:boolean = false;
    private belongTo:string = '';

    constructor(type:string,centerX:number,centerY:number,x1:number,x2:number,y1:number,y2:number, radius:number,color:string,tileNumber:number){
        this.type = type;
        this.centerX = centerX;
        this.centerY = centerY;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.radius = radius;
        this.tileNumber = tileNumber;
    }


    public drawTile(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
        // kresli//
      
        ctx.beginPath();
        //obrazec bez outline -- nuluje
        if (this.backgroundFile == undefined && this.patternFile == undefined){
            ctx.strokeStyle =this.color
            ctx.lineWidth = 0
            ctx.fillStyle = this.color
            
        
            if (this.shape == 'circle'){
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
      
            }
            else if (this.shape == 'square'){
                ctx.rect(this.x1,this.y1,this.radius*2,this.radius*2)
            }
            ctx.fill();
        }
        else if (this.backgroundFile != undefined){
                // //kresli image
            if (this.shape == 'circle'){
                ctx.save()
                var clipPath = new Path2D()
                clipPath.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black'
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                //ctx.fill()
                ctx.stroke()
                
                ctx.drawImage(this.backgroundFile!,this.x1,this.y1,2*this.radius,2*this.radius)
                ctx.restore()
                //ctx.restore()
            }
            else{
                ctx.save()
                var clipPath = new Path2D()
                clipPath.rect(this.x1,this.y1,this.radius*2,this.radius*2)
                ctx.clip(clipPath);
                ctx.fillStyle = 'black'
                ctx.rect(this.x1,this.y1,this.radius*2,this.radius*2)
                //ctx.fill()
                ctx.stroke()
                
                ctx.drawImage(this.backgroundFile!,this.x1,this.y1,2*this.radius,2*this.radius)
                ctx.restore()
            }
        }
        else if (this.patternFile != undefined){
            if (this.shape == 'circle'){
                ctx.save()
                var clipPath = new Path2D()
                clipPath.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black'
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                //ctx.fill()
                ctx.stroke()
                
                for (let i = 0;i*20+this.x1 < this.x2;i++){
                    for (let j = 0;j*20+this.y1 < this.y2;j++){
                    ctx.drawImage(this.patternFile!,this.x1+i*20,this.y1+j*20,20,20)}
                }
                ctx.restore()
                //ctx.restore()
            }
            else{
                ctx.save()
                var clipPath = new Path2D()
                clipPath.rect(this.x1,this.y1,this.radius*2,this.radius*2)
                ctx.clip(clipPath);
                ctx.fillStyle = 'black'
                ctx.rect(this.x1,this.y1,this.radius*2,this.radius*2)
                //ctx.fill()
                ctx.stroke()
                
                for (let i = 0;i*20+this.x1 < this.x2;i++){
                    for (let j = 0;j*20+this.y1 < this.y2;j++){
                    ctx.drawImage(this.patternFile!,this.x1+i*20,this.y1+j*20,20,20)}
                }
                ctx.restore()
            }
        

        }
        
            //outline
             if (this.stroke > 0){
                
                 ctx.strokeStyle =this.strokeColor
                 ctx.lineWidth = this.stroke
                 ctx.stroke();
             }
          
            // ak je vybrany
    
                 if (this.isChoosen){
                    if (this.shape == 'circle'){
                         // ctx.lineWidth = 10
                // ctx.strokeStyle = '#FF0000'
                // ctx.setLineDash([1]);
                // ctx.stroke()
                // ctx.setLineDash([0]);
                var grd = ctx.createRadialGradient(this.centerX,this.centerY,this.radius,this.centerX,this.centerY,this.radius+8);
                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                 grd.addColorStop(0.33, '#990000');
                 grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = 15
                ctx.strokeStyle = grd
                ctx.stroke()
                    }
                    else{
                        var grd = ctx.createLinearGradient(this.x1,this.y1,this.x2,this.y2);
                        grd.addColorStop(0, "red");
                        //grd.addColorStop(0.5, "#990000");
                         grd.addColorStop(0.33, '#990000');
                         grd.addColorStop(0.66, 'pink');
                        ctx.lineWidth = 15
                        ctx.strokeStyle = grd
                        ctx.stroke()
                    }
            }
            ctx.font = "30px Arial";
            ctx.fillStyle = 'white'
            ctx.textBaseline = 'middle';
            ctx.fillText(this.tileNumber.toString(),this.centerX-8,this.centerY)
    }

    isPointedAt(x:number,y:number){
        if (this.shape == 'circle'){
            if (Math.sqrt( Math.pow((this.centerX-x), 2) + Math.pow((this.centerY-y), 2)) <= this.radius)
           {   
               return true
           }
        }
        if (this.shape == 'square'){
            if (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2){
              
                return true
            }
            
        }

        return false;
    }



    public setStroke(newStroke:number){
        this.stroke = newStroke
    }
    public getStroke(){
        return this.stroke
    }
    public setStrokeColor(newStrokeColor:string){
        this.strokeColor = newStrokeColor
    }
    public getStrokeColor(){
        return this.strokeColor
    }
    public setShape(newShape:string){
        this.shape = newShape
    }
    public getShape(){
        return this.shape
    }

    public setIsChoosen(isChosen:boolean){
        this.isChoosen = isChosen
    }
    public getIsChoosen(){
        return this.isChoosen
    }
    public setType(newType:string){
        this.type = newType
    }
    public getType(){
        return this.type
    }
    public setX1(newX1:number){
        this.x1 = newX1
    }
    public getX1(){
        return this.x1
    }
    public setX2(newX2:number){
        this.x2 = newX2
    }
    public getX2(){
        return this.x2
    }
    public setY1(newY1:number){
        this.y1 = newY1
    }
    public getY1(){
        return this.y1
    }
    public setY2(newY2:number){
        this.y2 = newY2
    }
    public getY2(){
        return this.y2
    }
    public setCenterX(newCenterX:number){
        this.centerX = newCenterX
    }
    public getCenterX(){
        return this.centerX
    }

    public setCenterY(newCenterY:number){
        this.centerY = newCenterY
    }
    public getCenterY(){
        return this.centerY
    }
    public setRadius(newRadius:number){
        this.radius = newRadius
    }
    public getRadius(){
        return this.radius
    }
    public setIsOccupied(newIsOccupied:boolean){
        this.isOccupied = newIsOccupied
    }
    public getIsOccupied(){
        return this.isOccupied
    }
    public setColor(newColor:string){
        this.color = newColor
    }
    public getColor(){
        return this.color
    }
    public getBackgroundFile(){
        return this.backgroundFile
    }
    public setBackgroundFile(newFile:HTMLImageElement){
         this.backgroundFile = newFile
    }
    public getPatternFile(){
        return this.patternFile
    }
    public setPatternFile(newFile:HTMLImageElement){
         this.patternFile = newFile
    }


}

export{Tile};