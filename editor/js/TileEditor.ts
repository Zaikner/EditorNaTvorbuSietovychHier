import { removeAllListeners } from 'process'
import {mainMenu,doc,elementDeleter,canvas,ctx, calibreEventCoords,editor,reload} from './canvas.js'
import { editTrack, endDrawingPath } from './PathEditor.js'
import {Tile} from './Tile.js'

var isMoving = false
var image:HTMLImageElement = undefined!;
var pattern:HTMLImageElement = undefined!;

let moveEventHandler = function(event:MouseEvent) {editor.findTile(event)   
reload()
}
let deleteHandler = function(event:MouseEvent){
  editor.deleteTile(event)
  reload()}


function spawnElements(){
    
    let colorPicker:HTMLInputElement = doc.createElement('input')
    colorPicker.type = 'color'
    colorPicker.id = 'colorPicker';
    
    let text = doc.createElement('p')
    text.textContent = 'Choose color of tile:'
    doc.getElementById("tileEditingPlace")!.appendChild(text);

    doc.getElementById("tileEditingPlace")!.appendChild( colorPicker);

    let sizeOfTileSlider:HTMLInputElement = doc.createElement('input')
    sizeOfTileSlider.type = 'range'
    sizeOfTileSlider.id = 'sizeOfTileSlider';
    sizeOfTileSlider.value = '30'
    sizeOfTileSlider.min = '20';
    sizeOfTileSlider.max = '50';
    sizeOfTileSlider.step = '1';

    let tileSizeShower = doc.createElement('paragraph');
    tileSizeShower.id = 'tileSizeShower'
    tileSizeShower.textContent = '30'

    sizeOfTileSlider.oninput =function(){
      doc.getElementById("tileSizeShower")!.textContent = sizeOfTileSlider.value;
    }
    text = doc.createElement('p')
    text.textContent = 'Tile size:'
    doc.getElementById("tileEditingPlace")!.appendChild(text);
    

    doc.getElementById("tileEditingPlace")!.appendChild( sizeOfTileSlider);
    doc.getElementById("tileEditingPlace")!.appendChild( tileSizeShower);

    let outlineChecker:HTMLInputElement = doc.createElement('input')
    outlineChecker.type = 'checkbox'
    outlineChecker.id = 'outlineChecker';

    text = doc.createElement('p')
    text.textContent = 'Tile have outline? (checkbox)'

    let hasOutlineShower = doc.createElement('paragraph');
    hasOutlineShower.id = 'hasOutlineShower'
    hasOutlineShower.textContent = 'no'

    outlineChecker.oninput =function(){
      if (outlineChecker.checked){
        doc.getElementById("hasOutlineShower")!.textContent = 'yes'
      }
      else{
        doc.getElementById("hasOutlineShower")!.textContent = 'no'
      }

    }
    doc.getElementById("tileEditingPlace")!.appendChild(text);

    doc.getElementById("tileEditingPlace")!.appendChild(outlineChecker);
    doc.getElementById("tileEditingPlace")!.appendChild(hasOutlineShower);

    let outlineColorPicker:HTMLInputElement = doc.createElement('input')
    outlineColorPicker.type = 'color'
    outlineColorPicker.id = 'outlineColorPicker';
    
    text = doc.createElement('p')
    text.textContent = 'Choose color of outline:'
    doc.getElementById("tileEditingPlace")!.appendChild(text);

    doc.getElementById("tileEditingPlace")!.appendChild( outlineColorPicker);

    let sizeOfOutlineSlider:HTMLInputElement = doc.createElement('input')
    sizeOfOutlineSlider.type = 'range'
    sizeOfOutlineSlider.id = 'sizeOfOutlineSlider';
    sizeOfOutlineSlider.value = '3'
    sizeOfOutlineSlider.min = '1';
    sizeOfOutlineSlider.max = '10';
    sizeOfOutlineSlider.step = '1';

    let tileOutlineSizeShower = doc.createElement('paragraph');
    tileOutlineSizeShower.id = 'tileOutlineSizeShower'
    tileOutlineSizeShower.textContent = '3'

    sizeOfOutlineSlider.oninput =function(){
      doc.getElementById("tileOutlineSizeShower")!.textContent = sizeOfOutlineSlider.value;
    }
    text = doc.createElement('p')
    text.textContent = 'Outline size:'
    doc.getElementById("tileEditingPlace")!.appendChild(text);
    

    doc.getElementById("tileEditingPlace")!.appendChild( sizeOfOutlineSlider);
    doc.getElementById("tileEditingPlace")!.appendChild( tileOutlineSizeShower);

    text = doc.createElement('p')
    text.textContent = 'Choose Shape:'
    doc.getElementById("tileEditingPlace")!.appendChild(text);

    let shapeMenu:HTMLSelectElement = doc.createElement('select')
    shapeMenu.id = 'shapeMenu';
    shapeMenu.classList.add("btn")
    shapeMenu.classList.add("btn-dark")
    let types = ['circle','square'];
    for (let i = 0; i < types.length; i++) {
      let option = doc.createElement("option");
      option.value = types[i];
      option.text = types[i];
      shapeMenu.appendChild(option);
  }
  doc.getElementById("tileEditingPlace")!.appendChild(text);
  doc.getElementById("tileEditingPlace")!.appendChild(shapeMenu);

  text = doc.createElement('p')
  text.textContent = 'Choose pattern image:'
  doc.getElementById("tileEditingPlace")!.appendChild(text);

  let patternChecker:HTMLInputElement = doc.createElement('input')
    patternChecker.type = 'checkbox'
    patternChecker.id = 'patternChecker';

    text = doc.createElement('p')
    text.textContent = 'Tile have pattern from images? (checkbox)'

    let hasPatternImageShower = doc.createElement('paragraph');
    hasPatternImageShower.id = 'hasPatternImageShower'
    hasPatternImageShower.textContent = 'no'

    patternChecker.oninput =function(){
      if (patternChecker.checked){
        doc.getElementById("hasPatternImageShower")!.textContent = 'yes'
      }
      else{
        doc.getElementById("hasPatternImageShower")!.textContent = 'no'
      }

    }
    doc.getElementById("tileEditingPlace")!.appendChild(text);

    doc.getElementById("tileEditingPlace")!.appendChild(patternChecker);
    doc.getElementById("tileEditingPlace")!.appendChild(hasPatternImageShower);

  let patternImage:HTMLInputElement = doc.createElement('input')
  patternImage.id = 'tileImage'
  patternImage.type = 'file'
  patternImage.accept = ".jpg, .jpeg, .png"
  patternImage.textContent = 'Choose an Image!'
  patternImage.oninput = function(){
    
    if (patternImage.files!.length > 0){
      pattern = new Image()
        pattern!.src =URL.createObjectURL(patternImage!.files![0]!)
      
    }
    else{
      pattern = undefined!
    }
  }
  doc.getElementById("tileEditingPlace")!.appendChild(patternImage);

  
  text = doc.createElement('p')
  text.textContent = 'Choose background image:'
  doc.getElementById("tileEditingPlace")!.appendChild(text);

  let backgroundChecker:HTMLInputElement = doc.createElement('input')
    backgroundChecker.type = 'checkbox'
    backgroundChecker.id = 'backgroundChecker';

    text = doc.createElement('p')
    text.textContent = 'Tile have background image? (checkbox)'

    let hasBackgroundImageShower = doc.createElement('paragraph');
    hasBackgroundImageShower.id = 'hasBackgroundImageShower'
    hasBackgroundImageShower.textContent = 'no'

    backgroundChecker.oninput =function(){
      if (backgroundChecker.checked){
        doc.getElementById("hasBackgroundImageShower")!.textContent = 'yes'
      }
      else{
        doc.getElementById("hasBackgroundImageShower")!.textContent = 'no'
      }

    }
    doc.getElementById("tileEditingPlace")!.appendChild(text);

    doc.getElementById("tileEditingPlace")!.appendChild(backgroundChecker);
    doc.getElementById("tileEditingPlace")!.appendChild(hasBackgroundImageShower);

  let tileImage:HTMLInputElement = doc.createElement('input')
  tileImage.id = 'tileImage'
  tileImage.type = 'file'
  tileImage.accept = ".jpg, .jpeg, .png"
  tileImage.textContent = 'Choose an Image!'
  tileImage.oninput = function(){
    
    if (tileImage.files!.length > 0){
      image = new Image()
        image!.src =URL.createObjectURL(tileImage!.files![0]!)
      
    }
    else{
      image = undefined!
    }
  }
  doc.getElementById("tileEditingPlace")!.appendChild(tileImage);

  let startMenu:HTMLSelectElement = doc.createElement('select')
    startMenu.id = 'startMenu';
    startMenu.classList.add("btn")
    startMenu.classList.add("btn-dark")
    types = ['No one','Everyone'];
    for (let i = 0; i < types.length; i++) {
      let option = doc.createElement("option");
      option.value = types[i];
      option.text = types[i];
      startMenu.appendChild(option);
  }
  text = doc.createElement('p')
  text.textContent = 'For who is this starting tile? (choose players)'

  doc.getElementById("tileEditingPlace")!.appendChild(text);
  doc.getElementById("tileEditingPlace")!.appendChild(startMenu);

  let finishMenu:HTMLSelectElement = doc.createElement('select')
  finishMenu.id = 'finishMenu';
  finishMenu.classList.add("btn")
  finishMenu.classList.add("btn-dark")
  types = ['No one','Everyone'];
  for (let i = 0; i < types.length; i++) {
    let option = doc.createElement("option");
    option.value = types[i];
    option.text = types[i];
    finishMenu.appendChild(option);
}
text = doc.createElement('p')
text.textContent = 'For who is this finishing tile? (choose players)'

doc.getElementById("tileEditingPlace")!.appendChild(text);
doc.getElementById("tileEditingPlace")!.appendChild(finishMenu);

let standMenu:HTMLSelectElement = doc.createElement('select')
standMenu.id = 'standMenu';
standMenu.classList.add("btn")
standMenu.classList.add("btn-dark")
types = ['No one','Everyone'];
for (let i = 0; i < types.length; i++) {
  let option = doc.createElement("option");
  option.value = types[i];
  option.text = types[i];
  standMenu.appendChild(option);
}
text = doc.createElement('p')
text.textContent = 'Who can stand atop of this tile? (choose players)'

doc.getElementById("tileEditingPlace")!.appendChild(text);
doc.getElementById("tileEditingPlace")!.appendChild(standMenu);
}

function insertTilesMenu():void{
  removeAllListenersAdded()
  editor.makeAllTilesNotChoosen()
  reload()
  removeAllButtons()
  let i = 0
  
  canvas.addEventListener('click',moveEventHandler)
  
    let saveButton:HTMLButtonElement = doc.createElement('button');
    //let addToStartButton:HTMLButtonElement = doc.createElement('button');
    //let addDistributedButton:HTMLButtonElement = doc.createElement('button');

    saveButton.id = 'Save'
    saveButton.textContent = 'Save!'
    saveButton.classList.add("btn")
    saveButton.classList.add("btn-dark")
  
    doc.getElementById("buttonPlace")!.appendChild(saveButton);
    doc.getElementById("Save")!.addEventListener('click',function(){saveInsertingTiles()});
  
    let drawPathButton:HTMLButtonElement = doc.createElement('button');
    drawPathButton.id = 'drawPath';
    drawPathButton.textContent = 'Draw Path!!';
    drawPathButton.classList.add("btn")
    drawPathButton.classList.add("btn-dark")
    
    doc.getElementById("buttonPlace")!.appendChild(drawPathButton);
    doc.getElementById('drawPath')!.addEventListener('click', function(){
      editTrack();
    
    });

    let insertOneTileButton:HTMLButtonElement = doc.createElement('button');
    insertOneTileButton.id = 'startInsertingButton';
    insertOneTileButton.textContent = 'Insert by one!';
    insertOneTileButton.classList.add("btn")
    insertOneTileButton.classList.add("btn-dark")
    
    doc.getElementById("buttonPlace")!.appendChild(insertOneTileButton);
    doc.getElementById('startInsertingButton')!.addEventListener('click', function(){
      startInsertingByOne(doc)
    
    }); 

  }
  function startInsertingByOne(doc:HTMLDocument){
    doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllButtons()
    removeAllListenersAdded()
    
    canvas.addEventListener('mousedown', insert);
   
   
    let endInsertingButton:HTMLButtonElement = doc.createElement('button');
    endInsertingButton.id = 'endInsertingButton';
    endInsertingButton.textContent = 'Stop inserting!';
    endInsertingButton.classList.add("btn")
    endInsertingButton.classList.add("btn-dark")
 
    doc.getElementById("buttonPlace")!.appendChild( endInsertingButton);
    doc.getElementById('endInsertingButton')!.addEventListener('click', function(){
      insertTilesMenu()
      
      canvas.removeEventListener('mousedown', insert)

      doc.getElementById("canvasPlace")!.style.cursor = 'default'
    }); 
   
    spawnElements()
    let undoOneTileButton:HTMLButtonElement = doc.createElement('button');
    undoOneTileButton.id ='undoButton';
    undoOneTileButton.textContent = 'Undo last Tile!';
    undoOneTileButton.classList.add("btn")
    undoOneTileButton.classList.add("btn-dark")
    
    doc.getElementById("buttonPlace")!.appendChild(undoOneTileButton);
    doc.getElementById('undoButton')!.addEventListener('click', function(){
      undoTileInsert()
  
    }); 
  
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
    
    isMoving = false
    
      let saveButton:HTMLButtonElement = doc.createElement('button');
     
      saveButton.id = 'Save'
      saveButton.textContent = 'Save!'
      saveButton.classList.add("btn")
      saveButton.classList.add("btn-dark")
      doc.getElementById("buttonPlace")!.appendChild(saveButton);
      doc.getElementById("Save")!.addEventListener('click',function(){saveEditingTiles()});

      let updateButton:HTMLButtonElement = doc.createElement('button');
     
      updateButton.id = 'Update'
      updateButton.textContent = 'Edit button!'
      updateButton.classList.add("btn")
      updateButton.classList.add("btn-dark")
      doc.getElementById("buttonPlace")!.appendChild(updateButton);
      doc.getElementById("Update")!.addEventListener('click',update);
      
      spawnElements()
      setValues()

    
    
      //canvas.addEventListener('mousemove',moveTile)
      //canvas.addEventListener('mousedown',moveTile)
      
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
    isMoving = true
    removeAllButtons()
    canvas.addEventListener('click',moveEventHandler)
    canvas.addEventListener('mousemove',moveTile)
    canvas.addEventListener('mousedown',moveTile)
  }
  function deleteTiles(){
    doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllListenersAdded()
    removeAllButtons()

    let endButton:HTMLButtonElement = document.createElement('button');
  
    endButton.id = 'End'
    endButton.textContent = 'End deleting!'
    endButton.classList.add("btn")
    endButton.classList.add("btn-dark")

    document.getElementById('buttonPlace')!.appendChild(endButton)
    endButton.addEventListener('click',saveInsertingTiles)
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
    var addedTile = spawnTile(coords)
    editor.addToUndoLog([addedTile])
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
    
    var insertImage = image
    var pattImage = pattern
    if (!backgroundChecker.checked){
      insertImage = undefined!
    }
    if (!patternChecker.checked){
      pattImage = undefined!
    }
    
     // var image = new Image()
        // let tileImage:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileImage')!
        // image.src =URL.createObjectURL(tileImage!.files![0]!)
        // newTile.backgroundFile = image
    var addedTile = null;
    if (outlineChecker!.checked){
      addedTile = editor.initTile(coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage,pattImage)
    }
    else{
      addedTile = editor.initTile(coords,colorPicker!.value,parseInt(sizeOfTileSlider!.value),0,'',shapeMenu!.value,insertImage,pattImage)
    }
    reload()
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
    
      var insertImage = image

      if (!backgroundChecker.checked){
        insertImage = undefined!
      }
      
    editor.updateChoosenTile(colorPicker!.value,parseInt(sizeOfTileSlider!.value),outlineChecker!.checked,parseInt(sizeOfOutlineSlider!.value), outlineColorPicker!.value,shapeMenu!.value,insertImage)
    reload()
  }
  let setValues = function(){
    if (editor.getChoosenTile()!=undefined){
      let sizeOfTileSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfTileSlider')!
      let colorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('colorPicker')!
      let sizeOfOutlineSlider:HTMLInputElement = <HTMLInputElement>doc.getElementById('sizeOfOutlineSlider')!
      let outlineColorPicker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineColorPicker')!
      let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
      let shapeMenu:HTMLSelectElement = <HTMLSelectElement>doc.getElementById('shapeMenu')!
      let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
      let choosenTile = editor.getChoosenTile()
      colorPicker.value = choosenTile!.getColor()
      sizeOfTileSlider.value = choosenTile!.getRadius().toString()
      sizeOfOutlineSlider.value = choosenTile!.getStroke().toString()
      outlineColorPicker.value = choosenTile!.getStrokeColor()
      outlineChecker.checked = choosenTile!.getStroke()>0
      if (outlineChecker.checked){
        doc.getElementById("hasOutlineShower")!.textContent = 'yes'
      }
      else{
        doc.getElementById("hasOutlineShower")!.textContent = 'no'
      }

      shapeMenu.value = choosenTile!.getShape()
      backgroundChecker.checked = editor.getChoosenTile()?.getBackgroundFile() != undefined

      if (backgroundChecker.checked){
        doc.getElementById("hasBackgroundImageShower")!.textContent = 'yes'
      }
      else{
        doc.getElementById("hasBackgroundImageShower")!.textContent = 'no'
      }
    }
   
      
  }
  let moveTile = function(event:MouseEvent){
     
      editor.moveTile(event)
      reload()
    
  }
  


  export{insertTilesMenu,editTiles,deleteTiles,moveTiles,isMoving,removeAllButtons,removeAllListenersAdded,spawnElements,spawnTile,undoTileInsert}
  