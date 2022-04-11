
import {mainMenu,doc,elementDeleter,canvas,ctx, calibreEventCoords,editor,reload, editorSocket, canMovePawnFunc} from './canvas.js'

import { editTrack, endDrawingPath } from './PathEditor.js'

import {spawnColorPicker,spawnParagraph,spawnCanvas,spawnCheckerWithValueShower,spawnSliderWithValueShower,spawnButton,spawnSelectMenu, spawnImageInput, spawnMultiSelect, spawnNumberInput}from './Elements.js'
import { Tile } from './Tile.js'
import {Warning} from './Warning.js'
import { deletePawn, insertPawn } from './PawnEditor.js'
import { Pawn } from './Pawn.js'

let moveEventHandler = function(event:MouseEvent) {editor.findTile(event,true)   
reload(editor,ctx)
}
let pickTile = function(event:MouseEvent,token:string,value:number) {editor.findTile(event,false)
  console.log('aspon spustil pickTile')
  if (editor.getChoosenTile()!=undefined){
    let pawn:any = editor.getChoosenTile()!.havePawnOnTile(token)
    console.log('aspon vybral')
    if (pawn!= undefined){
      //'TU RADSEJ EMITOVAT NA SERVER, NECH VSSETKYCH ODSTRANI'
      //'AAAA NEZABUDNI NA LISTERNER'
      //editor.getGame().movePawnById(pawn.id,value)
      const params = new URLSearchParams(window.location.search);
      editorSocket.emit('move pawns',{pawn:pawn.id,value:value,room:params.get('id')})
      canvas.removeEventListener('click',canMovePawnFunc)
      //(msg:{room:string,pawn:number,value:number})
      console.log('pohol s panacikom')
    }
  }
  
 
  reload(editor,ctx)
  }

let copyTile = function(event:MouseEvent) {
  removeAllButtons()
  spawnElements()
  editor.findTile(event,false)
  setValues(undefined!,false)
  showActualState()
  editor.getChoosenTile()?.setIsChoosen(false)
  editor.setChoosenTile(undefined!)   

  spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],'Save!',saveInsertingTiles)
    spawnButton(doc,"buttonPlace",'endInsertingButton',["btn","btn-dark"],'Stop inserting!',insertTilesMenu)   
  

    spawnButton(doc,"buttonPlace",'undoButton',["btn","btn-dark"],'Undo last Tile!',undoTileInsert)
    spawnButton(doc,"buttonPlace",'copyStyleButton',["btn","btn-dark"],'Copy Tile Style!',copyTileStyle)
  
    reload(editor,ctx)
    canvas.addEventListener('mousedown', insert);
    }
let deleteHandler = function(event:MouseEvent){
  editor.deleteTile(event)
  reload(editor,ctx)}


function spawnElements(){
    //$('#exampleModal').modal('toggle')

    spawnCanvas(doc,'tileEditingPlace','changeCanvas')
    spawnParagraph(doc,"tileEditingPlace",'','Choose color of tile:')
    let colorPicker = spawnColorPicker(doc,"tileEditingPlace",'colorPicker')
    colorPicker.onchange = showActualState

    spawnParagraph(doc,"tileEditingPlace",'','Tile size:')
    let sizeOfTileSlider = spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfTileSlider','20','50','1','30')
    sizeOfTileSlider.onchange = showActualState
   
    spawnParagraph(doc,"tileEditingPlace",'','Tile have outline? (checkbox)')
    let outlineChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'outlineChecker',false,['no','yes'])
    outlineChecker.onchange = showActualState

    spawnParagraph(doc,"tileEditingPlace",'','Choose color of outline:')
    let outlineColorPicker = spawnColorPicker(doc,"tileEditingPlace",'outlineColorPicker')
    outlineColorPicker.onchange = showActualState
    

    spawnParagraph(doc,"tileEditingPlace",'','Outline size:')
    
    let sizeOfOutlineSlider = spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfOutlineSlider','1','10','1','3')
    sizeOfOutlineSlider.onchange = showActualState
    
    spawnParagraph(doc,"tileEditingPlace",'','Choose shape:')
    let shapeMenu = spawnSelectMenu(doc,"tileEditingPlace",'shapeMenu',["btn","btn-dark"],['circle','square'])
    shapeMenu.onchange= showActualState
    

    
    spawnParagraph(doc,"tileEditingPlace",'','Tile have pattern from images? (checkbox)')
    let patternChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'patternChecker',false,['no','yes'])
    patternChecker.onchange = showActualState

  spawnImageInput(doc,"tileEditingPlace",'tilePattern','Choose a Pattern!',function(){
  
    if ((<HTMLInputElement>doc.getElementById('tilePattern')!).files!.length > 0){
      editor.setPattern(new Image())
        editor.getPattern()!.src =URL.createObjectURL((<HTMLInputElement>doc.getElementById('tilePattern')!).files![0]!)    
        editor.getPattern().onload = function (){
          showActualState()
        }
        
      }
    else{
      editor.setPattern(undefined!)
    }
  })
  
  spawnParagraph(doc,"tileEditingPlace",'','Choose background image:')

    spawnParagraph(doc,"tileEditingPlace",'','Tile have background image? (checkbox)')
    let backgroundChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'backgroundChecker',false,['no','yes'])
    backgroundChecker.onchange = showActualState
  
    spawnImageInput(doc,"tileEditingPlace",'tileImage','Choose an Image!',function(){
  
      if ((<HTMLInputElement>doc.getElementById('tileImage')!).files!.length > 0){
        editor.setImage(new Image())
          editor.getImage()!.src =URL.createObjectURL((<HTMLInputElement>doc.getElementById('tileImage')!).files![0]!)
          editor.getImage().onload = function(){
            showActualState()
          }
          
        }
      else{
        editor.setImage(undefined!)
      }
    })

spawnParagraph(doc,"tileEditingPlace",'','For whom is this starting tile? (choose players)')
spawnMultiSelect(doc,'tileEditingPlace','',editor.getGame().getPlayerTokens(),'start')

spawnParagraph(doc,"tileEditingPlace",'','For whom is this finishing tile? (choose players)')
spawnMultiSelect(doc,'tileEditingPlace','',editor.getGame().getPlayerTokens(),'end')

spawnParagraph(doc,"tileEditingPlace",'','Which player can visit this tile? (choose players)')
spawnMultiSelect(doc,'tileEditingPlace','',editor.getGame().getPlayerTokens(),'enabled')

    spawnParagraph(doc,"tileEditingPlace",'','Toogle tile numbering ingame? (checkbox)')
    spawnCheckerWithValueShower(doc,"tileEditingPlace",'toogleNumberingChecker',false,['no','yes'])
   
    spawnParagraph(doc,"tileEditingPlace",'','Choose color of numbering:')
    let numberingColorPicker =spawnColorPicker(doc,"tileEditingPlace",'numberingColorPicker')
    numberingColorPicker.onchange = showActualState

    spawnParagraph(doc,"tileEditingPlace",'','Choose tile number! (Insert a number into textfield)')
    let tileNumberSetter = spawnNumberInput(doc,"tileEditingPlace",'tileNumberSetter')
    tileNumberSetter.onchange = showActualState

    spawnParagraph(doc,"tileEditingPlace",'','Which number follows ?! (Insert a number into textfield)')
    spawnNumberInput(doc,"tileEditingPlace",'tileFollowingSetter')


    
    spawnParagraph(document,'tileEditingPlace','','Is pawn elemination on this tile allowed ?')
    spawnCheckerWithValueShower(document,'tileEditingPlace','eleminationChecker',false,['no','yes'])

    spawnParagraph(document,'tileEditingPlace','',"Which players can't be eliminated on this tile?")
    spawnMultiSelect(document,'tileEditingPlace','cantBeEleminated',editor.getGame().getPlayerTokens(),'immune')

    spawnParagraph(document,'tileEditingPlace','','Ask question on this tile?')
    let questionChecker =spawnCheckerWithValueShower(document,'tileEditingPlace','askQuestionChecker',false,['no','yes'])

    spawnParagraph(document,'tileEditingPlace','','Pick question')
    spawnButton(document,'tileEditingPlace','bindQuestion',['btn','btn-secondary'],'Not picked!',function(){
      
      if (!questionChecker.checked){
        Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.')
      }
      else{
        editorSocket.emit('loadQuestions')
        $('#pickQuestionModal').modal('show');
      }
    

    })
    spawnParagraph(document,'tileEditingPlace','','Does event occur when moving to this tile ??')
    let eventChecker =spawnCheckerWithValueShower(document,'tileEditingPlace','eventChecker',false,['no','yes'])

    

    spawnParagraph(document,'tileEditingPlace','','Pick event')
    spawnButton(document,'tileEditingPlace','bindEvent',['btn','btn-secondary'],'Not picked!',function(){
      if (!eventChecker.checked){
        Warning.show('Adding event is not allowed. If you want to enable it, it can be enabled by ticking "Does event occur when moving to this tile ???" checkkox.')
      }
      else{
       
        $('#EventModal').modal('show');
      }
      // if (!questionChecker.checked){
      //   Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.')
      // }
      // else{
      //   editorSocket.emit('loadQuestions')
      //   $('#pickQuestionModal').modal('show');
      // }
      //$('#EventModal').modal('show');
      
    })
}

function insertTilesMenu():void{
  
  doc.getElementById("canvasPlace")!.style.cursor = 'default'
  removeAllListenersAdded()
  editor.makeAllTilesNotChoosen()
  reload(editor,ctx)
  removeAllButtons()  
  canvas.addEventListener('click',moveEventHandler)
    spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],'Save!',saveInsertingTiles)
    spawnButton(doc,"buttonPlace",'drawPath',["btn","btn-dark"],'Draw Path!!',editTrack)
    spawnButton(doc,"buttonPlace",'startInsertingButton',["btn","btn-dark"],'Insert by one!',startInsertingByOne)
    
}
  function startInsertingByOne(){
    editor.nullEditor()
    doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllButtons()
    removeAllListenersAdded()
    
    canvas.addEventListener('mousedown', insert);
    spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],'Save!',saveInsertingTiles)
    spawnButton(doc,"buttonPlace",'endInsertingButton',["btn","btn-dark"],'Stop inserting!',insertTilesMenu)   
    spawnElements()

    spawnButton(doc,"buttonPlace",'undoButton',["btn","btn-dark"],'Undo last Tile!',undoTileInsert)
    spawnButton(doc,"buttonPlace",'copyStyleButton',["btn","btn-dark"],'Copy Tile Style!',copyTileStyle)
    showActualState()
  }

  function copyTileStyle(){
    editor.nullEditor()
    removeAllButtons()
    removeAllListenersAdded()
    spawnParagraph(document,'tileEditingPlace','',"Click on Tile to copy it's style")
    document.getElementById('wholeBody')!.style.cursor = 'pointer'
    canvas.style.cursor = 'pointer'
    document.getElementById('optionPlace')!.style.cursor = 'pointer'
    canvas.addEventListener('click',copyTile)
  }
  function saveInsertingTiles(){
    removeAllButtons()
    removeAllListenersAdded()
    editor.makeAllTilesNotChoosen()
    reload(editor,ctx)
    mainMenu();
  }

  function editTiles():void{
    editor.nullEditor()
    
    removeAllListenersAdded()
    canvas.addEventListener('click',moveEventHandler)
    removeAllButtons()
    editor.setIsMoving(false)
    spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],'Save!',saveEditingTiles)
    spawnButton(doc,"buttonPlace",'Update',["btn","btn-dark"],'Edit button!',update)   

    if ( editor.getChoosenTile()!= undefined){
      editor.setStartForPlayers(editor.getChoosenTile()!.getIsStartingFor())
      editor.setEndForPlayers(editor.getChoosenTile()!.getIsEndingFor())
      editor.setEnabledForPlayers(editor.getChoosenTile()!.getCanOccupy())
     
    }
  

      spawnElements()

      setValues(undefined!,true)
    showActualState()      
    }
  
    function saveEditingTiles(){
      removeAllButtons()
      removeAllListenersAdded()
      editor.makeAllTilesNotChoosen()
      reload(editor,ctx)
      mainMenu();
    }
  
  function moveTiles(){
    //canvas.removeEventListener('click',moveEventHandler)
    endDrawingPath()
    doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    editor.makeAllTilesNotChoosen()
    reload(editor,ctx)
    editor.setIsMoving(true)
    removeAllButtons()
    canvas.addEventListener('click',moveEventHandler)
    canvas.addEventListener('mousemove',moveTile)
    canvas.addEventListener('mousedown',moveTile)
  }
  function deleteTiles(){
    doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllListenersAdded()
    removeAllButtons()
    spawnButton(doc,"buttonPlace",'End',["btn","btn-dark"],'End deleting!',saveInsertingTiles) 
   
    canvas.addEventListener('click',deleteHandler)
  }
  
  function removeAllButtons(){
    elementDeleter('buttonPlace')
    elementDeleter('numOfPlayersPlace')
    elementDeleter('gameTypePlace')
    elementDeleter('gameNamePlace')
    elementDeleter('tileEditingPlace');

  }
  function removeAllListenersAdded(){
    canvas.removeEventListener('mousemove',moveTile)
    canvas.removeEventListener('mousedown',moveTile)
    canvas.removeEventListener('mousedown', insert)
    canvas.removeEventListener('click',moveEventHandler)
    canvas.removeEventListener('click',deleteHandler)
    canvas.removeEventListener('click',insertPawn)
    canvas.removeEventListener('click',deletePawn)
    canvas.removeEventListener('click',copyTile)
    endDrawingPath()

    document.getElementById('wholeBody')!.style.cursor = 'default'
    canvas.style.cursor = 'default'
    document.getElementById('optionPlace')!.style.cursor = 'default'
    reload(editor,ctx)
  }

  function undoTileInsert(){
      editor.removeLastFromUndoLog()
      reload(editor,ctx)
  }

  let  insert = function(event:MouseEvent){
  
    let coords = calibreEventCoords(event)
    let canSpawn = true
    if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
      if (!editor.tileWithNumberExists(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))){
        canSpawn = false
        Warning.show("Following tile with that number doesn't exist")
      }
    }
    if (canSpawn){
      var addedTile = spawnTile(coords)
      editor.addToUndoLog([addedTile])
      addedTile.getIsStartingFor().forEach((player:string)=>{
        editor.getGame().insertPawns(player,addedTile)
      })
      showActualState()
    }
    console.log(editor.getGame())
    
  }

  let spawnTile = function(coords:{x:number,y:number}){
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
    let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
    let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
    let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
    let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
    let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
    let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
    
    var insertImage = editor.getImage()
    var pattImage = editor.getPattern()
    if (!backgroundChecker.checked){
      insertImage = undefined!
    }
    if (!patternChecker.checked){
      pattImage = undefined!
    }

    var addedTile:Tile;
    if (outlineChecker!.checked){
      addedTile = editor.initTile(true,coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage,pattImage)
    }
    else{
      addedTile = editor.initTile(true,coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),0,'',shapeMenu!.value,insertImage,pattImage)
    }
    addedTile.setIsStartingFor(editor.getStartForPlayers())
    addedTile.setIsEndingFor(editor.getEndForPlayers())
    addedTile.setCanOccupy(editor.getEnabledForPlayers())
    addedTile.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    addedTile.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    
    addedTile.setCantBeEliminatedOnTile(editor.getCantBeEliminatedOnTile())

    if ((<HTMLInputElement>document.getElementById('eventChecker')).checked){
      addedTile.setSkip(editor.getSkip())
      addedTile.setRepeat(editor.getRepeat())
      addedTile.setForward(editor.getForward())
      addedTile.setBackward(editor.getBackward())
      addedTile.setMustThrown(editor.getMustThrown())
      addedTile.setTurnsToSetFree(editor.getTurnsToSetFree())
    }
    else{
      addedTile.setSkip(0)
    addedTile.setRepeat(0)
    addedTile.setForward(0)
    addedTile.setBackward(0)
    addedTile.setMustThrown(0)
    addedTile.setTurnsToSetFree(0)
    }
   
    
    if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0){
      
      addedTile.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
      
      let tileWithSameNumber = editor.getGame().getTiles()
      .filter((t:Tile) => {return t!= addedTile && t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
      if (tileWithSameNumber.length > 0){

        tileWithSameNumber[0].setTileNumber(editor.nextTileNumber())
      }
       
    }
    if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
      addedTile.setFollowingTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))    
    }
    
    if ((<HTMLInputElement>document.getElementById('askQuestionChecker')).checked){
      addedTile.setQuestionId(editor.getQuestionId())
    }
    else{
      addedTile.setQuestionId(-1)
    }
    reload(editor,ctx)
    console.log(addedTile)
    console.log(editor)
    return addedTile    
  }
  let update = function(){
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
      let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
      let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
      let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
      let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
      let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
      let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
      let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
      let insertImage = editor.getImage()
      let pattImage = editor.getPattern()
      if (!backgroundChecker.checked){
        insertImage = undefined!
      }
      if (!patternChecker.checked){
        pattImage = undefined!
      }
     
    editor.updateChoosenTile(colorPicker!.value,parseInt(sizeOfTileSlider!.value),outlineChecker!.checked,parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage)
    

    editor.getChoosenTile()?.setPawns([])

    editor.getChoosenTile()?.getIsStartingFor().forEach((player:string)=>{
         for (let i = 0;i<editor.getGame().getNumberOfStartingPawns();i++){
        editor.getGame().getPawns().push(new Pawn(player,editor.getChoosenTile()!))
      }
    })
    // let set:Set<string> = new Set()
    
    // editor.getGame().getPawns().forEach((pawn:Pawn)=>{
    //   set.add(pawn.player)
    // })
    // editor.getChoosenTile()?.getIsStartingFor().forEach((player:string)=>{
    //   set.delete(player)
    // })

    // set.forEach((player:string)=>{
    //   for (let i = 0;i<editor.getGame().getNumberOfStartingPawns();i++){
    //     editor.getGame().getPawns().push(new Pawn(player,editor.getChoosenTile()!))
    //   }
    // })
    // editor.getStartForPlayers().forEach((player:string)=>{
    //   if( !editor.getChoosenTile()!.getIsStartingFor().includes(player)){
    //     for (let i = 0;i<editor.getGame().getNumberOfStartingPawns();i++){
    //       editor.getGame().getPawns().push(new Pawn(player,editor.getChoosenTile()!))
    //     }
    //   }
    //   else{
    //     console.log(player + ' sa nachadza v ')
    //     console.log(editor.getChoosenTile()!.getIsStartingFor())
    //     console.log(editor.getStartForPlayers())
    //   }
     
      
    // })
    
    editor.getChoosenTile()!.setIsStartingFor(editor.getStartForPlayers())
    editor.getChoosenTile()!.setIsEndingFor(editor.getEndForPlayers())
    editor.getChoosenTile()!.setCanOccupy(editor.getEnabledForPlayers())
    editor.getChoosenTile()!.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    editor.getChoosenTile()!.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    editor.getChoosenTile()!.setPatternFile(pattImage)
   
    editor.getChoosenTile()!.setCantBeEliminatedOnTile(editor.getCantBeEliminatedOnTile())
  
    if ((<HTMLInputElement>document.getElementById('eventChecker')).checked){
     
    editor.getChoosenTile()!.setSkip(editor.getSkip())
    editor.getChoosenTile()!.setRepeat(editor.getRepeat())
    editor.getChoosenTile()!.setForward(editor.getForward())
    editor.getChoosenTile()!.setBackward(editor.getBackward())
    editor.getChoosenTile()!.setMustThrown(editor.getMustThrown())
    editor.getChoosenTile()!.setTurnsToSetFree(editor.getTurnsToSetFree())
    }
    else{
      editor.getChoosenTile()!.setSkip(0)
      editor.getChoosenTile()!.setRepeat(0)
      editor.getChoosenTile()!.setForward(0)
      editor.getChoosenTile()!.setBackward(0)
      editor.getChoosenTile()!.setMustThrown(0)
      editor.getChoosenTile()!.setTurnsToSetFree(0)
    }
    if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0  && editor.getChoosenTile()?.getTileNumber()!= parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)){
      editor.getChoosenTile()!.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
    
      let tileWithSameNumber = editor.getGame().getTiles()
      .filter((t:Tile) => {return t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
      if (tileWithSameNumber.length > 0){
        tileWithSameNumber[0].setTileNumber(editor.nextTileNumber())
      }
       
    }
    editor.getChoosenTile()!.getPawns().forEach((pawn:Pawn)=>{
      if (!editor.getChoosenTile()!.getIsStartingFor().includes(pawn.player)){
        editor.getChoosenTile()?.removePawn(pawn)
        editor.getGame().removePawn(pawn)
      }})

      if ((<HTMLInputElement>document.getElementById('askQuestionChecker')).checked){
        editor.getChoosenTile()?.setQuestionId(editor.getQuestionId())
      }
      else{
        editor.getChoosenTile()?.setQuestionId(-1)
      }
    
    reload(editor,ctx)
  }
  let setValues = function(tile:Tile,copyNumber:boolean){
    if (tile == undefined){
      tile = editor.getChoosenTile()!
    
    }
    else{}
     
  
    if (tile!=undefined){
     
      let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
      let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
      let numberingColor:HTMLInputElement = <HTMLInputElement>doc.getElementById('numberingColorPicker')!
      let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
      let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
      let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
      let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
      let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
      let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
      let toogleNumberingChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('toogleNumberingChecker')!
      
      let tileNumberSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileNumberSetter')!
      let tileFollowingSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileFollowingSetter')!
      //let choosenTile = editor.getChoosenTile()
      

      colorPicker.value = tile!.getColor()
    
      numberingColor.value = tile!.getNumberingColor()
      sizeOfTileSlider.value = tile!.getRadius().toString()
      sizeOfOutlineSlider.value = tile!.getStroke().toString()
      outlineColorPicker.value = tile!.getStrokeColor()
      outlineChecker.checked = tile!.getStroke()>0
      if (copyNumber){
        tileNumberSetter.value = tile!.getTileNumber().toString()
        tileFollowingSetter.value = tile!.getFollowingTileNumber().toString()
      }
      else{
        console.log('nastavil spravne')
        tileNumberSetter.value = ''
        tileFollowingSetter.value = ''
      }
      
      

      if (tile.getQuestionId()!=-1){
        (<HTMLInputElement>document.getElementById('askQuestionChecker')).checked = true;
        (doc.getElementById("askQuestionCheckerShower"))!.textContent = 'yes'
        
        document.getElementById('bindQuestion')!.textContent = 'Choosen Question Id: '+tile.getQuestionId()
       

      }
      if (tile.getSkip()!=0){
        (<HTMLInputElement>document.getElementById('eventChecker')).checked = true;
        (doc.getElementById('eventCheckerShower'))!.textContent = 'yes'
        document.getElementById('bindEvent')!.textContent ='Skip: ' + tile.getSkip() +' times.'
        
      }
      if (tile.getRepeat()!=0){
        (<HTMLInputElement>document.getElementById('eventChecker')).checked = true;
        (doc.getElementById('eventCheckerShower'))!.textContent = 'yes';
        document.getElementById('bindEvent')!.textContent ='Repeat turn: ' + tile.getRepeat() +' times.'
        
      }
      if (tile.getForward()!=0){
        (<HTMLInputElement>document.getElementById('eventChecker')).checked = true;
        (doc.getElementById('eventCheckerShower'))!.textContent = 'yes';
        document.getElementById('bindEvent')!.textContent ='Go forward: ' + tile.getForward() +' times.'
      }
      if (tile.getBackward()!=0){
        (<HTMLInputElement>document.getElementById('eventChecker')).checked = true;
        (doc.getElementById('eventCheckerShower'))!.textContent = 'yes';
        document.getElementById('bindEvent')!.textContent ='Go backward: ' + tile.getBackward() +' times.'
      }
      if (tile.getMustThrown()!=0){
        (<HTMLInputElement>document.getElementById('eventChecker')).checked = true;
        (doc.getElementById('eventCheckerShower'))!.textContent = 'yes';
        document.getElementById('bindEvent')!.textContent ='Thrown: ' + tile.getMustThrown() +' . Or wait ' +tile.getTurnsToSetFree()+ ' turns';
      }

      if (outlineChecker.checked){
        doc.getElementById("outlineCheckerShower")!.textContent = 'yes'
      }
      else{
        doc.getElementById("outlineCheckerShower")!.textContent = 'no'
      }

      shapeMenu.value = tile!.getShape()
      
      backgroundChecker.checked = (tile.getBackgroundFile() != undefined)

      if (backgroundChecker.checked){
        doc.getElementById("backgroundCheckerShower")!.textContent = 'yes'
        
      }
      else{
        doc.getElementById("backgroundCheckerShower")!.textContent = 'no'
      }

      patternChecker.checked = (tile.getPatternFile() != undefined)
      //console.log(doc.getElementById("patternCheckerShower")!)
      if (patternChecker.checked){
        doc.getElementById("patternCheckerShower")!.textContent = 'yes'
        
      }
      else{
        doc.getElementById("patternCheckerShower")!.textContent = 'no'
      }
      toogleNumberingChecker.checked = tile.getToggleNumber()!
      if (toogleNumberingChecker.checked){
        doc.getElementById("toogleNumberingCheckerShower")!.textContent = 'yes'
        
      }
      else{
        doc.getElementById("toogleNumberingCheckerShower")!.textContent = 'no'
      }
    }

    //startingFor = doc.getElementById('')
    return tile
  }

  let moveTile = function(event:MouseEvent){
      editor.moveTile(event)
      reload(editor,ctx)
  }

  function showActualState(){
    
    let cs = <HTMLCanvasElement>document.getElementById('changeCanvas')!
    let cttttx = <CanvasRenderingContext2D> cs.getContext("2d");
    reload(editor,cttttx)
    let width = cs.width
    let height = cs.height
    let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
    let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
    let numberingColor:HTMLInputElement = <HTMLInputElement>doc.getElementById('numberingColorPicker')!
    let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
    let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
    let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
    let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
    let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
    let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
    let toogleNumberingChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('toogleNumberingChecker')!
    
    let tileNumberSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileNumberSetter')!
    let tileFollowingSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileFollowingSetter')!

    let stroke = 0
    if (outlineChecker.checked){
      stroke = parseInt(sizeOfOutlineSlider!.value)
    }
    let tile = editor.initTile(false,{x:width/2,y:height/2},colorPicker!.value,parseInt(sizeOfTileSlider!.value),stroke,outlineColorPicker!.value,shapeMenu!.value,undefined,undefined)
    tile.setNumberingColor(numberingColor.value)
    if (tileNumberSetter.value != ""){
      tile.setTileNumber(parseInt(tileNumberSetter.value))
    }
    if (backgroundChecker.checked){
      tile.setBackgroundFile(editor.getImage())
    }
    if (patternChecker.checked){
      tile.setPatternFile(editor.getPattern())
    }
   
    //tile = setValues(tile)
   
   
  
    cttttx.clearRect(0,0,cs.width,cs.height)
    tile.drawTile(cs,<CanvasRenderingContext2D>(<HTMLCanvasElement>document.getElementById('changeCanvas')!).getContext("2d"),true)
    
    reload(editor,ctx)
   
    
  }
 

  
  export{insertTilesMenu,moveEventHandler,pickTile,editTiles,deleteTiles,moveTiles,removeAllButtons,showActualState,removeAllListenersAdded,spawnElements,spawnTile,undoTileInsert,saveInsertingTiles}


  