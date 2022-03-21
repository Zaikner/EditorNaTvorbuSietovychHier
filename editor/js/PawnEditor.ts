import { calibreEventCoords, canvas, ctx, doc, editor, reload } from "./canvas"
import { spawnColorPicker, spawnImageInput, spawnParagraph, spawnSelectMenu } from "./Elements"
import { Pawn } from "./Pawn"
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor"





function pawnMenu(){
    removeAllListenersAdded()
    removeAllButtons()
    // spawnParagraph(doc,'tileEditingPlace','','Configure your Pawn, and click on tile to insert it!')
    // spawnParagraph(doc,'tileEditingPlace','','Choose pawn color!')
    // spawnColorPicker(doc,'tileEditingPlace','pawnColorPicker')
    // spawnParagraph(doc,'tileEditingPlace','','Choose pawn image!')
    // spawnImageInput(doc,'tileEditingPlace','imagePicker','Choose!',function(){})
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
    spawnParagraph(doc,'tileEditingPlace','','To which player it belong?')
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
        let newPawn = new Pawn(1,player!.value,tile)
        //newPawn.color = colorPicker!.value
        editor.getGame().getPawns().push(newPawn)
        removeAllListenersAdded()
        reload(editor,ctx)
        console.log(newPawn)
    }
}

export{pawnMenu,insertPawn}