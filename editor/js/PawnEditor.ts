import { calibreEventCoords, canvas, ctx, doc, editor, reload, texts } from "./canvas"
import { spawnButton, spawnCanvas, spawnColorPicker, spawnImageInput, spawnParagraph, spawnSelectMenu } from "./Elements"
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
    spawnParagraph(doc,'tileEditingPlace','',texts[73])
    spawnSelectMenu(doc,'tileEditingPlace','playerSelect',[],editor.getGame().getPlayerTokens())
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

    spawnParagraph(doc,'tileEditingPlace','',texts[74])
    let playerPicker = spawnSelectMenu(doc,'tileEditingPlace','playerSelect',[],editor.getGame().getPlayerTokens())
    playerPicker.onchange = function(){
        drawActualPawnLook(playerPicker.value)
    }
    spawnCanvas(doc,'tileEditingPlace','pawnStyle')
    spawnParagraph(doc,'tileEditingPlace','',texts[75])
    let colorPicker = spawnColorPicker(doc,'tileEditingPlace','pawnColorPicker')
    colorPicker.onchange = function(){
        editor.getGame().getPawnStyle().get(playerPicker.value)?.setColor(colorPicker.value)
        drawActualPawnLook(playerPicker.value)
    }
    spawnParagraph(doc,'tileEditingPlace','',texts[76])
    spawnButton(doc,'tileEditingPlace','chooseType',['btn', 'btn-secondary'],texts[77],function(){$('#pawnModal').modal('show')
     drawStyles(colorPicker.value)})

    spawnParagraph(doc,'tileEditingPlace','',texts[78])
    spawnImageInput(doc,'tileEditingPlace','imagePicker',texts[63],function(){})

    for (let i = 1; i <= 7; i++){
        let button = <HTMLButtonElement>document.getElementById('pawnType'+i)
        
        button.onclick = function(){
            let player = playerPicker.value
            editor.getGame().getPawnStyle().get(player)?.setType('type'+i)
            console.log(editor.getGame().getPawnStyle())
            drawActualPawnLook(player)
        }
        drawActualPawnLook('Player 1')
    }
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
    

}
function pawnDeleteMenu(){
    removeAllListenersAdded()
    removeAllButtons()
    spawnParagraph(doc,'tileEditingPlace','',texts[73])
    spawnSelectMenu(doc,'tileEditingPlace','playerSelect',[],editor.getGame().getPlayerTokens())
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
    contextik.beginPath()
    contextik.arc(50,20,20,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath()
    contextik.moveTo(30,40)
    contextik.lineTo(70,40)
    contextik.lineTo(50,90)
    contextik.lineTo(30,40)
    contextik.fill()

    cs = <HTMLCanvasElement>document.getElementById('canvasPawn3')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    contextik.beginPath()
    contextik.arc(50,20,20,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath()
    contextik.moveTo(10,40)
    contextik.lineTo(90,40)
    contextik.lineTo(50,90)
    contextik.lineTo(10,40)
    contextik.fill()


    cs = <HTMLCanvasElement>document.getElementById('canvasPawn4')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    contextik.beginPath()
    contextik.arc(50,20,20,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath();
    contextik.ellipse(50, 85, 25, 47, 0, 0, Math.PI, true);
    
    contextik.fill()

    
    cs = <HTMLCanvasElement>document.getElementById('canvasPawn5')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    contextik.beginPath()
    contextik.arc(50,20,20,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath();
    contextik.ellipse(50,90, 10,80 , 0, 0, Math.PI, true);
    contextik.fill()

    contextik.beginPath();
    contextik.ellipse(50,90, 30,30 , 0, 0, Math.PI, true);
    contextik.fill()

    cs = <HTMLCanvasElement>document.getElementById('canvasPawn6')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    contextik.beginPath()
    contextik.arc(50,20,20,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath();
    contextik.ellipse(50, 85, 20, 47, 0, 0, Math.PI, true);
    contextik.fill()

    contextik.beginPath();
    contextik.ellipse(50,90, 30,30 , 0, 0, Math.PI, true);
    contextik.fill()

    cs = <HTMLCanvasElement>document.getElementById('canvasPawn7')!
    cs.width = 100
    cs.height = 100
    contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    contextik.resetTransform()
    width = cs.width
    height = cs.height
    contextik.beginPath()
    contextik.arc(50,20,20,0, 2 * Math.PI)
    contextik.fillStyle = color
    contextik.fill()
    contextik.beginPath();
    contextik.moveTo(50,20+20/2)
    contextik.lineTo(30,20+20*3)
    contextik.lineTo(70,20+20*3)
    contextik.lineTo(50,20+20/2)
    contextik.fill()

    contextik.beginPath();
    contextik.ellipse(50,90, 30,30 , 0, 0, Math.PI, true);
    contextik.fill()
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
function drawActualPawnLook(player:string){
    let cs = <HTMLCanvasElement>document.getElementById('pawnStyle')
   
    let style = editor.getGame().getPawnStyle().get(player)
    if (style?.getType() === 'type1'){
        drawPawnType1( <CanvasRenderingContext2D> cs.getContext("2d"),cs.width/2,40,40,100,100,style!.getColor())
    }
    else{
        console.log('nie je dorobene')
    }
    
    
}
export{pawnInsertMenu,pawnEditMenu,pawnDeleteMenu,insertPawn,drawPawnType1,deletePawn}