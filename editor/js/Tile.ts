import { editor } from './canvas.js';
import { Pawn } from './Pawn.js';
import { drawPawnType1 } from './PawnEditor.js';
import {getDataUrlFromImage} from './utilityFunctions.js'
class Tile{
    private id:number = 0;
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
    private isEndingFor:Array<String>=[]
    private isStarting:boolean = false;
    private isStartingFor:Array<String>=[]
    private belongTo:string = '';
    private canOccupy:Array<String> = []
    private toggleNumber:boolean = true;
    private numberingColor:string = '#000000'
    private numberOfFollowingTile:number;
    private pawns:Array<Pawn> = []

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
        this.numberOfFollowingTile = tileNumber+1;
    }


    public drawTile(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,showOnlyChange:boolean){
        // // kresli//
        // console.log('vykonal')
        // if (showOnlyChange){
        //     ctx = <CanvasRenderingContext2D>(<HTMLCanvasElement>document.getElementById('changeCanvas')!).getContext("2d");
        // }
        // else{
        //     console.log(editor.getGame().getTiles())
        //     console.log('vytlacil cez false')
        //     console.log(this)
        // }   
        
        ctx.beginPath();
        //obrazec bez outline -- nuluje
        if (this.backgroundFile == undefined && this.patternFile == undefined){
            
            ctx.strokeStyle =this.color
            ctx.lineWidth = 0
            ctx.fillStyle = this.color
            ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
            
        
            if (this.shape == 'circle'){
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
      
            }
            else if (this.shape == 'square'){
                ctx.rect(this.x1,this.y1,this.radius*2,this.radius*2)
            }
            ctx.resetTransform();
            ctx.fill();
            console.log('nakreslil')
        }
        else if (this.backgroundFile != undefined){
                // //kresli image
            if (this.shape == 'circle'){
                ctx.save()
                ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
                var clipPath = new Path2D()
                clipPath.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                ctx.clip(clipPath);
                ctx.fillStyle = 'black'
                ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
                //ctx.fill()
             
                
                ctx.drawImage(this.backgroundFile!,this.x1,this.y1,2*this.radius,2*this.radius)
                ctx.resetTransform();
                ctx.restore()
                //ctx.restore()
            }
            else{
                ctx.save()
                ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
                var clipPath = new Path2D()
                clipPath.rect(this.x1,this.y1,this.radius*2,this.radius*2)
                ctx.clip(clipPath);
                ctx.fillStyle = 'black'
                ctx.rect(this.x1,this.y1,this.radius*2,this.radius*2)
                //ctx.fill()
                ctx.stroke()
                
                ctx.drawImage(this.backgroundFile!,this.x1,this.y1,2*this.radius,2*this.radius)
                ctx.resetTransform();
                ctx.restore()
            }
        }
        else if (this.patternFile != undefined){
            if (this.shape == 'circle'){
                ctx.save()
                ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
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
                ctx.resetTransform();
                ctx.restore()
                //ctx.restore()
            }
            else{
                ctx.save()
                ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
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
                ctx.resetTransform();
                ctx.restore()
            }
        

        }
        
            //outline
             if (this.stroke > 0){
                ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
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
                ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
                var grd = ctx.createRadialGradient(this.centerX,this.centerY,this.radius,this.centerX,this.centerY,this.radius+8);
                grd.addColorStop(0, "red");
                //grd.addColorStop(0.5, "#990000");
                 grd.addColorStop(0.33, '#990000');
                 grd.addColorStop(0.66, 'pink');
                ctx.lineWidth = 15
                ctx.strokeStyle = grd
                ctx.stroke()
                ctx.resetTransform();
                    }
                    else{
                        ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
                        var grd = ctx.createLinearGradient(this.x1,this.y1,this.x2,this.y2);
    
                        grd.addColorStop(0, "red");
                        //grd.addColorStop(0.5, "#990000");
                         grd.addColorStop(0.33, '#990000');
                         grd.addColorStop(0.66, 'pink');
                        ctx.lineWidth = 15
                        ctx.strokeStyle = grd
                        ctx.stroke()
                        ctx.resetTransform();
                    }
            }
            if (this.toggleNumber){
                //ctx.save() 
                //ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
                ctx.font = "bold 30px Arial";
                ctx.fillStyle =  this.numberingColor
                ctx.textBaseline = 'middle';
                ctx.fillText(this.tileNumber.toString(),this.centerX-8,this.centerY)
                ctx.resetTransform();
                ctx.restore()


            }
        ctx.closePath()
    }

    drawPawns(ctx:CanvasRenderingContext2D){
     
        let drawn = 0
        this.pawns.forEach((pawn) => {
            console.log('kresli babku')
            console.log(this)
            console.log(pawn)
            let style = editor.getGame().getPawnStyle().get(pawn.player)
            console.log(style)
            if (this.getPawns().length == 1){
                if (style!.getType() == 'type1'){
                    drawPawnType1( ctx,this.getCenterX(),this.getCenterY()-10,10*this.radius/30,100,100,style!.getColor())
                    console.log('kresli ja neviem kde je problem')
                }
                else{
                    console.log('zly typ')
                }
            }
            else if (this.getPawns().length == 2){
                if (drawn == 0){
                    if (style!.getType() == 'type1'){
                        drawPawnType1( ctx,this.getCenterX()+this.radius/2,this.getCenterY()-10,8*this.radius/30,100,100,style!.getColor())
                        console.log('kresli ja neviem kde je problem')
                        drawn++
                    }
                }
                else if (drawn == 1){
                    if (style!.getType() == 'type1'){
                        drawPawnType1( ctx,this.getCenterX()-this.radius/2,this.getCenterY()-10,8*this.radius/30,100,100,style!.getColor())
                        console.log('kresli ja neviem kde je problem')
                        drawn++
                    }
                }
              
            }
            else if (this.getPawns().length > 2){
                if (drawn == 0){
                    if (style!.getType() == 'type1'){
                        drawPawnType1( ctx,this.getCenterX()+this.radius/2,this.getCenterY()-15*this.radius/30,4*this.radius/30,100,100,style!.getColor())
                     
                        drawn++
                    }
                }
                else if (drawn == 1){
                    if (style!.getType() == 'type1'){
                        drawPawnType1( ctx,this.getCenterX()-this.radius/2,this.getCenterY()-15*this.radius/30,4*this.radius/30,100,100,style!.getColor())
                       
                        drawn++
                    }
                }
                else if (drawn == 2){
                    if (style!.getType() == 'type1'){
                        drawPawnType1( ctx,this.getCenterX()-this.radius/2,this.getCenterY()+10*this.radius/30,4*this.radius/30,100,100,style!.getColor())
            
                        drawn++
                    }
                }
                else if (drawn == 3){
                    if (style!.getType() == 'type1'){
                        drawPawnType1( ctx,this.getCenterX()+this.radius/2,this.getCenterY()+10*this.radius/30,4*this.radius/30,100,100,style!.getColor())
                     
                        drawn++
                    }
                }
              
            }
            else{
                console.log('pocty su zle')
                console.log(this.pawns)
            }
        })
       console.log('spusitl draw pawns')
       console.log(this.pawns)
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
    JSONfyTile(){
        return {type:this.type,
                centerX:this.centerX,
                centerY:this.centerY,
                x1:this.x1,
                x2:this.x2,
                y1:this.y1,
                y2:this.y2,
                radius:this.radius,
                isOccupied:this.isOccupied,
                color:this.color,
                stroke:this.stroke,
                strokeColor:this.strokeColor,
                shape:this.shape,
                backgroundFile:this.backgroundFile === undefined?'none':getDataUrlFromImage(this.backgroundFile),
                patternFile:this.patternFile === undefined?'none':getDataUrlFromImage(this.patternFile),
                tileNumber:this.tileNumber,
                isEnding:this.isEnding,
                isEndingFor:this.isEndingFor,   
                isStarting:this.isStarting,
                isStartingFor:this.isStartingFor,
                belongTo:this.belongTo,
                canOccupy:this.canOccupy,
                toggleNumber:this.toggleNumber,
                numberingColor:this.numberingColor,
                numberOfFollowingTile:this.numberOfFollowingTile,
                id:this.id}
            
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
    public setId(newId:number){
        this.id = newId
    }
    public getId(){
        return this.id
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
    
    public setIsEnding(is : boolean) {
        this.isEnding = is;
    }
    public getIsEnding(){
        return this.isEnding
    }
    public setIsStarting(is : boolean) {
        this.isStarting = is;
    }
    public getIsStarting(){
        return this.isStarting
    }
    public setBelongTo(newOwner : string) {
        this.belongTo = newOwner;
    }
    public getBelongTo(){
        return this.belongTo
    }
    public setIsEndingFor(newPlayers:Array<string>){
        this.isEndingFor = newPlayers
    }
    public getIsStartingFor(){
        return this.isStartingFor
    }
    public setIsStartingFor(newPlayers:Array<string>){
        this.isStartingFor = newPlayers
    }
    public getIsEndingFor(){
        return this.isEndingFor
    }
    public setCanOccupy(newPlayers:Array<string>){
        this.canOccupy = newPlayers
    }
    public getCanOccupy(){
        return this.canOccupy
    }
    public setToogleNumber(is : boolean) {
        this.toggleNumber = is;
    }
    public getToggleNumber(){
        return this.toggleNumber}
    public setNumberingColor(color : string) {
        this.numberingColor = color;
    }
    public getNumberingColor() {
        return this.numberingColor;
    }
    public getTileNumber(){
        return this.tileNumber
    }
    public setTileNumber(newNumber:number){
        this.tileNumber = newNumber
    }
    public getFollowingTileNumber(){
        return this.numberOfFollowingTile
    }
    public setFollowingTileNumber(newNumber:number){
        this.numberOfFollowingTile = newNumber
    }
    public setPawns(newPawns:Array<Pawn>){
        this.pawns = newPawns
    }
    public getPawns(){
        return this.pawns
    }
    
    
}

export{Tile};