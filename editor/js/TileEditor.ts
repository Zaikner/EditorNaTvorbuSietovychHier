
import {mainMenu,doc,elementDeleter,canvas,ctx, calibreEventCoords,editor,reload} from './canvas.js'
import { editTrack, endDrawingPath } from './PathEditor.js'

import {spawnColorPicker,spawnParagraph,spawnCheckerWithValueShower,spawnSliderWithValueShower,spawnButton,spawnSelectMenu, spawnImageInput, spawnMultiSelect, spawnNumberInput}from './Elements.js'
import { Tile } from './Tile.js'
import {Warning} from './Warning.js'

let moveEventHandler = function(event:MouseEvent) {editor.findTile(event)   
reload()
}
let deleteHandler = function(event:MouseEvent){
  editor.deleteTile(event)
  reload()}


function spawnElements(){
    //$('#exampleModal').modal('toggle')
    editor.getGame().saveGame()
    spawnParagraph(doc,"tileEditingPlace",'','Choose color of tile:')
    spawnColorPicker(doc,"tileEditingPlace",'colorPicker')

    spawnParagraph(doc,"tileEditingPlace",'','Tile size:')
    spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfTileSlider','20','50','1','30')
   
    spawnParagraph(doc,"tileEditingPlace",'','Tile have outline? (checkbox)')
    spawnCheckerWithValueShower(doc,"tileEditingPlace",'outlineChecker',false,['no','yes'])
   
    spawnParagraph(doc,"tileEditingPlace",'','Choose color of outline:')
    spawnColorPicker(doc,"tileEditingPlace",'outlineColorPicker')

    spawnParagraph(doc,"tileEditingPlace",'','Outline size:')
    spawnSliderWithValueShower(doc,"tileEditingPlace",'sizeOfOutlineSlider','1','10','1','3')
    
    spawnParagraph(doc,"tileEditingPlace",'','Choose shape:')
    spawnSelectMenu(doc,"tileEditingPlace",'shapeMenu',["btn","btn-dark"],['circle','square'])
    
    spawnParagraph(doc,"tileEditingPlace",'','Tile have pattern from images? (checkbox)')
    spawnCheckerWithValueShower(doc,"tileEditingPlace",'patternChecker',false,['no','yes'])


  spawnImageInput(doc,"tileEditingPlace",'tilePattern','Choose a Pattern!',function(){
  
    if ((<HTMLInputElement>doc.getElementById('tilePattern')!).files!.length > 0){
      editor.setPattern(new Image())
        editor.getPattern()!.src =URL.createObjectURL((<HTMLInputElement>doc.getElementById('tilePattern')!).files![0]!)    
      }
    else{
      editor.setPattern(undefined!)
    }
  })
  
  spawnParagraph(doc,"tileEditingPlace",'','Choose background image:')

    spawnParagraph(doc,"tileEditingPlace",'','Tile have background image? (checkbox)')
    spawnCheckerWithValueShower(doc,"tileEditingPlace",'backgroundChecker',false,['no','yes'])
  
    spawnImageInput(doc,"tileEditingPlace",'tileImage','Choose an Image!',function(){
  
      if ((<HTMLInputElement>doc.getElementById('tileImage')!).files!.length > 0){
        editor.setImage(new Image())
          editor.getImage()!.src =URL.createObjectURL((<HTMLInputElement>doc.getElementById('tileImage')!).files![0]!)

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
    spawnColorPicker(doc,"tileEditingPlace",'numberingColorPicker')

    spawnParagraph(doc,"tileEditingPlace",'','Choose tile number! (Insert a number into textfield)')
    spawnNumberInput(doc,"tileEditingPlace",'tileNumberSetter')

    spawnParagraph(doc,"tileEditingPlace",'','Which number follows ?! (Insert a number into textfield)')
    spawnNumberInput(doc,"tileEditingPlace",'tileFollowingSetter')
}

function insertTilesMenu():void{
  doc.getElementById("canvasPlace")!.style.cursor = 'default'
  removeAllListenersAdded()
  editor.makeAllTilesNotChoosen()
  reload()
  removeAllButtons()  
  canvas.addEventListener('click',moveEventHandler)
    spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],'Save!',saveInsertingTiles)
    spawnButton(doc,"buttonPlace",'drawPath',["btn","btn-dark"],'Draw Path!!',editTrack)
    spawnButton(doc,"buttonPlace",'startInsertingButton',["btn","btn-dark"],'Insert by one!',startInsertingByOne)
}
  function startInsertingByOne(){
    doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllButtons()
    removeAllListenersAdded()
    
    canvas.addEventListener('mousedown', insert);
   
    spawnButton(doc,"buttonPlace",'endInsertingButton',["btn","btn-dark"],'Stop inserting!',insertTilesMenu)   
    spawnElements()

    spawnButton(doc,"buttonPlace",'undoButton',["btn","btn-dark"],'Undo last Tile!',undoTileInsert)
  }

  function saveInsertingTiles(){
    removeAllButtons()
    removeAllListenersAdded()
    editor.makeAllTilesNotChoosen()
    reload()
    mainMenu();
  }

  function editTiles():void{
    removeAllListenersAdded()
    canvas.addEventListener('click',moveEventHandler)
    removeAllButtons()
    editor.setIsMoving(false)
    spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],'Save!',saveEditingTiles)
    spawnButton(doc,"buttonPlace",'Update',["btn","btn-dark"],'Edit button!',update)   
      spawnElements()
      setValues()      
    }
  
    function saveEditingTiles(){
      removeAllButtons()
      removeAllListenersAdded()
      editor.makeAllTilesNotChoosen()
      reload()
      mainMenu();
    }
  
  function moveTiles(){
    //canvas.removeEventListener('click',moveEventHandler)
    endDrawingPath()
    doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    editor.makeAllTilesNotChoosen()
    reload()
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
    endDrawingPath()
  }

  function undoTileInsert(){
      editor.removeLastFromUndoLog()
      reload()
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
    }
    
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

    var addedTile = null;
    if (outlineChecker!.checked){
      addedTile = editor.initTile(coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage,pattImage)
    }
    else{
      addedTile = editor.initTile(coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),0,'',shapeMenu!.value,insertImage,pattImage)
    }
    addedTile.setIsStartingFor(editor.getStartForPlayers())
    addedTile.setIsEndingFor(editor.getEndForPlayers())
    addedTile.setCanOccupy(editor.getEnabledForPlayers())
    addedTile.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    addedTile.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    
    if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0){
      addedTile.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
    
      let tileWithSameNumber = editor.getGame().getTiles()
      .filter((t:Tile) => {return t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
      if (tileWithSameNumber.length > 0){
        tileWithSameNumber[0].setTileNumber(editor.nextTileNumber())
      }
       
    }
    if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
      addedTile.setFollowingTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))    
    }
    reload()
    console.log(addedTile)
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
    editor.getChoosenTile()!.setIsStartingFor(editor.getStartForPlayers())
    editor.getChoosenTile()!.setIsEndingFor(editor.getEndForPlayers())
    editor.getChoosenTile()!.setCanOccupy(editor.getEnabledForPlayers())
    editor.getChoosenTile()!.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    editor.getChoosenTile()!.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    editor.getChoosenTile()!.setPatternFile(pattImage)

    if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0){
      editor.getChoosenTile()!.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
    
      let tileWithSameNumber = editor.getGame().getTiles()
      .filter((t:Tile) => {return t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
      if (tileWithSameNumber.length > 0){
        tileWithSameNumber[0].setTileNumber(editor.nextTileNumber())
      }
       
    }
    reload()
  }
  let setValues = function(){
    if (editor.getChoosenTile()!=undefined){
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
      let choosenTile = editor.getChoosenTile()
      
      colorPicker.value = choosenTile!.getColor()
      numberingColor.value = choosenTile!.getNumberingColor()
      sizeOfTileSlider.value = choosenTile!.getRadius().toString()
      sizeOfOutlineSlider.value = choosenTile!.getStroke().toString()
      outlineColorPicker.value = choosenTile!.getStrokeColor()
      outlineChecker.checked = choosenTile!.getStroke()>0
      tileNumberSetter.value = choosenTile!.getTileNumber().toString()
      tileFollowingSetter.value = choosenTile!.getFollowingTileNumber().toString()
      
      if (outlineChecker.checked){
        doc.getElementById("outlineCheckerShower")!.textContent = 'yes'
      }
      else{
        doc.getElementById("outlineCheckerShower")!.textContent = 'no'
      }

      shapeMenu.value = choosenTile!.getShape()
      
      backgroundChecker.checked = (editor.getChoosenTile()?.getBackgroundFile() != undefined)

      if (backgroundChecker.checked){
        doc.getElementById("backgroundCheckerShower")!.textContent = 'yes'
        
      }
      else{
        doc.getElementById("backgroundCheckerShower")!.textContent = 'no'
      }

      patternChecker.checked = (editor.getChoosenTile()?.getPatternFile() != undefined)
      //console.log(doc.getElementById("patternCheckerShower")!)
      if (patternChecker.checked){
        doc.getElementById("patternCheckerShower")!.textContent = 'yes'
        
      }
      else{
        doc.getElementById("patternCheckerShower")!.textContent = 'no'
      }
      toogleNumberingChecker.checked = editor.getChoosenTile()?.getToggleNumber()!
      if (toogleNumberingChecker.checked){
        doc.getElementById("toogleNumberingCheckerShower")!.textContent = 'yes'
        
      }
      else{
        doc.getElementById("toogleNumberingCheckerShower")!.textContent = 'no'
      }
    }
  }

  let moveTile = function(event:MouseEvent){
      editor.moveTile(event)
      reload()
  }
  
  export{insertTilesMenu,editTiles,deleteTiles,moveTiles,removeAllButtons,removeAllListenersAdded,spawnElements,spawnTile,undoTileInsert}
  