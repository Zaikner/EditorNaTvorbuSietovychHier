
import {mainMenu,doc,elementDeleter,canvas,ctx, calibreEventCoords,game,reload} from './Canvas.js'
import { editorSocket,canMovePawnFunc,texts} from './ClientSocket.js'
import {spawnColorPicker,spawnParagraph,spawnCanvas,spawnSliderWithValueShower,spawnButton,spawnSelectMenu, spawnImageInput, spawnMultiSelect, spawnHeading, spawnButtonWithLabel}from './Elements.js'
import { Tile } from './Tile.js'
import { deletePawn, insertPawn } from './PawnEditor.js'
import { Pawn } from './Pawn.js'

let lastSize:string = '30'
let lastColor:string = '#000000'
let lastOutline:string = '3'
let lastOutlineColor:string ='#000000'
let lastShape:string = 'circle'
let lastImage:HTMLImageElement = undefined!

export class TileEditor{

}
let moveEventHandler = function(event:MouseEvent) { 
  canvas.removeEventListener('mousemove',game.moveTile)
  tilik = undefined!
  canvas.removeEventListener('mousemove',moveWithTile)
reload(ctx)

}
let onlyMoveHandler = function(event:MouseEvent) {game.findTile(event,false)
  reload(ctx)
 
  }
let pickTile = function(event:MouseEvent,token:string,value:number) {game.findTile(event,false)
  if (game.getChoosenTile()!=undefined){
    let pawn:any = game.getChoosenTile()!.havePawnOnTile(token)
    if (pawn!= undefined){
      const params = new URLSearchParams(window.location.search);
      if (pawn.canMove(value))
      {  
        editorSocket.emit('move pawns',{pawn:pawn.id,value:value,room:params.get('id')})
        canvas.removeEventListener('click',canMovePawnFunc)
      }
      else{
        game.getChoosenTile()?.setIsChoosen(false)
        game.setChoosenTile(undefined!)
      }
    }
  }
  
 
  reload(ctx)
 
  }

let copyTile = function(event:MouseEvent) {
  removeAllButtons()
  spawnElements()
  game.findTile(event,false)
  setValues(undefined!,false)
  showActualState()
  game.getChoosenTile()?.setIsChoosen(false)
  game.setChoosenTile(undefined!)   

  spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],texts[79],saveInsertingTiles)
    
    spawnButton(doc,"buttonPlace",'undoButton',["btn","btn-dark"],texts[122],undoTileInsert)
    spawnButton(doc,"buttonPlace",'copyStyleButton',["btn","btn-dark"],texts[123],copyTileStyle)
  
    reload(ctx)
  
    canvas.addEventListener('mousedown', insert);
    }
let deleteHandler = function(event:MouseEvent){
  game.deleteTile()

  reload(ctx)}
  

function spawnElements(){
    let options = [texts[195]]
    game.getPlayerTokens().slice().forEach((player:string)=>{
      options.push(player)
    })

    spawnHeading(document,'tileEditingPlace','',texts[19])
    let cs = spawnCanvas(doc,'tileEditingPlace','changeCanvas')
    cs.style.height = '100px'
    cs.style.width = '200px'
    cs.style.borderRadius = '20%'
  
  
    let colorPicker = spawnColorPicker(doc,"tileEditingPlace",'colorPicker',texts[124])
    colorPicker.value = lastColor
    colorPicker.onchange = function(){
      game.setImage(undefined!)
      showActualState();

    }

    let sizeOfTileSlider = spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfTileSlider',texts[125],'20','50','1',lastSize)
    sizeOfTileSlider.onchange = function(){showActualState()}

    let outlineColorPicker = spawnColorPicker(doc,"tileEditingPlace",'outlineColorPicker',texts[127])
    outlineColorPicker.onchange =function(){showActualState()}
    outlineColorPicker.value = lastOutlineColor
    
    let sizeOfOutlineSlider = spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfOutlineSlider',texts[128],'0','10','1',lastOutline)
    sizeOfOutlineSlider.onchange = function(){showActualState()}
    
    let shapeMenu = spawnSelectMenu(doc,"tileEditingPlace",'shapeMenu',texts[129],["btn","btn-dark"],['circle','square'])
    shapeMenu.onchange= function(){showActualState()}
 
    spawnImageInput(doc,"tileEditingPlace",'tileImage',texts[134],texts[134],function(){
  
      if ((<HTMLInputElement>doc.getElementById('tileImage')!).files!.length > 0){
        game.setImage(new Image())
          game.getImage()!.src =URL.createObjectURL((<HTMLInputElement>doc.getElementById('tileImage')!).files![0]!)
          game.getImage().onload = function(){
            
            showActualState()
          }
          
        }
      else{
        game.setImage(undefined!)
      }
    })

spawnMultiSelect(doc,'tileEditingPlace','',texts[135],texts[192],options,'start')

spawnMultiSelect(doc,'tileEditingPlace','',texts[136],texts[192],options,'end')

    spawnButtonWithLabel(doc,"tileEditingPlace",'setNextTileButton',texts[141],['btn','btn-dark'],texts[208],function(){
      
      $('#nextTileModal').modal('show');
      generateNextTiles()
      
    })
  
    spawnMultiSelect(document,'tileEditingPlace','cantBeEleminated',texts[143],texts[192],options,'immune')

    spawnButtonWithLabel(document,'tileEditingPlace','bindEvent',texts[98],['btn','btn-dark'],texts[174],function(){
      $('#EventModal').modal('show');
     
    })
    let p = spawnParagraph(document,'tileEditingPlace','pickedEventParagraph',texts[197],false)
    p.style.float ='right'
    let div = document.createElement('div')
    div.id = 'wrapperDiv'
    div.style.textAlign = 'center'
    div.style.marginTop = '100px';
    div.style.width='100%'
    document.getElementById('tileEditingPlace')?.appendChild(div)
    let button = spawnButton(document,'wrapperDiv','removeTileButton',['btn','btn-dark'],texts[255],function(){
      game.deleteTile()
      removeAllButtons()
      spawnElements()
      showActualState();
      
    })
    button.style.marginTop = '10%'
    button.style.textAlign = 'center'
    if(game.getChoosenTile()== undefined){
      document.getElementById('removeTileButton')!.hidden = true
    }
}

  let startX = 0
  let startY = 0
  let tilik:Tile = undefined!
  let moveWithTile = function(event:MouseEvent){
    if (tilik!=undefined){
      game.moveTile(event,tilik)
    }
   
  }

  let initMove = function(event:MouseEvent){
    let coords = calibreEventCoords(event)
    startX = coords.x
    startY = coords.y
  
   let tiles = game.getTiles()
   
   for (let i = tiles.length-1; i >= 0;i--){
       if (tiles[i].isPointedAt(coords.x,coords.y)){
            tilik =tiles[i]
            break
           }
           
       }
    game.findTile(event,false)
  }
  
  function startInsertingByOne(){
    game.nullEditor()
    removeAllButtons()
    removeAllListenersAdded()
   
    canvas.addEventListener('mousedown',initMove)
    canvas.addEventListener('mouseup', moveEventHandler);
  
    spawnElements()
    showActualState()
  }

  function copyTileStyle(){
    game.nullEditor()
    removeAllButtons()
    removeAllListenersAdded()
    spawnParagraph(document,'tileEditingPlace','',texts[147],true)
    document.getElementById('wholeBody')!.style.cursor = 'pointer'
    canvas.addEventListener('click',copyTile)
  }
  function saveInsertingTiles(){
    removeAllButtons()
    removeAllListenersAdded()
    unchooseEverything()
    reload(ctx)
   
    mainMenu();
  }

  function editTiles():void{
    game.nullEditor()
    document.getElementById('removeTileButton')!.removeAttribute('hidden')
    canvas.addEventListener('mousemove',moveWithTile)
    removeAllButtons()
    game.setIsMoving(false)

    if ( game.getChoosenTile()!= undefined){
      game.setStartForPlayers(game.getChoosenTile()!.getIsStartingFor().slice())
      game.setEndForPlayers(game.getChoosenTile()!.getIsEndingFor().slice())
    }

      spawnElements()
      setValues(undefined!,true)
       showActualState(false)      
    }
  
  function moveTiles(){
    removeAllListenersAdded()
    
    game.makeAllTilesNotChoosen()
    reload(ctx)
    
    game.setIsMoving(true)
    removeAllButtons()
  }
  function deleteTiles(){
    removeAllListenersAdded()
    removeAllButtons()
    spawnButton(doc,"buttonPlace",'End',["btn","btn-dark"],texts[90],saveInsertingTiles) 
  }
  
  function removeAllButtons(){
    elementDeleter('buttonPlace')
    elementDeleter('numOfPlayersPlace')
    elementDeleter('gameTypePlace')
    elementDeleter('gameNamePlace')
    elementDeleter('tileEditingPlace');
    elementDeleter('questionPlace');
    elementDeleter('headingPlace');

  }
  function removeAllListenersAdded(){
  
    canvas.removeEventListener('mousemove',game.moveTile)
    canvas.removeEventListener('mousemove',moveTile)
    canvas.removeEventListener('mousedown',moveTile)
    canvas.removeEventListener('mousedown',initMove)
    canvas.removeEventListener('mousedown', insert)
    canvas.removeEventListener('mouseup',moveEventHandler)
    canvas.removeEventListener('click',deleteHandler)
    canvas.removeEventListener('click',insertPawn)
    canvas.removeEventListener('click',deletePawn)
    canvas.removeEventListener('click',copyTile)
    canvas.removeEventListener('click',onlyMoveHandler)
  
    canvas.style.cursor = 'default'
    reload(ctx)
  
  }
  function unchooseEverything(){
    game.makeAllTilesNotChoosen()
   
    reload(ctx)
   
  }

  function undoTileInsert(){
      game.removeLastFromUndoLog()
      reload(ctx)
     
  }

  let  insert = function(event:MouseEvent){
    unchooseEverything()
    game.setChoosenTile( undefined!)
    let coords = calibreEventCoords(event)
    let canSpawn = true

    if (canSpawn){
      var addedTile = spawnTile(coords)
      game.addToUndoLog([addedTile])
      addedTile.getIsStartingFor().forEach((player:string)=>{
        game.insertPawns(player,addedTile)
      })
      showActualState()
    }  
  }

  let spawnTile = function(coords:{x:number,y:number}){
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
    let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
    let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
    let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
    var insertImage = game.getImage()
   
    let addedTile = game.initTile(true,coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage)
    addedTile.setIsStartingFor(game.getStartForPlayers().slice())
    addedTile.setIsEndingFor(game.getEndForPlayers().slice())
    addedTile.setCantBeEliminatedOnTile(game.getCantBeEliminatedOnTile().slice())
    addedTile.setSkip(game.getSkip())
    addedTile.setRepeat(game.getRepeat())
    addedTile.setForward(game.getForward())
    addedTile.setBackward(game.getBackward())
    addedTile.setMustThrown(game.getMustThrown())

    addedTile.setQuestionId(game.getQuestionId())
    addedTile.setRandomQuestion(game.getRandomQuestion())
    addedTile.setNextTilesIds(returnNextTileMap())
    reload(ctx)
   
    return addedTile    
  }
  let update = function(){
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
      let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
      let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
      let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
      let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
      let insertImage = game.getImage()
      
    game.updateChoosenTile(colorPicker!.value,parseInt(sizeOfTileSlider!.value),parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage)
    game.getChoosenTile()!.setIsStartingFor(game.getStartForPlayers().slice())
    game.getChoosenTile()!.setIsEndingFor(game.getEndForPlayers().slice())
    
    game.getChoosenTile()?.setPawns([])

    game.getChoosenTile()?.getIsStartingFor().forEach((player:string)=>{
         for (let i = 0;i<game.getNumberOfStartingPawns();i++){
        game.getPawns().push(new Pawn(player,game.getChoosenTile()!))
      }
    })

    game.getChoosenTile()!.setCantBeEliminatedOnTile(game.getCantBeEliminatedOnTile().slice())
    game.getChoosenTile()!.setSkip(game.getSkip())
    game.getChoosenTile()!.setRepeat(game.getRepeat())
    game.getChoosenTile()!.setForward(game.getForward())
    game.getChoosenTile()!.setBackward(game.getBackward())
    game.getChoosenTile()!.setMustThrown(game.getMustThrown())
    game.getChoosenTile()!.setQuestionId(game.getQuestionId())
    game.getChoosenTile()!.setRandomQuestion(game.getRandomQuestion())

    game.getChoosenTile()!.getPawns().forEach((pawn:Pawn)=>{
      if (!game.getChoosenTile()!.getIsStartingFor().includes(pawn.player)){
        game.getChoosenTile()?.removePawn(pawn)
        game.removePawn(pawn)
      }})

    reload(ctx)
   
  }
  let setValues = function(tile:Tile,copyNumber:boolean){
    if (tile == undefined){
      tile = game.getChoosenTile()!
    
    }
    
    if (tile!=undefined){
     
      game.setSkip(tile.getSkip())
      game.setRepeat(tile.getRepeat())
      game.setForward(tile.getForward())
      game.setBackward(tile.getBackward())
      
      game.setMustThrown(tile.getMustThrown())
      game.setQuestionId(tile.getQuestionId())
      game.setRandomQuestion(tile.getRandomQuestion())
      let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
      let sizeOfTileSliderShower:HTMLParagraphElement = <HTMLParagraphElement>doc.getElementById('sizeOfTileSliderShower')!
      let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
      let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
      let sizeOfOutlineSliderShower:HTMLParagraphElement = <HTMLParagraphElement>doc.getElementById('sizeOfOutlineSliderShower')!
      let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
      let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
  
      colorPicker.value = tile!.getColor()
      sizeOfTileSlider.value = tile!.getRadius().toString()
      sizeOfTileSliderShower.textContent = tile!.getRadius().toString()
      sizeOfOutlineSlider.value = tile!.getStroke().toString()
      sizeOfOutlineSliderShower.textContent = tile!.getStroke().toString()
      outlineColorPicker.value = tile!.getStrokeColor()
 
      if (tile.getSkip()!=0){
        document.getElementById('pickedEventParagraph')!.textContent =texts[105] + tile.getSkip() +texts[100]    
      }
      else if (tile.getRepeat()!=0){     
        document.getElementById('pickedEventParagraph')!.textContent =texts[108] + tile.getRepeat() +texts[100]
        
      }
      else if (tile.getForward()!=0){
        document.getElementById('pickedEventParagraph')!.textContent =texts[99] + tile.getForward() +texts[100]
      }
      else if (tile.getBackward()!=0){
        document.getElementById('pickedEventParagraph')!.textContent =texts[103] + tile.getBackward() +texts[100]
      }
      else if (tile.getMustThrown()!=0){
        document.getElementById('pickedEventParagraph')!.textContent =texts[110] + tile.getMustThrown() +texts[111];
      }
      else if (tile.getQuestionId()!=-1){
        document.getElementById('pickedEventParagraph')!.textContent = texts[71] + game.getQuestions().get(tile.getQuestionId());
      }
      else if (tile.getRandomQuestion()){
        document.getElementById('pickedEventParagraph')!.textContent = texts[201]
      }
      else{
        document.getElementById('pickedEventParagraph')!.textContent = texts[197]
      
      }
      shapeMenu.value = tile!.getShape()
    }
    else{
      (<HTMLInputElement>doc.getElementById('sizeOfTileSlider')!).value = lastSize;
      ( <HTMLInputElement>doc.getElementById('colorPicker')!).value = lastColor;
      ( <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!).value = lastOutline;
      (<HTMLInputElement>doc.getElementById('outlineColorPicker')!).value = lastOutlineColor;
      (<HTMLSelectElement>doc.getElementById('shapeMenu')!).value = lastShape
   
    
    }
    return tile
  }

  let moveTile = function(event:MouseEvent){
      game.moveTile(event)
      reload(ctx)
   
  }

  function showActualState(updateTile:boolean = true){
    if (game.getChoosenTile()! && updateTile){
      update()
    }
    let cs = <HTMLCanvasElement>document.getElementById('changeCanvas')!
    let cttttx = <CanvasRenderingContext2D> cs.getContext("2d");
    reload(cttttx)
   
    let width = cs.width
    let height = cs.height
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!

    let image:HTMLImageElement|undefined = game.getImage()
    if (game.getChoosenTile()!= undefined){
      
        image =  game.getChoosenTile()!.getImage()
      
    }
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
    let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
    let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
    let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
    let stroke = parseInt(sizeOfOutlineSlider!.value)
    let tile = game.initTile(false,{x:width/2,y:height/2},colorPicker!.value,parseInt(sizeOfTileSlider!.value),stroke,outlineColorPicker!.value,shapeMenu!.value,image)
 
    if (game.getChoosenTile()!= undefined){
      tile.setTileNumber(game.getChoosenTile()!.getTileNumber())
    }
    tile.setImage(image!)
    cttttx.clearRect(0,0,cs.width,cs.height)
    cttttx.resetTransform()
    
    tile.drawTile(cs,<CanvasRenderingContext2D>(<HTMLCanvasElement>document.getElementById('changeCanvas')!).getContext("2d"),true)
    
    reload(ctx)
  
   
    if (game.getChoosenTile()== undefined){
      lastSize = sizeOfTileSlider.value
      lastColor = colorPicker.value
      lastOutline = sizeOfOutlineSlider.value
      lastOutlineColor= outlineColorPicker.value
      lastShape = shapeMenu.value
    }
  }
  function generateNextTiles(){
    elementDeleter('nextTileModalBody')
      game.getPlayerTokens().forEach((token:string)=>{
       
        let div = document.createElement('div')
        div.id = 'div' + token
        let input = document.createElement('input')
        input.type = 'number'
        input.id ='nextTile'+token
        
        if (game.getChoosenTile()!=undefined){
          input.value = game.getChoosenTile()!.getNextTilesIds().get(token)!.toString()
          
        }
        else{
          input.value = game.getNextTilesIds().get(token)!.toString()
        }
    
        document.getElementById('nextTileModalBody')!.appendChild(div)

        spawnParagraph(document,'div' + token,'',texts[148]+token+texts[149],false)
        div.appendChild(input)
  })
   }

  function returnNextTileMap(){
    let ret = new Map()
    Array.from(game.getNextTilesIds().entries()).forEach(([key,value])=>{
      ret.set(key,value)
      game.getNextTilesIds().set(key,value+1)
    })
    return ret
  }
  function copyNextTileMap(){
    let ret = new Map()
    Array.from(game.getNextTilesIds().entries()).forEach(([key,value])=>{
      ret.set(key,value)
    })
    return ret
  }
 
  export{update,moveEventHandler,copyNextTileMap,startInsertingByOne,insert,pickTile,editTiles,deleteTiles,unchooseEverything,moveTiles,removeAllButtons,showActualState,removeAllListenersAdded,spawnElements,spawnTile,undoTileInsert,saveInsertingTiles}


  