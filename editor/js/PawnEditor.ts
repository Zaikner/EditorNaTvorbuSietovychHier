import { calibreEventCoords, canvas, ctx, doc, game, reload } from "./Canvas"
import { texts } from "./ClientSocket"
import { spawnButton, spawnCanvas, spawnColorPicker, spawnDiv, spawnHeading, spawnImageInput, spawnParagraph, spawnSelectMenu } from "./Elements"
import { Pawn } from "./Pawn"
import { Tile } from "./Tile"
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor"

function pawnInsertMenu(){
    removeAllListenersAdded()
    removeAllButtons()
    spawnSelectMenu(doc,'tileEditingPlace','playerSelect',texts[73],['btn','btn-secondary'],game.getPlayerTokens())
    canvas.addEventListener('click',insertPawn)
}

function insertPawn(event:MouseEvent){
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('pawnColorPicker')!
    console.log('skusil nakreslit')
    let tiles = game.getTiles()
    let tile = undefined
    let coords = calibreEventCoords(event)
    for (let i = tiles.length-1; i >= 0;i--){
        if (tiles[i].isPointedAt(coords.x,coords.y)){
            tile = tiles[i]
            break
        }
    }
    if(tile!=undefined){
        let player:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('playerSelect')!
        let newPawn = new Pawn(player!.value,tile)
        game.getPawns().push(newPawn)
        tile.getPawns().push(newPawn)
        reload(ctx)
        console.log(newPawn)
    }
}
function deletePawn(event:MouseEvent){
    console.log('deleteto')
    let tiles = game.getTiles()
    let tile:Tile = undefined!
    let coords = calibreEventCoords(event)
    for (let i = tiles.length-1; i >= 0;i--){
        if (tiles[i].isPointedAt(coords.x,coords.y)){
            tile = tiles[i]
            break
        }
    }
    if(tile!=undefined){
        console.log('nasiel tile')
        let pawns = tile.getPawns()
        let stop = false
        let player:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('playerSelect')!
        pawns.forEach((pawn:Pawn)=>{
            if (pawn.player == player.value && !stop){
                console.log('nasiel pawn')
                stop = true
                game.removePawn(pawn)
                tile.removePawn(pawn)
            }
        })
       
        reload(ctx)
      
    }
}
function pawnEditMenu(){
    removeAllListenersAdded()
    removeAllButtons()

    spawnHeading(document,'tileEditingPlace','',texts[18])
   
    let playerPicker = spawnSelectMenu(doc,'tileEditingPlace','playerSelect',texts[74],['btn','btn-secondary'],game.getPlayerTokens())
    playerPicker.onchange = function(){
        drawActualPawnLook(playerPicker.value)

        for (let i = 1; i <= 8; i++){
            document.getElementById('canvasPawn'+i)!.style.borderColor = 'white'
        }
        let type = game.getPawnStyle().get(playerPicker.value)?.getType()
        document.getElementById('canvasPawn'+type!.charAt(type!.length - 1))!.style.borderColor = 'red';
        (<HTMLInputElement> document.getElementById('pawnColorPicker')).value = game.getPawnStyle().get(playerPicker.value)?.getColor()!
       
    }
  
    let colorPicker = spawnColorPicker(doc,'tileEditingPlace','pawnColorPicker',texts[75])
    colorPicker.onchange = function(){
        game.getPawnStyle().get(playerPicker.value)?.setColor(colorPicker.value)
        game.getPawnStyle().get(playerPicker.value)?.setImage(undefined!)
        drawActualPawnLook(playerPicker.value)
        drawStyles(colorPicker.value)
        reload(ctx)
    }

    spawnImageInput(doc,'tileEditingPlace','imagePicker',texts[78],texts[78],function(){

        if ((<HTMLInputElement>document.getElementById('imagePicker')!).files!.length > 0){
            game.getPawnStyle().get(playerPicker.value)?.setImage(new Image())
            game.getPawnStyle().get(playerPicker.value)?.setType('type 8')
            game.getPawnStyle().get(playerPicker.value)!.getImage().src =URL.createObjectURL((<HTMLInputElement>document.getElementById('imagePicker')!).files![0]!)    
            game.getPawnStyle().get(playerPicker.value)!.getImage().onload = function(){
                drawActualPawnLook(playerPicker.value)
                reload(ctx)
            }
            for (let i = 1; i <= 7; i++){
                document.getElementById('canvasPawn'+i)!.style.borderColor = 'white'
            }
            document.getElementById('canvasPawn'+8)!.style.borderColor = 'red'
            }
          else{
            game.getPawnStyle().get(playerPicker.value)?.setImage(undefined!)
          }

    })
    let p = spawnParagraph(doc,'tileEditingPlace','',texts[76],true)
    spawnDiv(document,'tileEditingPlace','pawnPickerDiv',[])
    
    p.style.textAlign = 'center'
    for (let i = 1; i <= 7; i++){
        let c = spawnCanvas(document,'pawnPickerDiv','canvasPawn'+i)
        c.classList.add('pawnType')
        c.style.width = '50px';
        c.style.height = '50px'
        let type = game.getPawnStyle().get(playerPicker.value)?.getType()
        let image = game.getPawnStyle().get(playerPicker.value)?.getImage()
        if (i.toString()  ==type!.charAt(type!.length - 1) && image == undefined){
            c.style.borderColor = 'red'
        }
    
        c.onclick = function(){

            for (let i = 1; i <= 8; i++){
                document.getElementById('canvasPawn'+i)!.style.borderColor = 'white'
            }
            let player = playerPicker.value
            c.style.borderColor = 'red'
            game.getPawnStyle().get(player)?.setType('type'+i)
            game.getPawnStyle().get(playerPicker.value)?.setImage(undefined!)
        
            drawActualPawnLook(player)
        }
    }
    let c = spawnCanvas(document,'pawnPickerDiv','canvasPawn'+8)
    c.classList.add('pawnType')
    c.style.width = '50px';
    c.style.height = '50px'
    let type = game.getPawnStyle().get(playerPicker.value)?.getType()
    if (type!.charAt(type!.length - 1) == '8'){
        c.style.borderColor = 'red'
    }
    c.onclick = function(){
        if ((<HTMLInputElement>document.getElementById('imagePicker')!).files!.length >0){
            for (let i = 1; i <= 8; i++){
                document.getElementById('canvasPawn'+i)!.style.borderColor = 'white'
            }
            let player = playerPicker.value
            c.style.borderColor = 'red'
            game.getPawnStyle().get(player)?.setType('type'+8)
            game.getPawnStyle().get(playerPicker.value)!.getImage().src =URL.createObjectURL((<HTMLInputElement>document.getElementById('imagePicker')!).files![0]!)    
            game.getPawnStyle().get(playerPicker.value)!.getImage().onload = function(){
                drawActualPawnLook(playerPicker.value)
          
            }
            drawActualPawnLook(player)
        }
  
    }
    drawActualPawnLook('Player 1')
    drawStyles(colorPicker.value)
  
}
function pawnDeleteMenu(){
    removeAllListenersAdded()
    removeAllButtons()
    spawnParagraph(doc,'tileEditingPlace','',texts[73],true)
    spawnSelectMenu(doc,'tileEditingPlace','playerSelect',texts[129],[],game.getPlayerTokens())
    canvas.addEventListener('click',deletePawn)

}

function drawStyles(color:string){
    let cs = <HTMLCanvasElement>document.getElementById('canvasPawn1')!
    cs.width = 100
    cs.height = 100

    drawPawnType1( <CanvasRenderingContext2D> cs.getContext("2d"),50,20,20,100,100,color)
  
    cs = <HTMLCanvasElement>document.getElementById('canvasPawn2')!
    cs.width = 100
    cs.height = 100
    let contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    let width = cs.width
    let height = cs.height
   
    drawPawnType2(contextik,50,20,20,100,100,color)

    cs = <HTMLCanvasElement>document.getElementById('canvasPawn3')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    drawPawnType3(contextik,50,20,20,100,100,color)


    cs = <HTMLCanvasElement>document.getElementById('canvasPawn4')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    drawPawnType4(contextik,50,20,20,100,100,color)

    
    cs = <HTMLCanvasElement>document.getElementById('canvasPawn5')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    drawPawnType5(contextik,50,20,20,100,100,color)

    cs = <HTMLCanvasElement>document.getElementById('canvasPawn6')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    

    drawPawnType6(contextik,50,20,20,100,100,color)

    cs = <HTMLCanvasElement>document.getElementById('canvasPawn7')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
  
    drawPawnType7(contextik,50,20,20,100,100,color)
    cs = <HTMLCanvasElement>document.getElementById('canvasPawn8')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    let image =  game.getPawnStyle().get((<HTMLSelectElement>document.getElementById('playerSelect'))!.value)?.getImage()
    if (image!= undefined){
        drawPawnImage(contextik,50,30,30,100,100,image!)
      
    }

    }
    

function drawPawnType1(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,color:string)
{
    
    contextik.beginPath()
    contextik.arc(headCenterX,headCenterY,radius,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath()
    contextik.moveTo(headCenterX,headCenterY+radius/2)
    contextik.lineTo(headCenterX-radius*1.5,headCenterY+radius*3)
    contextik.lineTo(headCenterX+radius*1.5,headCenterY+radius*3)
    contextik.lineTo(headCenterX,headCenterY+radius/2)
    contextik.fill()

}
function drawPawnType2(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,color:string)
{
    contextik.beginPath()
    contextik.arc(headCenterX,headCenterY,radius,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath()
    contextik.moveTo(headCenterX-radius,headCenterY+radius)
    contextik.lineTo(headCenterX+radius,headCenterY+radius)
    contextik.lineTo(headCenterX,headCenterY+radius*3.5)
    contextik.lineTo(headCenterX-radius,headCenterY+radius)
    contextik.fill()

}
function drawPawnType3(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,color:string)
{
    contextik.beginPath()
    contextik.arc(headCenterX,headCenterY,radius,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath()
    contextik.moveTo(headCenterX-radius*2,headCenterY+radius)
    contextik.lineTo(headCenterX+radius*2,headCenterY+radius)
    contextik.lineTo(headCenterX,headCenterY+radius*3.5)
    contextik.lineTo(headCenterX-radius*2,headCenterY+radius)
    contextik.fill()
}
function drawPawnType4(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,color:string)
{
    contextik.beginPath()
    contextik.arc(headCenterX,headCenterY,radius,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY+radius*3, radius*1.5, radius*2.5, 0, 0, Math.PI, true);
    
    contextik.fill()
}
function drawPawnType5(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,color:string)
{
    contextik.beginPath()
    contextik.fillStyle = color
    contextik.arc(headCenterX,headCenterY,radius,0, 2 * Math.PI)
    contextik.fill()
    contextik.beginPath();
    contextik.ellipse(headCenterX,headCenterY+radius*3, radius/2,radius*4 , 0, 0, Math.PI, true);
    contextik.fill()

    contextik.beginPath();
    contextik.ellipse(headCenterX,headCenterY+radius*3, radius*1.5,radius*1.5 , 0, 0, Math.PI, true);
    contextik.fill()
}
function drawPawnType6(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,color:string)
{
  contextik.beginPath()
  contextik.arc(headCenterX,headCenterY,radius,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY+radius*3, radius, radius*2.5, 0, 0, Math.PI, true);
    contextik.fill()

    contextik.beginPath();
    contextik.ellipse(headCenterX,headCenterY+radius*3, radius*1.5,radius*1.5 , 0, 0, Math.PI, true);
    contextik.fill()
}

function drawPawnType7(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,color:string)
{
    contextik.beginPath()
    contextik.arc(headCenterX,headCenterY,radius,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath();
    contextik.moveTo(headCenterX,headCenterY+radius/2)
    contextik.lineTo(headCenterX-radius,headCenterY+radius*3)
    contextik.lineTo(headCenterX+radius,headCenterY+radius*3)
    contextik.lineTo(headCenterX,headCenterY+radius/2)
    contextik.fill()

    contextik.beginPath();
    contextik.ellipse(headCenterX,headCenterY+radius*3, radius*+1.5,radius, 0, 0, Math.PI, true);
    contextik.fill()
}
function drawPawnImage(contextik:CanvasRenderingContext2D,headCenterX:number,headCenterY:number,radius:number,width:number,height:number,image:HTMLImageElement)
{
    contextik.beginPath()
   
    contextik.drawImage(image,headCenterX-radius,headCenterY-radius,radius*2,radius*3)

}
function drawActualPawnLook(player:string){
    let style = game.getPawnStyle().get(player)
    drawStyles(style!.getColor())
}
export{pawnInsertMenu,pawnEditMenu,pawnDeleteMenu,drawPawnImage,insertPawn,drawPawnType1,drawPawnType2,drawPawnType3,drawPawnType4,drawPawnType5,drawPawnType6,drawPawnType7,deletePawn}