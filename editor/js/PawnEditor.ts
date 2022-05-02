import { calibreEventCoords, canvas, ctx, doc, editor, reload } from "./canvas"
import { texts } from "./clientSocket"
import { spawnButton, spawnCanvas, spawnColorPicker, spawnDiv, spawnHeading, spawnImageInput, spawnParagraph, spawnSelectMenu } from "./Elements"
import { Pawn } from "./Pawn"
import { Tile } from "./Tile"
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor"





function pawnInsertMenu(){
    removeAllListenersAdded()
    removeAllButtons()
    // spawnParagraph(doc,'tileEditingPlace','','Configure your Pawn, and click on tile to insert it!')
    // spawnParagraph(doc,'tileEditingPlace','','Choose pawn color!')
    // spawnColorPicker(doc,'tileEditingPlace','pawnColorPicker')
    // spawnParagraph(doc,'tileEditingPlace','','Choose pawn image!')
    // spawnImageInput(doc,'tileEditingPlace','imagePicker','Choose!',function(){})
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
    //spawnParagraph(doc,'tileEditingPlace','',texts[73],true)
    spawnSelectMenu(doc,'tileEditingPlace','playerSelect',texts[73],['btn','btn-secondary'],editor.getGame().getPlayerTokens())
    canvas.addEventListener('click',insertPawn)
}

function insertPawn(event:MouseEvent){
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('pawnColorPicker')!
    console.log('skusil nakreslit')
    let tiles = editor.getGame().getTiles()
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
        //newPawn.color = colorPicker!.value
        editor.getGame().getPawns().push(newPawn)
        tile.getPawns().push(newPawn)
        //removeAllListenersAdded()
        reload(editor,ctx)
        console.log(newPawn)
    }
}
function deletePawn(event:MouseEvent){
    console.log('deleteto')
    let tiles = editor.getGame().getTiles()
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
                editor.getGame().removePawn(pawn)
                tile.removePawn(pawn)
            }
        })
       
        reload(editor,ctx)
      
    }
}
function pawnEditMenu(){
    removeAllListenersAdded()
    removeAllButtons()

    spawnHeading(document,'tileEditingPlace','',texts[18])
   
    let playerPicker = spawnSelectMenu(doc,'tileEditingPlace','playerSelect',texts[74],['btn','btn-secondary'],editor.getGame().getPlayerTokens())
    playerPicker.onchange = function(){
        drawActualPawnLook(playerPicker.value)

        for (let i = 1; i <= 8; i++){
            document.getElementById('canvasPawn'+i)!.style.borderColor = 'white'
        }
        let type = editor.getGame().getPawnStyle().get(playerPicker.value)?.getType()
        document.getElementById('canvasPawn'+type!.charAt(type!.length - 1))!.style.borderColor = 'red'
       
    }
    // let cavn = spawnCanvas(doc,'tileEditingPlace','pawnStyle')
    // cavn.classList.add('pawnType')
    // cavn.style.width = '100px'
    // cavn.style.height = '100px'

    
   
    let colorPicker = spawnColorPicker(doc,'tileEditingPlace','pawnColorPicker',texts[75])
    colorPicker.onchange = function(){
        editor.getGame().getPawnStyle().get(playerPicker.value)?.setColor(colorPicker.value)
        editor.getGame().getPawnStyle().get(playerPicker.value)?.setImage(undefined!)
        drawActualPawnLook(playerPicker.value)
        drawStyles(colorPicker.value)
    }
    // spawnParagraph(doc,'tileEditingPlace','',texts[76],true)
    // spawnButton(doc,'tileEditingPlace','chooseType',['btn', 'btn-secondary'],texts[77],function(){$('#pawnModal').modal('show')
    //  drawStyles(colorPicker.value)})

    spawnImageInput(doc,'tileEditingPlace','imagePicker',texts[78],texts[78],function(){

        if ((<HTMLInputElement>document.getElementById('imagePicker')!).files!.length > 0){
            editor.getGame().getPawnStyle().get(playerPicker.value)?.setImage(new Image())
            editor.getGame().getPawnStyle().get(playerPicker.value)?.setType('type 8')
            editor.getGame().getPawnStyle().get(playerPicker.value)!.getImage().src =URL.createObjectURL((<HTMLInputElement>document.getElementById('imagePicker')!).files![0]!)    
            editor.getGame().getPawnStyle().get(playerPicker.value)!.getImage().onload = function(){
                drawActualPawnLook(playerPicker.value)
          
            }
            for (let i = 1; i <= 7; i++){
                document.getElementById('canvasPawn'+i)!.style.borderColor = 'white'
            }
            document.getElementById('canvasPawn'+8)!.style.borderColor = 'red'
            }
          else{
            editor.getGame().getPawnStyle().get(playerPicker.value)?.setImage(undefined!)
          }

    })
    let p = spawnParagraph(doc,'tileEditingPlace','',texts[76],true)
    spawnDiv(document,'tileEditingPlace','pawnPickerDiv',[])
    
    p.style.textAlign = 'center'
    for (let i = 1; i <= 7; i++){
        //let button = <HTMLButtonElement>document.getElementById('pawnType'+i)
        let c = spawnCanvas(document,'pawnPickerDiv','canvasPawn'+i)
        c.classList.add('pawnType')
        c.style.width = '50px';
        c.style.height = '50px'
        let type = editor.getGame().getPawnStyle().get(playerPicker.value)?.getType()
        let image = editor.getGame().getPawnStyle().get(playerPicker.value)?.getImage()
        if (i.toString()  ==type!.charAt(type!.length - 1) && image == undefined){
            c.style.borderColor = 'red'
        }
        // button.onclick = function(){
        //     let player = playerPicker.value
        //     editor.getGame().getPawnStyle().get(player)?.setType('type'+i)
        //     editor.getGame().getPawnStyle().get(playerPicker.value)?.setImage(undefined!)
        //     console.log(editor.getGame().getPawnStyle())
        //     drawActualPawnLook(player)
        // }
        c.onclick = function(){

            for (let i = 1; i <= 8; i++){
                document.getElementById('canvasPawn'+i)!.style.borderColor = 'white'
            }
            let player = playerPicker.value
            c.style.borderColor = 'red'
            editor.getGame().getPawnStyle().get(player)?.setType('type'+i)
            editor.getGame().getPawnStyle().get(playerPicker.value)?.setImage(undefined!)
            console.log(editor.getGame().getPawnStyle())
            drawActualPawnLook(player)
        }

        
    }
    let c = spawnCanvas(document,'pawnPickerDiv','canvasPawn'+8)
    c.classList.add('pawnType')
    c.style.width = '50px';
    c.style.height = '50px'
    let type = editor.getGame().getPawnStyle().get(playerPicker.value)?.getType()
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
            editor.getGame().getPawnStyle().get(player)?.setType('type'+8)
            editor.getGame().getPawnStyle().get(playerPicker.value)!.getImage().src =URL.createObjectURL((<HTMLInputElement>document.getElementById('imagePicker')!).files![0]!)    
            editor.getGame().getPawnStyle().get(playerPicker.value)!.getImage().onload = function(){
                drawActualPawnLook(playerPicker.value)
          
            }
            drawActualPawnLook(player)
        }
  
    }
    drawActualPawnLook('Player 1')
    drawStyles(colorPicker.value)
    
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
    

}
function pawnDeleteMenu(){
    removeAllListenersAdded()
    removeAllButtons()
    spawnParagraph(doc,'tileEditingPlace','',texts[73],true)
    spawnSelectMenu(doc,'tileEditingPlace','playerSelect',texts[129],[],editor.getGame().getPlayerTokens())
    canvas.addEventListener('click',deletePawn)

}

function drawStyles(color:string){
    let cs = <HTMLCanvasElement>document.getElementById('canvasPawn1')!
    cs.width = 100
    cs.height = 100

    drawPawnType1( <CanvasRenderingContext2D> cs.getContext("2d"),50,20,20,100,100,color)
  
    // cs.width = 100
    // cs.height = 100
    // let contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    // contextik.resetTransform()
    // let width = cs.width
    // let height = cs.height
    // contextik.beginPath()
    // contextik.arc(50,20,20,0, 2 * Math.PI)
    // contextik.fillStyle = color
    // contextik.fill()
    // contextik.beginPath()
    // contextik.moveTo(50,30)
    // contextik.lineTo(20,90)
    // contextik.lineTo(80,90)
    // contextik.lineTo(50,30)
    // contextik.fill()

    cs = <HTMLCanvasElement>document.getElementById('canvasPawn2')!
    cs.width = 100
    cs.height = 100
    let contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    let width = cs.width
    let height = cs.height
    // contextik.beginPath()
    // contextik.arc(50,20,20,0, 2 * Math.PI)
    // contextik.fillStyle = color
    // contextik.fill()
    // contextik.beginPath()
    // contextik.moveTo(30,40)
    // contextik.lineTo(70,40)
    // contextik.lineTo(50,90)
    // contextik.lineTo(30,40)
    // contextik.fill()
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
    let image =  editor.getGame().getPawnStyle().get((<HTMLSelectElement>document.getElementById('playerSelect'))!.value)?.getImage()
    if (image!= undefined){
        drawPawnImage(contextik,50,30,30,100,100,image!)
        console.log('kreslil')
    }
    else{
        console.log('je undefined')
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
    console.log(headCenterX,headCenterY,radius)
    contextik.drawImage(image,headCenterX-radius,headCenterY-radius,radius*2,radius*3)

}
function drawActualPawnLook(player:string){
    
    // let cs = <HTMLCanvasElement>document.getElementById('pawnStyle')
    // let context = <CanvasRenderingContext2D> cs.getContext("2d")
    // context.clearRect(0,0,cs.width,cs.height)
    let style = editor.getGame().getPawnStyle().get(player)
    drawStyles(style!.getColor())
    // if (style?.getImage()!= undefined){
    //     drawPawnImage(context,cs.width/2,40,40,100,100,style?.getImage())
    // }
    // else if (style?.getType() === 'type1'){
    //     drawPawnType1( context,cs.width/2,40,30,100,100,style!.getColor())
    // }
    // else if(style?.getType()==='type2'){
    //     drawPawnType2( context,cs.width/2,40,40,100,100,style!.getColor())
    // }
    // else if(style?.getType()==='type3'){
    //     drawPawnType3( context,cs.width/2,40,40,100,100,style!.getColor())
    // }
    // else if(style?.getType()==='type4'){
    //     drawPawnType4( context,cs.width/2,40,40,100,100,style!.getColor())
    // }
    // else if(style?.getType()==='type5'){
    //     drawPawnType5( context,cs.width/2,40,40,100,100,style!.getColor())
    // }
    // else if(style?.getType()==='type6'){
    //     drawPawnType6( context,cs.width/2,40,40,100,100,style!.getColor())
    // }
    // else if(style?.getType()==='type7'){
    //     drawPawnType7( context,cs.width/2,40,40,100,100,style!.getColor())
    // }
    // else{
    //     console.log('nie je dorobene')
    // }
    
    
}
export{pawnInsertMenu,pawnEditMenu,pawnDeleteMenu,drawPawnImage,insertPawn,drawPawnType1,drawPawnType2,drawPawnType3,drawPawnType4,drawPawnType5,drawPawnType6,drawPawnType7,deletePawn}