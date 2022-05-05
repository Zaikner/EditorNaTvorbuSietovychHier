
import { editor } from './canvas.js';
import { isEditor } from './clientSocket.js';
import { Pawn } from './Pawn.js';
import { drawPawnImage, drawPawnType1, drawPawnType2, drawPawnType3, drawPawnType4, drawPawnType5, drawPawnType6, drawPawnType7 } from './PawnEditor.js';
import {getDataUrlFromImage} from './utilityFunctions.js'
class Tile{
    private id:number = 0;
    private centerX:number;
    private centerY:number;
    private x1:number;
    private x2:number;
    private y1:number;
    private y2:number;
    private radius:number;
    private color:string = "";
    private stroke:number = 0;
    private strokeColor:string ='';
    private shape:string = 'circle'
    private isChoosen:boolean = false;
    private image?:HTMLImageElement = undefined;
    private tileNumber:number;
    private isEndingFor:Array<string>=[]
    private isStartingFor:Array<string>=[]
    private cantBeEliminatedOnTile:Array<string> = []

    private pawns:Array<Pawn> = []
    private questionId:number = -1
    private skip = 0;
    private repeat = 0;
    private forward = 0;
    private backward = 0;
    private mustThrown = 0;
    private turnToSetFree = 0;
    private nextTilesIds:Map<string,number> = new Map()
    private randomQuestion  = false;

    constructor(centerX:number,centerY:number,x1:number,x2:number,y1:number,y2:number, radius:number,color:string,tileNumber:number){

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


    public drawTile(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,showOnlyChange:boolean){
     
        console.log('nakreslil')
        ctx.beginPath();
        //obrazec bez outline -- nuluje
        if (this.image == undefined){
            
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
         
        }
        else if (this.image != undefined){
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
             
                
                ctx.drawImage(this.image!,this.x1,this.y1,2*this.radius,2*this.radius)
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
                
                ctx.drawImage(this.image!,this.x1,this.y1,2*this.radius,2*this.radius)
                ctx.resetTransform();
                ctx.restore()
            }
        }
     
            //outline
            ctx.resetTransform();
            ctx.restore()
             if (this.stroke > 0){
                ctx.resetTransform();
                ctx.restore()
                ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
                 ctx.strokeStyle =this.strokeColor
                 ctx.lineWidth = this.stroke
                 ctx.stroke();
             }
          
            // ak je vybrany
    
                 if (this.isChoosen && isEditor){
                    if (this.shape == 'circle'){
                         // ctx.lineWidth = 10
                // ctx.strokeStyle = '#FF0000'
                // ctx.setLineDash([1]);
                // ctx.stroke()
                // ctx.setLineDash([0]);
                ctx.resetTransform();
                ctx.restore()
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
                        ctx.resetTransform();
                        ctx.restore()
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
            if (editor.getGame().getToogleNumber() || isEditor){
                //ctx.save() 
                //ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
                ctx.font = "bold 30px Arial";
                if (this.strokeColor != this.color){
                    ctx.fillStyle =  this.strokeColor
                }
                else if (this.strokeColor!= '#000000'){
                    ctx.fillStyle = '#000000'
                }
                else{
                    ctx.fillStyle = '#FFFFFF'
                }
               
                ctx.textBaseline = 'middle';
                ctx.fillText(this.tileNumber.toString(),this.centerX-8,this.centerY)
                ctx.resetTransform();
                ctx.restore()


            }
        ctx.closePath()
    }

    drawPawns(ctx:CanvasRenderingContext2D){
        
        let num = 0
        let drawn = 0
        let pawndiff =0
        let diff = 0;//10*this.radius/50
        if (this.pawns.length == 1){
            diff = 30*this.radius/50
        }
        if (this.pawns.length == 2){
            diff = 20*this.radius/50
        }
        let diffY = 10
        ctx.resetTransform();
        ctx.restore()
        ctx.beginPath()
        ctx.closePath()
        ctx.scale(editor.getGame().getScaleX(),editor.getGame().getScaleY())
      
        editor.getGame().getPlayerTokens().forEach((player)=>{
          
            drawn = 0
           
            this.pawns.forEach((pawn) => {
                
                if(pawn.player == player){
                
                    num++;
                    let style = editor.getGame().getPawnStyle().get(pawn.player)
            
                    //drawPawnType1( ctx,this.getCenterX()-20+drawn*10,this.getCenterY()-10-10,8*this.radius/30,100,100,'#000000')
                    if (this.pawns.length == 2 && num == 2){
                        diff = 30*this.radius/50
                    }
                    if (num == 9){
                        diff = 15*this.radius/50
                        diffY = 40
                    }
                    else if (num == 13){
                        diff = 15*this.radius/50
                        diffY = -20
                    }
                    if (this.pawns.length == 1){
                        if (style?.getImage()!= undefined){
                            drawPawnImage( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style?.getImage())
                        }
                        else if (style?.getType() === 'type1'){
                            drawPawnType1( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type2'){
                            drawPawnType2( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type3'){
                            drawPawnType3( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type4'){
                            drawPawnType4( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type5'){
                            drawPawnType5( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type6'){
                            drawPawnType6( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type7'){
                            drawPawnType7( ctx,this.getCenterX(),this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/2*this.radius/50,100,100,style!.getColor())
                        }
                        
                        
                        
                    }
                    else{  
                        if (style?.getImage()!= undefined){
                            drawPawnImage( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getImage())
                        }
                        else if (style?.getType() === 'type1'){
                            drawPawnType1( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type2'){
                            drawPawnType2( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type3'){
                            drawPawnType3( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type4'){
                            drawPawnType4( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type5'){
                            drawPawnType5( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type6'){
                            drawPawnType6( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getColor())
                        }
                        else if (style?.getType() === 'type7'){
                            drawPawnType7( ctx,this.getCenterX()-this.radius+20*this.radius/50+drawn*10*this.radius/50+diff,this.getCenterY()-20*this.radius/50+diffY*this.radius/50,6*this.radius/50+2*9/this.pawns.length*this.radius/50,100,100,style!.getColor())
                        }
                       
                    }
                   
                    //drawPawnType1( ctx,this.getCenterX()-20+drawn*15,this.getCenterY()-10-10,4*this.radius/30,100,100,style!.getColor())
                    drawn++;
                }
            
            })
            diff = diff+(drawn*10*this.radius/50)
        })
       
        ctx.resetTransform();
       ctx.restore()
 
       
    }

    isPointedAt(x:number,y:number){
        if (this.shape == 'circle'){
            if (Math.sqrt( Math.pow((this.centerX*editor.getGame().getScaleX()-x), 2) + Math.pow((this.centerY*editor.getGame().getScaleY()-y), 2)) <= this.radius)
           {   
               return true
           }
           //if (((Math.pow(x-this.centerX*editor.getGame().getScaleX(),2)/Math.pow(this.radius*editor.getGame().getScaleX(),2))+(Math.pow(y-this.centerY*editor.getGame().getScaleY(),2)/Math.pow(this.radius*editor.getGame().getScaleY(),2))<=1)
        }
        if (this.shape == 'square'){
            if (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2){
              
                return true
            }
            
        }

        return false;
    }
    JSONfyTile(){
        return {
                centerX:this.centerX,
                centerY:this.centerY,
                x1:this.x1,
                x2:this.x2,
                y1:this.y1,
                y2:this.y2,
                radius:this.radius,
                color:this.color,
                stroke:this.stroke,
                strokeColor:this.strokeColor,
                shape:this.shape,
                image:this.image === undefined?'none':getDataUrlFromImage(this.image),
                tileNumber:this.tileNumber,   
                isEndingFor:this.isEndingFor,           
                isStartingFor:this.isStartingFor,
                questionId:this.questionId,
                cantBeEliminatedOnTile:this.cantBeEliminatedOnTile,
                skip:this.skip,
                repeat:this.repeat,
                forward:this.forward,
                backward:this.backward,
                mustThrown:this.mustThrown,
                randomQuestion:this.randomQuestion,
                turnToSetFree:this.turnToSetFree,
                nextTilesIds:this.mapNextTiles(),
                id:this.id}
            
    }
    removePawn(pawn:Pawn){
        this.pawns = this.pawns.filter((p) => {return p != pawn});
    }
    havePawnOnTile(player:string){
        let ret:any = undefined
      
        this.pawns.forEach((pawn:Pawn)=>{
       
            if (pawn.player == player){
                ret = pawn
            }
            else{
                console.log(pawn)
                console.log(player)
                console.log(ret)
            }
         
        })
    
        return ret
    }
    
    // findPreviousTile(){
    //     let res:Array<Tile> = []
    //     editor.getGame().getTiles().forEach((tile:Tile)=>{
    //         if (tile.getFollowingTileNumber() == this.id){
    //             res.push(tile)
    //         }
    //     })
    //     return res
    // }
    isSuccessfullyEnding(token:string){
        let ret = false
        if (!this.isEndingFor.includes(token)){
            return true
        }
        this.pawns.forEach((pawn:Pawn)=>{
            if (this.isEndingFor.includes(token) && pawn.player == token){
                ret = true
            }
        })

        return ret
    }
    mapNextTiles(){
        let ret:Array<string> = []
        Array.from(this.nextTilesIds.entries()).forEach(([key,value])=>{ret.push(key)
                                                                        ret.push(value.toString())})
        return ret
        
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
    public setColor(newColor:string){
        this.color = newColor
    }
    public getColor(){
        return this.color
    }
    public getImage(){
        return this.image
    }
    public setImage(newFile:HTMLImageElement){
         this.image= newFile
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
   
   
    public getTileNumber(){
        return this.tileNumber
    }
    public setTileNumber(newNumber:number){
        this.tileNumber = newNumber
    }
  
    public setQuestionId(newId:number){
        this.questionId = newId
    }
    public getQuestionId(){
        return this.questionId
    }
  
    public setPawns(newPawns:Array<Pawn>){
        this.pawns = newPawns
    }
    public getPawns(){
        return this.pawns
    }
    public setCantBeEliminatedOnTile(newPlayers:Array<string>){
        this.cantBeEliminatedOnTile = newPlayers
    }
    public getCantBeEliminatedOnTile():Array<string>{
        return this.cantBeEliminatedOnTile
    }
    public getSkip(){
        return this.skip
    }
    public setSkip(newSkip:number){
        this.skip = newSkip
    }
    public getRepeat(){
        return this.repeat
    }
    public setRepeat(newRepeat:number){
        this.repeat = newRepeat
    }
    public getForward(){
        return this.forward
    }
    public setForward(newForward:number){
        this.forward = newForward
    }
    public getBackward(){
        return this.backward
    }
    public setBackward(newBackward:number){
        this.backward = newBackward
    }
    public getMustThrown(){
        return this.mustThrown
    }
    public setMustThrown(newThrown:number){
        this.mustThrown = newThrown
    }
    public getTurnsToSetFree(){
        return this.turnToSetFree
    }
    public setTurnsToSetFree(newTurns:number){
        this.turnToSetFree = newTurns
    }
    public setNextTilesIds(newIds:Map<string,number>){
        this.nextTilesIds = newIds
    }
    public getNextTilesIds(){
        return this.nextTilesIds
    }
    public setRandomQuestion(is:boolean){
        this.randomQuestion = is
    }
    public getRandomQuestion(){
        return this.randomQuestion
    }
}

export{Tile};