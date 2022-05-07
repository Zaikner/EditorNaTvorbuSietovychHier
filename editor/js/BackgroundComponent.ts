import { throws } from "assert";
import { canvas,ctx, game } from "./canvas"
import { getDataUrlFromImage } from "./utilityFunctions";


class BackgroundComponent{
    
    private image:HTMLImageElement = undefined!
    private color:string = 'wheat'
    private strokeColor:string = ''
    private stroke:number = 0
    private type:string = '';
    private centerX:number = 0;
    private centerY:number = 0;
    private x1:number = 0;
    private x2:number = 0;
    private y1:number = 0;
    private y2:number = 0;
    private radius:number = 0;
    private imageWidth:number = 0;
    private imageHeigth:number = 0;
    private isChoosen:boolean = false;


    constructor(){
    }

    public draw(ctx:CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.save()
        
        if (this.type == 'circle' || this.type == 'square'){
            
            ctx.strokeStyle =this.color
            ctx.lineWidth = 0
            ctx.fillStyle = this.color
            ctx.scale(game.getScaleX(),game.getScaleY())
            
        
            if (this.type == 'circle'){
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
      
            }
            else if (this.type == 'square'){
                ctx.rect(this.x1,this.y1,this.radius*2,this.radius*2)
            }
            ctx.resetTransform();
            ctx.fill();  
            //ctx.restore()
        }
        else if(this.type == 'image' && this.image!=undefined){
          
            ctx.save()
            ctx.scale(game.getScaleX(),game.getScaleY())
            ctx.fillStyle = 'black'
            
            //ctx.fill()
         
            
            ctx.drawImage(this.image!,this.centerX-this.imageWidth/2,this.centerY-this.imageHeigth/2,this.imageWidth,this.imageHeigth)
            ctx.resetTransform();
            //ctx.restore()
       
        }
        
       

        if (this.stroke > 0){
            ctx.scale(game.getScaleX(),game.getScaleY())
             ctx.strokeStyle =this.strokeColor
             ctx.lineWidth = this.stroke
             ctx.stroke();
         }

         if (this.isChoosen){
            if (this.type == 'circle'){
                 // ctx.lineWidth = 10
        // ctx.strokeStyle = '#FF0000'
        // ctx.setLineDash([1]);
        // ctx.stroke()
        // ctx.setLineDash([0]);
        ctx.restore()
        let num = ctx.lineWidth
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        ctx.scale(game.getScaleX(),game.getScaleY())
        
        var grd = ctx.createRadialGradient(this.centerX,this.centerY,this.radius,this.centerX,this.centerY,this.radius+15);
       
        grd.addColorStop(0, "red");
        //grd.addColorStop(0.5, "#990000");
         grd.addColorStop(0.33, '#990000');
         grd.addColorStop(0.66, 'pink');
        ctx.lineWidth = this.stroke
        ctx.strokeStyle = grd
        ctx.stroke()
       
        ctx.resetTransform();
            }
            else if (this.type == 'squire'){
                ctx.scale(game.getScaleX(),game.getScaleY())
                ctx.rect(this.x1,this.y1,this.radius*2,this.radius*2)
                var grd = ctx.createLinearGradient(this.x1,this.y1,this.x2,this.y2);

                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                 grd.addColorStop(0.33, '#990000');
                 grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = this.stroke
                ctx.strokeStyle = grd
                ctx.stroke()
                ctx.resetTransform();
            }
            else if (this.type == 'image'){
                ctx.scale(game.getScaleX(),game.getScaleY())
                ctx.rect(this.x1,this.y1,this.imageWidth,this.imageWidth)
                var grd = ctx.createLinearGradient(this.x1,this.y1,this.x2,this.y2);

                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                 grd.addColorStop(0.33, '#990000');
                 grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = this.stroke
                ctx.strokeStyle = grd
                ctx.stroke()
                ctx.resetTransform();
            }
    }

         ctx.restore()
         ctx.resetTransform()
         ctx.closePath()
      
    }
    isPointedAt(x:number,y:number){
        if (this.type == 'circle'){
            if (Math.sqrt( Math.pow((this.centerX-x), 2) + Math.pow((this.centerY-y), 2)) <= this.radius+this.stroke)
           {   
               return true
           }
        }
        if (this.type == 'square' || this.type == 'image'){
            if (this.x1-this.stroke <= x && x <= this.x2+this.stroke && this.y1-this.stroke <= y && y <= this.y2+this.stroke){
              
                return true
            }
        }
     

        return false;
    }
    save(){
        return {
            image:this.image === undefined?'none':getDataUrlFromImage(this.image),
            color:this.color,
            strokeColor:this.strokeColor,
            stroke:this.stroke,
            type:this.type,
            centerX:this.centerX,
            centerY:this.centerY,
            x1:this.x1,
            x2:this.x2,
            y1:this.y1,
            y2:this.y2,
            radius:this.radius,
            imageHeigth:this.imageHeigth,
            imageWidth:this.imageWidth
  
        }
    }

    
    public setColor(newColor:string){
        this.color = newColor
    }
    public getColor(){
        return this.color
    }
    public setStrokeColor(newColor:string){
        this.strokeColor = newColor
    }
    public getStrokeColor(){
        return this.strokeColor
    }
    public getStroke(){
        return this.stroke
    }
    public setStroke(newStroke:number){
        this.stroke = newStroke
    }
    public getImage(){
        return this.image
    }
    public setImage(newImage:HTMLImageElement){
         this.image = newImage
    }
    public getImageWidth(){
        return this.imageWidth
    }
    public setImageWidth(newWidth:number){
         this.imageWidth = newWidth
    }
    public getImageHeight(){
        return this.imageHeigth
    }
    public setImageHeight(newHeight:number){
         this.imageHeigth = newHeight
    }
    public setType(newType:string){
        this.type = newType
    }
    public getType(){
        return this.type
    }
    public setX1(newX1:number){
        this.x1 = Math.floor(newX1)
    }
    public getX1(){
        return this.x1
    }
    public setX2(newX2:number){
        this.x2 = Math.floor(newX2)
    }
    public getX2(){
        return this.x2
    }
    public setY1(newY1:number){
        this.y1 = Math.floor(newY1)
    }
    public getY1(){
        return this.y1
    }
    public setY2(newY2:number){
        this.y2 = Math.floor(newY2)
    }
    public getY2(){
        return this.y2
    }
    public setCenterX(newCenterX:number){
        this.centerX = Math.floor(newCenterX)
    }
    public getCenterX(){
        return this.centerX
    }

    public setCenterY(newCenterY:number){
        this.centerY = Math.floor(newCenterY)
    }
    public getCenterY(){
        return this.centerY
    }
    public setRadius(newRadius:number){
        this.radius = Math.floor(newRadius)
    }
    public getRadius(){
        return this.radius
    }
    public setIsChoosen(is:boolean){
        this.isChoosen = is
    }
    public getIsChoosen(){
        return this.isChoosen
    }
}

export {BackgroundComponent}