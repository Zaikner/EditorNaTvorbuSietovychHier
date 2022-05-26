
import {mainMenu,doc,elementDeleter,canvas,ctx, calibreEventCoords,game,reload} from './canvas.js'
import { editorSocket,canMovePawnFunc,texts} from './clientSocket.js'
import { editTrack, endDrawingPath } from './PathEditor.js'

import {spawnColorPicker,spawnParagraph,spawnCanvas,spawnCheckerWithLabel,spawnCheckerWithValueShower,spawnSliderWithValueShower,spawnButton,spawnSelectMenu, spawnImageInput, spawnMultiSelect, spawnNumberInput, spawnHeading, spawnRadioButtons, spawnButtonWithLabel}from './Elements.js'
import { Tile } from './Tile.js'
import {Warning} from './Warning.js'
import { deletePawn, insertPawn } from './PawnEditor.js'
import { Pawn } from './Pawn.js'
import { spawn } from 'child_process'
import { removeAllComponentListeners } from './BackgroundEditor.js'
import { text } from 'body-parser'
let idik = 0

let lastSize:string = '30'
let lastColor:string = '#000000'
let lastOutline:string = '3'
let lastOutlineColor:string ='#000000'
let lastShape:string = 'circle'
let lastImage:HTMLImageElement = undefined!
let lastSkip:number = undefined!
let lastBackwards:number = undefined!
let lastForwards:number = undefined!
let lastRepeat:number = undefined!
let lastQuestionId:number = undefined!
let lastMustThrown:number = undefined!
let lastTurnsToFree:number = undefined!








let moveEventHandler = function(event:MouseEvent) {
  idik+=1
  console.log('vypalil move' + idik)
  let coords = calibreEventCoords(event)
  let dist = Math.sqrt( Math.pow((coords.x-startX), 2) + Math.pow((coords.y-startY), 2) )
  console.log(dist)
  //if (dist < 1){
    console.log('takže ho pustil')
    //game.findTile(event,true)  
  //}
  canvas.removeEventListener('mousemove',game.moveTile)
  tilik = undefined!
  canvas.removeEventListener('mousemove',moveWithTile)
reload(game,ctx)
}
let onlyMoveHandler = function(event:MouseEvent) {game.findTile(event,false)
  //console.log('zavolal only move')   
  reload(game,ctx)
  }
let pickTile = function(event:MouseEvent,token:string,value:number) {game.findTile(event,false)
  //console.log('aspon spustil pickTile')
  if (game.getChoosenTile()!=undefined){
    let pawn:any = game.getChoosenTile()!.havePawnOnTile(token)
    //console.log('aspon vybral')
    if (pawn!= undefined){
      //'TU RADSEJ EMITOVAT NA SERVER, NECH VSSETKYCH ODSTRANI'
      //'AAAA NEZABUDNI NA LISTERNER'
      //game.movePawnById(pawn.id,value)
      const params = new URLSearchParams(window.location.search);
      if (pawn.canMove(value))
      {
       // console.log('can move, teda pohol')
        
        editorSocket.emit('move pawns',{pawn:pawn.id,value:value,room:params.get('id')})
        canvas.removeEventListener('click',canMovePawnFunc)
      }
      else{
//console.log('nepohol, teda odnuluje')
        game.getChoosenTile()?.setIsChoosen(false)
        game.setChoosenTile(undefined!)
      }
    
      //(msg:{room:string,pawn:number,value:number})
     // console.log('pohol s panacikom')
    }
  }
  
 
  reload(game,ctx)
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
    //spawnButton(doc,"buttonPlace",'endInsertingButton',["btn","btn-dark"],texts[121],insertTilesMenu)   
  

    spawnButton(doc,"buttonPlace",'undoButton',["btn","btn-dark"],texts[122],undoTileInsert)
    spawnButton(doc,"buttonPlace",'copyStyleButton',["btn","btn-dark"],texts[123],copyTileStyle)
  
    reload(game,ctx)
    canvas.addEventListener('mousedown', insert);
    }
let deleteHandler = function(event:MouseEvent){
  game.deleteTile()
  reload(game,ctx)}


function spawnElements(){
    //$('#exampleModal').modal('toggle')
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


    //spawnParagraph(doc,"tileEditingPlace",'',texts[173],true)
    //spawnCheckerWithValueShower(doc,"tileEditingPlace",'eliminationChecker',false,[texts[92],texts[93]])

    //spawnParagraph(doc,"tileEditingPlace",'',texts[125],true)
    let sizeOfTileSlider = spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfTileSlider',texts[125],'20','50','1',lastSize)
    sizeOfTileSlider.onchange = function(){showActualState()}
   
   
    // spawnParagraph(doc,"tileEditingPlace",'',texts[126],true)
    // let outlineChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'outlineChecker',false,[texts[92],texts[93]])
    // outlineChecker.onchange = showActualState

    // spawnParagraph(doc,"tileEditingPlace",'',texts[127],true)
    let outlineColorPicker = spawnColorPicker(doc,"tileEditingPlace",'outlineColorPicker',texts[127])
    outlineColorPicker.onchange =function(){showActualState()}
    outlineColorPicker.value = lastOutlineColor
    

    //spawnParagraph(doc,"tileEditingPlace",'',texts[128],true)
    
    let sizeOfOutlineSlider = spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfOutlineSlider',texts[128],'0','10','1',lastOutline)
    sizeOfOutlineSlider.onchange = function(){showActualState()}
    
    //spawnParagraph(doc,"tileEditingPlace",'',texts[129],true)
    let shapeMenu = spawnSelectMenu(doc,"tileEditingPlace",'shapeMenu',texts[129],["btn","btn-dark"],['circle','square'])
    //let shapeMenu =spawnRadioButtons(doc,"tileEditingPlace",'shapeMenu',texts[129],["btn","btn-dark"],['circle','square'], showActualState)
    shapeMenu.onchange= function(){showActualState()}
    

    
  //   spawnParagraph(doc,"tileEditingPlace",'',texts[130],true)
  //   let patternChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'patternChecker',false,[texts[92],texts[93]])
  //   patternChecker.onchange = showActualState

  // spawnImageInput(doc,"tileEditingPlace",'tilePattern',texts[131],texts[131],function(){
  
  //   if ((<HTMLInputElement>doc.getElementById('tilePattern')!).files!.length > 0){
  //     game.setPattern(new Image())
  //       game.getPattern()!.src =URL.createObjectURL((<HTMLInputElement>doc.getElementById('tilePattern')!).files![0]!)    
  //       game.getPattern().onload = function (){
  //         showActualState()
  //       }
        
  //     }
  //   else{
  //     game.setPattern(undefined!)
  //   }
  // })
  
  

  //   spawnParagraph(doc,"tileEditingPlace",'',texts[133],true)
    // let backgroundChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'backgroundChecker',false,[texts[92],texts[93]])
    // backgroundChecker.onchange = showActualState
  
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

//spawnParagraph(doc,"tileEditingPlace",'',texts[135],true)
spawnMultiSelect(doc,'tileEditingPlace','',texts[135],texts[192],options,'start',game.getChoosenTile() == undefined)

//spawnParagraph(doc,"tileEditingPlace",'',texts[136],true)
spawnMultiSelect(doc,'tileEditingPlace','',texts[136],texts[192],options,'end',game.getChoosenTile() == undefined)

// spawnParagraph(doc,"tileEditingPlace",'','Which player can visit this tile? (choose players)',true)
// spawnMultiSelect(doc,'tileEditingPlace','',game.getPlayerTokens(),'enabled')

  
   
    //spawnParagraph(doc,"tileEditingPlace",'',texts[138],true)
    // let numberingColorPicker =spawnColorPicker(doc,"tileEditingPlace",'numberingColorPicker',texts[138])
    // numberingColorPicker.onchange = showActualState

    // spawnParagraph(doc,"tileEditingPlace",'',texts[139],true)
    // let tileNumberSetter = spawnNumberInput(doc,"tileEditingPlace",'tileNumberSetter')
    // tileNumberSetter.onchange = showActualState

    //spawnParagraph(doc,"tileEditingPlace",'',texts[140],true)
    spawnButtonWithLabel(doc,"tileEditingPlace",'setNextTileButton',texts[141],['btn','btn-dark'],texts[208],function(){
      
      $('#nextTileModal').modal('show');
      generateNextTiles()
      
    })
    

    

    
    //spawnParagraph(document,'tileEditingPlace','',texts[142],true)
    //spawnCheckerWithValueShower(document,'tileEditingPlace','eleminationChecker',false,[texts[92],texts[93]])
    //spawnCheckerWithLabel(document,'tileEditingPlace','eleminationChecker',texts[142],false,[texts[92],texts[93]])
    //spawnButtonWithLabel(doc,"tileEditingPlace",'eleminationButton','',['btn','btn-secondary'],texts[142],function(){
      
     
      
    //})
    //spawnParagraph(document,'tileEditingPlace','',texts[143],true)
  
    spawnMultiSelect(document,'tileEditingPlace','cantBeEleminated',texts[143],texts[192],options,'immune',game.getChoosenTile() == undefined)

    //spawnParagraph(document,'tileEditingPlace','',texts[144],true)
    //let questionChecker =spawnCheckerWithValueShower(document,'tileEditingPlace','askQuestionChecker',false,[texts[92],texts[93]])

    //pawnParagraph(document,'tileEditingPlace','',texts[72],true)
    //spawnButton(document,'tileEditingPlace','bindQuestion',['btn','btn-secondary'],texts[114],function(){
      
    //   if (!questionChecker.checked){
    //     Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.')
    //   }
    //   else{
    //     editorSocket.emit('loadQuestions')
    //     $('#pickQuestionModal').modal('show');
    //   }
    

    // })
    //spawnParagraph(document,'tileEditingPlace','pickedQuestionParagraph',texts[145],true)
    // spawnParagraph(document,'tileEditingPlace','',texts[146],true)
    // let eventChecker =spawnCheckerWithValueShower(document,'tileEditingPlace','eventChecker',false,[texts[92],texts[93]])

    

    //spawnParagraph(document,'tileEditingPlace','',texts[98],true)
    spawnButtonWithLabel(document,'tileEditingPlace','bindEvent',texts[98],['btn','btn-dark'],texts[174],function(){
      $('#EventModal').modal('show');
    
      // if (!questionChecker.checked){
      //   Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.')
      // }
      // else{
      //   editorSocket.emit('loadQuestions')
      //   $('#pickQuestionModal').modal('show');
      // }
      //$('#EventModal').modal('show');
      
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
   
    //document.getElementById('pickedEventParagraph')!.textContent = texts[71] + elem.questionText;
}

// function insertTilesMenu():void{
//   //unchooseEverything()
//   //doc.getElementById("canvasPlace")!.style.cursor = 'default'
//   removeAllListenersAdded()
//   game.makeAllTilesNotChoosen()
//   reload(game,ctx)
//   removeAllButtons()  
//   canvas.addEventListener('mouseup',moveEventHandler)
//     spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],texts[79],saveInsertingTiles)
//     spawnButton(doc,"buttonPlace",'drawPath',["btn","btn-dark"],texts[26],editTrack)
//     spawnButton(doc,"buttonPlace",'startInsertingButton',["btn","btn-dark"],texts[27],startInsertingByOne)
    
// }

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
   // game.setChoosenTile(undefined!)
   // console.log(game.getChoosenTile())
   let found = false;
  
   let tiles = game.getTiles()
   
   for (let i = tiles.length-1; i >= 0;i--){
       if (tiles[i].isPointedAt(coords.x,coords.y)){
            tilik =tiles[i]
            break
           }
           
       }
    // console.log('nasiel tilik:')
    // console.log(tilik)
    game.findTile(event,false)
    
    //canvas.addEventListener('mousemove',moveWithTile)
    //console.log(coords)
   // console.log(game.getChoosenTile())
  }
  

  function startInsertingByOne(){
    game.nullEditor()
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllButtons()
    removeAllListenersAdded()
    
    
    //canvas.addEventListener('mousedown', insert);
    canvas.addEventListener('mousedown',initMove)
    canvas.addEventListener('mouseup', moveEventHandler);
    
    //canvas.addEventListener('mousedown',moveTile)
    //spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],texts[79],saveInsertingTiles)
    //spawnButton(doc,"buttonPlace",'endInsertingButton',["btn","btn-dark"],texts[28],insertTilesMenu)   
    spawnElements()

    //spawnButton(doc,"tileEditingPlace",'undoButton',["btn","btn-dark"],texts[122],undoTileInsert)
    //spawnButton(doc,"buttonPlace",'copyStyleButton',["btn","btn-dark"],texts[123],copyTileStyle)
    showActualState()
  }

  function copyTileStyle(){
    game.nullEditor()
    removeAllButtons()
    removeAllListenersAdded()
    spawnParagraph(document,'tileEditingPlace','',texts[147],true)
    document.getElementById('wholeBody')!.style.cursor = 'pointer'
    //canvas.style.cursor = 'pointer'
    //document.getElementById('optionPlace')!.style.cursor = 'pointer'
    canvas.addEventListener('click',copyTile)
  }
  function saveInsertingTiles(){
    removeAllButtons()
    removeAllListenersAdded()
    unchooseEverything()
    reload(game,ctx)
    mainMenu();
  }

  function editTiles():void{
   // console.log('zavolal update')
    game.nullEditor()
    document.getElementById('removeTileButton')!.removeAttribute('hidden')
    canvas.addEventListener('mousemove',moveWithTile)
    
    
    //removeAllListenersAdded()
    //canvas.addEventListener('mouseup',moveEventHandler)
    //canvas.addEventListener('mousedown',initMove)
    //canvas.addEventListener('mousemove',game.moveTile)
    removeAllButtons()
    game.setIsMoving(false)
    //spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],texts[79],saveEditingTiles)
    //spawnButton(doc,"buttonPlace",'Update',["btn","btn-dark"],texts[64],update)   

    if ( game.getChoosenTile()!= undefined){
      game.setStartForPlayers(game.getChoosenTile()!.getIsStartingFor().slice())
      game.setEndForPlayers(game.getChoosenTile()!.getIsEndingFor().slice())
     
     
    }
  

      spawnElements()

      setValues(undefined!,true)
    showActualState(false)      
    }
  
    function saveEditingTiles(){
      removeAllButtons()
      removeAllListenersAdded()
      game.makeAllTilesNotChoosen()
      reload(game,ctx)
      mainMenu();
    }
  
  function moveTiles(){
    //canvas.removeEventListener('click',moveEventHandler)
    removeAllListenersAdded()
    endDrawingPath()
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    game.makeAllTilesNotChoosen()
    reload(game,ctx)
    game.setIsMoving(true)
    removeAllButtons()
    //canvas.addEventListener('click',onlyMoveHandler)
    //addEventListener('mousemove',moveTile)
    //canvas.addEventListener('mousedown',moveTile)
  }
  function deleteTiles(){
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllListenersAdded()
    removeAllButtons()
    spawnButton(doc,"buttonPlace",'End',["btn","btn-dark"],texts[90],saveInsertingTiles) 
   
    //canvas.addEventListener('click',deleteHandler)
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
    removeAllComponentListeners()
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

  
    endDrawingPath()

    //document.getElementById('wholeBody')!.style.cursor = 'default'
    canvas.style.cursor = 'default'
    //document.getElementById('optionPlace')!.style.cursor = 'default'
    reload(game,ctx)
  }
  function unchooseEverything(){
    game.makeAllTilesNotChoosen()
    game.getBackground().makeAllComponentsNotChoosen()
    reload(game,ctx)
  }

  function undoTileInsert(){
      game.removeLastFromUndoLog()
      reload(game,ctx)
  }

  let  insert = function(event:MouseEvent){
    unchooseEverything()
    game.setChoosenTile( undefined!)
    let coords = calibreEventCoords(event)
    let canSpawn = true
    // if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
    //   if (!game.tileWithNumberExists(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))){
    //     canSpawn = false
    //     Warning.show("Following tile with that number doesn't exist")
    //   }
    // }
    if (canSpawn){
      var addedTile = spawnTile(coords)
      game.addToUndoLog([addedTile])
      addedTile.getIsStartingFor().forEach((player:string)=>{
        game.insertPawns(player,addedTile)
        console.log(game)
      })
      showActualState()
    }
  //  console.log(game)
    
  }

  let spawnTile = function(coords:{x:number,y:number}){
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
    let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
    let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
    let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
    //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
    
    var insertImage = game.getImage()
    

  
    // if (!backgroundChecker.checked){
    //   insertImage = undefined!
    // }
  
    
    let addedTile = game.initTile(true,coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage)
    addedTile.setIsStartingFor(game.getStartForPlayers().slice())
    addedTile.setIsEndingFor(game.getEndForPlayers().slice())

    //addedTile.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    //addedTile.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    
    addedTile.setCantBeEliminatedOnTile(game.getCantBeEliminatedOnTile().slice())

    addedTile.setSkip(game.getSkip())
    addedTile.setRepeat(game.getRepeat())
    addedTile.setForward(game.getForward())
    addedTile.setBackward(game.getBackward())
    addedTile.setMustThrown(game.getMustThrown())
    addedTile.setTurnsToSetFree(game.getTurnsToSetFree())
    addedTile.setQuestionId(game.getQuestionId())
    addedTile.setRandomQuestion(game.getRandomQuestion())
    
   
    
    // if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0){
      
    //   addedTile.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
      
    //   let tileWithSameNumber = game.getTiles()
    //   .filter((t:Tile) => {return t!= addedTile && t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
    //   if (tileWithSameNumber.length > 0){

    //     tileWithSameNumber[0].setTileNumber(game.nextTileNumber())
    //   }
       
    // }
    // if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
    //   addedTile.setFollowingTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))    
    // }
    
    // if ((<HTMLInputElement>document.getElementById('askQuestionChecker')).checked){
    //   addedTile.setQuestionId(game.getQuestionId())
    // }
    // else{
    //   addedTile.setQuestionId(-1)
    // }

    addedTile.setNextTilesIds(returnNextTileMap())
    reload(game,ctx)
   // console.log(addedTile)
  //  console.log(game)
    return addedTile    
  }
  let update = function(){
   console.log('zavolal update')
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
      let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
      let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
      let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
      let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
      let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
      //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
      //let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
      let insertImage = game.getImage()
     
      
      //let pattImage = game.getPattern()
      // if (!backgroundChecker.checked){
      //   insertImage = undefined!
      // }
      // if (!patternChecker.checked){
      //   pattImage = undefined!
      // }
     
    game.updateChoosenTile(colorPicker!.value,parseInt(sizeOfTileSlider!.value),parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage)
    game.getChoosenTile()!.setIsStartingFor(game.getStartForPlayers().slice())
    game.getChoosenTile()!.setIsEndingFor(game.getEndForPlayers().slice())
    

    game.getChoosenTile()?.setPawns([])

    game.getChoosenTile()?.getIsStartingFor().forEach((player:string)=>{
         for (let i = 0;i<game.getNumberOfStartingPawns();i++){
        game.getPawns().push(new Pawn(player,game.getChoosenTile()!))
      }
    })

   // console.log(game.getChoosenTile()!)
  //  console.log(game.getStartForPlayers().slice())
  
    
    //game.getChoosenTile()!.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    //game.getChoosenTile()!.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    
   
    game.getChoosenTile()!.setCantBeEliminatedOnTile(game.getCantBeEliminatedOnTile().slice())
  
    // if ((<HTMLInputElement>document.getElementById('eventChecker')).checked){
     
    game.getChoosenTile()!.setSkip(game.getSkip())
    game.getChoosenTile()!.setRepeat(game.getRepeat())
    game.getChoosenTile()!.setForward(game.getForward())
    game.getChoosenTile()!.setBackward(game.getBackward())
    game.getChoosenTile()!.setMustThrown(game.getMustThrown())
    game.getChoosenTile()!.setTurnsToSetFree(game.getTurnsToSetFree())
    game.getChoosenTile()!.setQuestionId(game.getQuestionId())
    game.getChoosenTile()!.setRandomQuestion(game.getRandomQuestion())
    // }
    // else{
      // game.getChoosenTile()!.setSkip(0)
      // game.getChoosenTile()!.setRepeat(0)
      // game.getChoosenTile()!.setForward(0)
      // game.getChoosenTile()!.setBackward(0)
      // game.getChoosenTile()!.setMustThrown(0)
      // game.getChoosenTile()!.setTurnsToSetFree(0)
    // }
    // if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0  && game.getChoosenTile()?.getTileNumber()!= parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)){
    //   game.getChoosenTile()!.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
    
    //   let tileWithSameNumber = game.getTiles()
    //   .filter((t:Tile) => {return t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
    //   if (tileWithSameNumber.length > 0){
    //     tileWithSameNumber[0].setTileNumber(game.nextTileNumber())
    //   }
       
    //}
    game.getChoosenTile()!.getPawns().forEach((pawn:Pawn)=>{
      if (!game.getChoosenTile()!.getIsStartingFor().includes(pawn.player)){
        game.getChoosenTile()?.removePawn(pawn)
        game.removePawn(pawn)
      }})

      // if ((<HTMLInputElement>document.getElementById('askQuestionChecker')).checked){
      //   game.getChoosenTile()?.setQuestionId(game.getQuestionId())
      // }
      // else{
      //   game.getChoosenTile()?.setQuestionId(-1)
      // }S


      //game.getChoosenTile()!.setNextTilesIds(returnNextTileMap())
  //  console.log(game.getChoosenTile())
    reload(game,ctx)
  }
  let setValues = function(tile:Tile,copyNumber:boolean){
    if (tile == undefined){
      tile = game.getChoosenTile()!
    
    }
    else{}
     
//    console.log('choosen tile je :')
  //  console.log(tile)
    if (tile!=undefined){
     
      game.setSkip(tile.getSkip())
      game.setRepeat(tile.getRepeat())
      game.setForward(tile.getForward())
      game.setBackward(tile.getBackward())
      
      game.setMustThrown(tile.getMustThrown())
      game.setTurnsToSetFree(tile.getTurnsToSetFree())
      game.setQuestionId(tile.getQuestionId())
      game.setRandomQuestion(tile.getRandomQuestion())
      let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
      let sizeOfTileSliderShower:HTMLParagraphElement = <HTMLParagraphElement>doc.getElementById('sizeOfTileSliderShower')!
      let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
      //let numberingColor:HTMLInputElement = <HTMLInputElement>doc.getElementById('numberingColorPicker')!
      let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
      let sizeOfOutlineSliderShower:HTMLParagraphElement = <HTMLParagraphElement>doc.getElementById('sizeOfOutlineSliderShower')!
      let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
      //let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
      let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
      //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
      //let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
      let toogleNumberingChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('toogleNumberingChecker')!
      
      let tileNumberSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileNumberSetter')!
      //let tileFollowingSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileFollowingSetter')!
      //let choosenTile = game.getChoosenTile()
      

      colorPicker.value = tile!.getColor()
    
      //numberingColor.value = tile!.getNumberingColor()
      sizeOfTileSlider.value = tile!.getRadius().toString()
      sizeOfTileSliderShower.textContent = tile!.getRadius().toString()
      sizeOfOutlineSlider.value = tile!.getStroke().toString()
      sizeOfOutlineSliderShower.textContent = tile!.getStroke().toString()
      outlineColorPicker.value = tile!.getStrokeColor()
     
      // if (copyNumber){
      //   tileNumberSetter.value = tile!.getTileNumber().toString()
      //   //tileFollowingSetter.value = tile!.getFollowingTileNumber().toString()
      // }
      // else{
      //   console.log('nastavil spravne')
      //   tileNumberSetter.value = ''
      //   //tileFollowingSetter.value = ''
      // }
      
      

      // if (tile.getQuestionId()!=-1){
      //   (<HTMLInputElement>document.getElementById('askQuestionChecker')).checked = true;
      //   (doc.getElementById("askQuestionCheckerShower"))!.textContent = texts[93]
        
      //   //document.getElementById('bindQuestion')!.textContent = 'Choosen Question Id: '+tile.getQuestionId()
       

      // }
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
       
        

        document.getElementById('pickedEventParagraph')!.textContent =texts[110] + tile.getMustThrown() +texts[111] + tile.getTurnsToSetFree() + texts[100];
      }
      else if (tile.getQuestionId()!=-1){
        document.getElementById('pickedEventParagraph')!.textContent = texts[71] + game.getQuestions().get(tile.getQuestionId());
      }
      else if (tile.getRandomQuestion()){
        //console.log('chooooooooooooooooooooooosen tile:')
       // console.log(game.getChoosenTile())
        document.getElementById('pickedEventParagraph')!.textContent = texts[201]
      }
      else{
        document.getElementById('pickedEventParagraph')!.textContent = texts[197]
      
      }

    

      shapeMenu.value = tile!.getShape()
      
    
      // toogleNumberingChecker.checked = tile.getToggleNumber()!
      // if (toogleNumberingChecker.checked){
      //   doc.getElementById("toogleNumberingCheckerShower")!.textContent = texts[92]
        
      // }
      // else{
      //   doc.getElementById("toogleNumberingCheckerShower")!.textContent = texts[93]
      // }












      // Array.from(game.getChoosenTile()!.getNextTilesIds().entries()).forEach(([key,value])=>{
      //   console.log(key)
      //   console.log(value)
      //   console.log('nextTile'+key)
      //   console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)
      //   // let input =  (<HTMLInputElement>document.getElementById('nextTile'+key))!
      //   if ((<HTMLInputElement>document.getElementById('nextTile'+key)!=undefined)){
      //     (<HTMLInputElement>document.getElementById('nextTile'+key)).textContent = value.toString()
      //   }
      //   //(<HTMLInputElement>document.getElementById('nextTile'+key))!.textContent = value.toString();
      //   //(<HTMLInputElement>document.getElementById('nextTile'+key))!.value = value.toString()
      //   console.log('nastavil '+ value)
      //   console.log('nastavil '+  key)
      //   console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)

      // })
  
    }
    else{
      (<HTMLInputElement>doc.getElementById('sizeOfTileSlider')!).value = lastSize;
      ( <HTMLInputElement>doc.getElementById('colorPicker')!).value = lastColor;
      ( <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!).value = lastOutline;
      (<HTMLInputElement>doc.getElementById('outlineColorPicker')!).value = lastOutlineColor;
      (<HTMLSelectElement>doc.getElementById('shapeMenu')!).value = lastShape
   
    
    }

    //startingFor = doc.getElementById('')
   
    return tile
  }



 

  let moveTile = function(event:MouseEvent){
      game.moveTile(event)
      reload(game,ctx)
  }

  function showActualState(updateTile:boolean = true){
    if (game.getChoosenTile()! && updateTile){
      update()
    }
    let cs = <HTMLCanvasElement>document.getElementById('changeCanvas')!
    let cttttx = <CanvasRenderingContext2D> cs.getContext("2d");
    reload(game,cttttx)
    let width = cs.width
    let height = cs.height
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!

    let image:HTMLImageElement|undefined = game.getImage()
    if (game.getChoosenTile()!= undefined){
      
        image =  game.getChoosenTile()!.getImage()
      
    }
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
    //let numberingColor:HTMLInputElement = <HTMLInputElement>doc.getElementById('numberingColorPicker')!
    let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
    let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
    //let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
    let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
    //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
    //let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
    //let toogleNumberingChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('toogleNumberingChecker')!
  

    let stroke = parseInt(sizeOfOutlineSlider!.value)
    let tile = game.initTile(false,{x:width/2,y:height/2},colorPicker!.value,parseInt(sizeOfTileSlider!.value),stroke,outlineColorPicker!.value,shapeMenu!.value,image)
    //tile.setNumberingColor(numberingColor.value)
    // if (tileNumberSetter.value != ""){
    //   tile.setTileNumber(parseInt(tileNumberSetter.value))
    // }
    if (game.getChoosenTile()!= undefined){
      tile.setTileNumber(game.getChoosenTile()!.getTileNumber())
    }
    tile.setImage(image!)
    //tile.setRadius(tile.getRadius()*2)
    cttttx.clearRect(0,0,cs.width,cs.height)
    cttttx.resetTransform()
    
    tile.drawTile(cs,<CanvasRenderingContext2D>(<HTMLCanvasElement>document.getElementById('changeCanvas')!).getContext("2d"),true)
    
    reload(game,ctx)
   
    if (game.getChoosenTile()== undefined){
      lastSize = sizeOfTileSlider.value
      lastColor = colorPicker.value
      lastOutline = sizeOfOutlineSlider.value
      lastOutlineColor= outlineColorPicker.value
      lastShape = shapeMenu.value
    }
    console.log(game)
  }
  function generateNextTiles(){
    elementDeleter('nextTileModalBody')
   // if (game.getChoosenTile() == undefined){
     console.log( game.getPlayerTokens())
     console.log(game.getNextTilesIds())
      game.getPlayerTokens().forEach((token:string)=>{
       
        let div = document.createElement('div')
        div.id = 'div' + token
        //div.style.width = '100%'

        

        let input = document.createElement('input')
        input.type = 'number'
        input.id ='nextTile'+token
        console.log('vygeneroval')
        console.log('input')
        if (game.getChoosenTile()!=undefined){
          console.log('neundefined')
          input.value = game.getChoosenTile()!.getNextTilesIds().get(token)!.toString()
          //console.log('generate nextTile nastavil pre ' + 'nextTile'+token + 'hodnotu ' +game.getChoosenTile()!.getNextTilesIds().get(token)!.toString())
        }
        else{
          console.log('undefined')
          input.value = game.getNextTilesIds().get(token)!.toString()
        }
       
        // input.onchange = function(){
          
        //     game.getNextTilesIds().set(token,parseInt(input.value))
        //     if (game.getChoosenTile()!= undefined){
        //       game.getChoosenTile()?.setNextTilesIds(copyNextTileMap())
        //       console.log('prestavil')
        //     }
        // }

       
        document.getElementById('nextTileModalBody')!.appendChild(div)

        spawnParagraph(document,'div' + token,'',texts[148]+token+texts[149],true)
        div.appendChild(input)
  })
    // }else if (game.getChoosenTile() !=undefined){
    //   Array.from(game.getChoosenTile()!.getNextTilesIds().entries()).forEach(([key,value])=>{
    //     console.log(key)
    //     console.log(value)
    //     console.log('nextTile'+key)
    //     console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)
    //     // let input =  (<HTMLInputElement>document.getElementById('nextTile'+key))!
    //     if ((<HTMLInputElement>document.getElementById('nextTile'+key)!=undefined)){
    //       (<HTMLInputElement>document.getElementById('nextTile'+key)).textContent = value.toString()
    //     }
    //     //(<HTMLInputElement>document.getElementById('nextTile'+key))!.textContent = value.toString();
    //     //(<HTMLInputElement>document.getElementById('nextTile'+key))!.value = value.toString()
    //     console.log('nastavil '+ value)
    //     console.log('nastavil '+  key)
    //     console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)
    
    //   })
    // }
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
  function updateNextTileIds(){
    Array.from(game.getNextTilesIds().keys()).forEach((token:string)=>{
      
      game.getNextTilesIds().set(token,parseInt((<HTMLInputElement>document.getElementById('nextTile'+token)).value))
    })
  }
  
  export{update,moveEventHandler,copyNextTileMap,startInsertingByOne,insert,pickTile,editTiles,deleteTiles,unchooseEverything,moveTiles,removeAllButtons,showActualState,removeAllListenersAdded,spawnElements,spawnTile,undoTileInsert,saveInsertingTiles}


  