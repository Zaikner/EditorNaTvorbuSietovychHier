import { BackgroundComponent } from "./BackgroundComponent"
import { editComponent } from "./BackgroundEditor"
import { calibreEventCoords, canvas,ctx, game} from "./canvas"
import { getDataUrlFromImage } from "./utilityFunctions"


class Background{
    private backgroundImage:HTMLImageElement = undefined!
    private color:string = 'wheat'
    private nextComponentImage:HTMLImageElement = undefined!
    private components:Array<BackgroundComponent> = []
    private choosenComponent?:BackgroundComponent = undefined!
    private undoLog:Array<BackgroundComponent> = []
    private isMoving:Boolean = false

    public draw(){
        // ctx.resetTransform();
        // ctx.restore()
        // ctx.beginPath()
        // ctx.closePath()
        // ctx.scale(game.getScaleX(),game.getScaleY())
        if (this.backgroundImage!= undefined){
             ctx.drawImage(this.backgroundImage,0,0,canvas.width,canvas.height)
        }
        else{
            ctx.beginPath()
            ctx.fillStyle = this.color
            ctx.fillRect(0,0,canvas.width,canvas.height)
        }

        this.components.forEach((component:BackgroundComponent)=>{
            component.draw(ctx)
        })

        // ctx.resetTransform();
        // ctx.restore()
    }
    public createComponent(event:MouseEvent,type:string,radius:number,color:string,stroke:number,strokeColor:string,image:HTMLImageElement = undefined!,imageWidth:number = 0,imageHeigth:number = 0){
        let coords = calibreEventCoords(event)
        

        let newComponent = new BackgroundComponent()
        newComponent.setType(type)
        newComponent.setColor(color)
        newComponent.setImage(image)
        newComponent.setImageHeight(imageHeigth)
        newComponent.setImageWidth(imageWidth)
        newComponent.setCenterX(coords.x)
        newComponent.setCenterY(coords.y)
        newComponent.setRadius(radius)
        newComponent.setStroke(stroke)
        newComponent.setStrokeColor(strokeColor)

        if (type != 'image'){
            newComponent.setX1(coords.x-radius)
            newComponent.setY1(coords.y-radius)
            newComponent.setX2(coords.x+radius)
            newComponent.setY2(coords.y+radius)
        }
        else{
            newComponent.setX1(coords.x-imageWidth/2)
            newComponent.setY1(coords.y-imageHeigth/2)
            newComponent.setX2(coords.x+imageWidth/2)
            newComponent.setY2(coords.y+imageHeigth/2)
        }
        this.components.push(newComponent)
       this.undoLog.push(newComponent)
       return newComponent
    }
    public deleteFromUndoLog(){
        if (this.undoLog.length > 0){
            this.removeComponent(this.undoLog.pop()!)
        }
        
    }
    public removeComponent(removeComponent:BackgroundComponent){
        this.components = this.components.filter((c) => {return c != removeComponent});
    }
    public delete(){
        this.backgroundImage= undefined!
        this.color = 'wheat'
    }

    public deleteComponent(event:MouseEvent){
        let coords = calibreEventCoords(event)
        let rem = undefined
        for (let i = this.components.length-1; i >= 0;i--){
            if (this.components[i].isPointedAt(coords.x,coords.y)){
                rem = this.components[i]
            }
        }
        if (rem!=undefined){
            this.removeComponent(rem)
        }
    }
   

    public makeAllComponentsNotChoosen(){
        this.choosenComponent = undefined!

        this.components.forEach((c:BackgroundComponent)=>{
            c.setIsChoosen(false)
        })
    }

    public findComponent(event:MouseEvent,edit:boolean){
        let coords = calibreEventCoords(event)
        
        for (let i = this.components.length-1; i >= 0;i--){
            if (this.components[i].isPointedAt(coords.x,coords.y)){
                
                if (this.components[i] == this.choosenComponent){
                    this.components[i].setIsChoosen(false)               
                    this.choosenComponent = undefined
                }
                else{
                    if (this.choosenComponent!= undefined){
                        this.choosenComponent!.setIsChoosen(false) 
                    }              
                    this.components[i].setIsChoosen(true)
                    this.choosenComponent = this.components[i]
                    if (!this.isMoving && edit)editComponent()
                }
                break
            }
        }
    }

    moveComponent(event:MouseEvent){
        let coords = calibreEventCoords(event)
        this.choosenComponent?.setCenterX(coords.x)
        this.choosenComponent?.setCenterY(coords.y)
        this.choosenComponent?.setX1(coords.x-this.choosenComponent?.getRadius())
        this.choosenComponent?.setX2(coords.x+this.choosenComponent?.getRadius())
        this.choosenComponent?.setY1(coords.y-this.choosenComponent?.getRadius())
        this.choosenComponent?.setY2(coords.y+this.choosenComponent?.getRadius())

        if (this.choosenComponent?.getType() != 'image'){
            this.choosenComponent?.setX1(coords.x-this.choosenComponent?.getRadius())
            this.choosenComponent?.setX2(coords.x+this.choosenComponent?.getRadius())
            this.choosenComponent?.setY1(coords.y-this.choosenComponent?.getRadius())
            this.choosenComponent?.setY2(coords.y+this.choosenComponent?.getRadius())
        }
        else{
            this.choosenComponent?.setX1(coords.x-this.choosenComponent?.getImageWidth()/2)
            this.choosenComponent?.setX2(coords.x+this.choosenComponent?.getImageWidth()/2)
            this.choosenComponent?.setY1(coords.y-this.choosenComponent?.getImageHeight()/2)
            this.choosenComponent?.setY2(coords.y+this.choosenComponent?.getImageHeight()/2)
        }
    }
    save(){
        let components:any = []
        this.components.forEach((c:BackgroundComponent)=>{
            components.push(c.save())
        })
        return {
            backgroundImage:this.getBackgroundImage() === undefined?'none':getDataUrlFromImage(this.getBackgroundImage()),
            color:this.getColor(),
            components:components
    }
    }
    
    public setColor(newColor:string){

        this.color = newColor
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
    public getComponents(){
        return this.components
    }
    public setComponents(newComponents:Array<BackgroundComponent>){
        this.components = newComponents
    }
    public getChoosenComponent(){
        return this.choosenComponent
    }
    public setChoosenComponent(newComponent:BackgroundComponent){
        this.choosenComponent = newComponent
    }
    public getNextComponentImage(){
        return this.nextComponentImage
    }
    public setNextComponentImage(newImage:HTMLImageElement){
        this.nextComponentImage = newImage
    }
    public setUndoLog(newLog:Array<BackgroundComponent>){
        this.undoLog = newLog
    }
    public getUndoLog(){
        return this.undoLog
    }
}

export {Background}