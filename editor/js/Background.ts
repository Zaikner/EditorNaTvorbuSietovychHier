import {canvas,ctx} from "./Canvas"
import { getDataUrlFromImage } from "./UtilityFunctions"

class Background{
    private backgroundImage:HTMLImageElement = undefined!
    private color:string = 'wheat'
   
    public draw(){
        if (this.backgroundImage!= undefined){
             ctx.drawImage(this.backgroundImage,0,0,canvas.width,canvas.height-40)
        }
        else{
            ctx.beginPath()
            ctx.fillStyle = this.color
           
            ctx.fillRect(0,0,canvas.width,canvas.height)
        }

    }
  
    save(){
        return {
            backgroundImage:this.getBackgroundImage() === undefined?'none':getDataUrlFromImage(this.getBackgroundImage()),
            color:this.getColor(),
    }
    }
    
    public setColor(newColor:string){
        this.color = newColor
        console.log('prestavil backgroud')
    }
    public getColor(){
        return this.color
    }
    public getBackgroundImage(){
        return this.backgroundImage
    }
    public setBackgroundImage(newImage:HTMLImageElement){
         this.backgroundImage = newImage
    }
   
}

export {Background}