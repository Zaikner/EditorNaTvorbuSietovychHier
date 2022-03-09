import { canvas,ctx } from "./canvas"


class Background{
    private backgroundImage:HTMLImageElement = undefined!
    private color:string = 'wheat'

    public draw(){
        console.log('spustil draw')
        if (this.backgroundImage!= undefined){
             ctx.drawImage(this.backgroundImage,0,0,canvas.width,canvas.height)
        }
        else{
            ctx.beginPath()
            ctx.fillStyle = this.color
            ctx.fillRect(0,0,canvas.width,canvas.height)
        }
    }
    public delete(){
        this.backgroundImage= undefined!
        this.color = 'wheat'
    }
    public setColor(newColor:string){
        console.log ('setol '+ this.color)
        this.color = newColor
        console.log ('setol '+ this.color)
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