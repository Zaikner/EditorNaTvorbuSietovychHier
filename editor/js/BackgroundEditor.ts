import {doc,ctx, editor,reload,texts, elementDeleter, canvas, mainMenu, calibreEventCoords} from './canvas.js'
import { spawnButton, spawnColorPicker, spawnImageInput, spawnParagraph, spawnSelectMenu, spawnSliderWithValueShower } from './Elements.js'
import {removeAllButtons,removeAllListenersAdded, saveInsertingTiles, unchooseEverything} from './TileEditor.js'

var background:HTMLImageElement = undefined!
function editBackground(){
    removeAllButtons()
    removeAllListenersAdded()

     let backgroundChecker:HTMLInputElement = doc.createElement('input')
    backgroundChecker.type = 'checkbox'
    backgroundChecker.id = 'backgroundChecker';

    let text = doc.createElement('p')
    text.textContent = texts[91]

    let hasBackgroundImageShower = doc.createElement('paragraph');
    hasBackgroundImageShower.id = 'hasBackgroundImageShower'
    hasBackgroundImageShower.textContent = texts[92]

    backgroundChecker.oninput =function(){
      if (backgroundChecker.checked){
        doc.getElementById("hasBackgroundImageShower")!.textContent = texts[93]
      }
      else{
        doc.getElementById("hasBackgroundImageShower")!.textContent = texts[92]
      }

    }
    doc.getElementById("tileEditingPlace")!.appendChild(text);

    doc.getElementById("tileEditingPlace")!.appendChild(backgroundChecker);
    doc.getElementById("tileEditingPlace")!.appendChild(hasBackgroundImageShower);
    
  
  let backgroundImage:HTMLInputElement = doc.createElement('input')
  backgroundImage.id = 'backgroundImage'
  backgroundImage.type = 'file'
  backgroundImage.accept = ".jpg, .jpeg, .png"
  backgroundImage.textContent = texts[86]
  backgroundImage.oninput = function(){
    
    if (backgroundImage.files!.length > 0){
      background = new Image()
      background!.src =URL.createObjectURL(backgroundImage!.files![0]!)
      
    }
    else{
        background = undefined!
    }
  }
  doc.getElementById("tileEditingPlace")!.appendChild(backgroundImage);

  let buttonSubmit:HTMLButtonElement = doc.createElement('button')
  buttonSubmit.id = 'changeBackground'
  buttonSubmit.textContent = texts[35]
  buttonSubmit.classList.add("btn")
  buttonSubmit.classList.add("btn-dark")

  doc.getElementById("buttonPlace")!.appendChild(buttonSubmit);
  doc.getElementById("changeBackground")!.addEventListener('click',function(){
      if (backgroundChecker.checked){
        editor.getGame().getBackground().setBackgroundImage(background)
      }
      else{
        editor.getGame().getBackground().delete()
      }
      editor.getGame().getBackground().setColor(colorPicker.value)
      reload(editor,ctx)
  });

  let buttonDelete:HTMLButtonElement = doc.createElement('button')
  buttonDelete.id = 'deleteBackground'
  buttonDelete.textContent = texts[94]
  buttonDelete.classList.add("btn")
  buttonDelete.classList.add("btn-dark")

  doc.getElementById("buttonPlace")!.appendChild(buttonDelete);
  doc.getElementById("deleteBackground")!.addEventListener('click',function(){
      editor.getGame().getBackground().delete()
      reload(editor,ctx)
  });

  let colorPicker:HTMLInputElement = doc.createElement('input')
  colorPicker.type = 'color'
  colorPicker.id = 'colorPicker';
  
 text = doc.createElement('p')
  text.textContent = texts[95]
  doc.getElementById("tileEditingPlace")!.appendChild(text);

  doc.getElementById("tileEditingPlace")!.appendChild( colorPicker);
}

let moveComponentHandler = function(event:MouseEvent){
  editor.getGame().getBackground().findComponent(event,false)
  reload(editor,ctx)
}
let moveComponent = function(event:MouseEvent){
  editor.getGame().getBackground().moveComponent(event)
  reload(editor,ctx)
}
let deleteComponent = function(event:MouseEvent){
  editor.getGame().getBackground().deleteComponent(event)
  reload(editor,ctx)
}
function moveComponents(){
  removeAllListenersAdded()
  
  doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
  //editor.makeAllTilesNotChoosen()
  reload(editor,ctx)
  editor.setIsMoving(true)
  removeAllButtons()
  canvas.addEventListener('click',moveComponentHandler)
  canvas.addEventListener('mousemove',moveComponent)
  canvas.addEventListener('mousedown',moveComponent)
}
function spawnComponentElements(edit:boolean){
  
  removeAllButtons()
  if (edit){
    spawnButton(document,'buttonPlace','',['btn','btn-secondary'],texts[64],function(){
      updateComponent()
      unchooseEverything()
      reload(editor,ctx)
    })
  }
  spawnButton(document,'buttonPlace','',['btn','btn-secondary'],texts[79],function(){
    removeAllButtons()
    removeAllListenersAdded()
    mainMenu()})
  spawnButton(document,'buttonPlace','',['btn','btn-secondary'],texts[80],function(){
    editor.getGame().getBackground().deleteFromUndoLog()
    reload(editor,ctx)
  })


  spawnParagraph(document,'tileEditingPlace','',texts[81],true)
  spawnSliderWithValueShower(document,'tileEditingPlace','componentSizeSlider','30','300','10','100')

  spawnParagraph(document,'tileEditingPlace','',texts[82],true)
  spawnColorPicker(document,'tileEditingPlace','componentColorPicker')

  spawnParagraph(document,'tileEditingPlace','',texts[83],true)
  spawnSliderWithValueShower(document,'tileEditingPlace','componentOutlineSlider','0','20','10','100')

  spawnParagraph(document,'tileEditingPlace','',texts[84],true)
  spawnColorPicker(document,'tileEditingPlace','componentOutlineColorPicker')

  spawnParagraph(document,'tileEditingPlace','',texts[85],true)
  spawnSelectMenu(document,'tileEditingPlace','componentTypeMenu',['btn','btn-secondary'],['circle','square','image'])

  spawnParagraph(document,'tileEditingPlace','',texts[86],true)
  spawnImageInput(document,'tileEditingPlace','componentImage',texts[86],function(){

    if ((<HTMLInputElement>document.getElementById('componentImage')!).files!.length > 0){
      editor.getGame().getBackground().setNextComponentImage(new Image())
        editor.getGame().getBackground().getNextComponentImage()!.src =URL.createObjectURL((<HTMLInputElement>document.getElementById('componentImage')!).files![0]!)    
        editor.getGame().getBackground().getNextComponentImage().onload = function (){
          //showActualState()
        }
        
      }
    else{
      editor.getGame().getBackground().setNextComponentImage(undefined!)
    }
  })

  spawnParagraph(document,'tileEditingPlace','',texts[87],true)
  spawnSliderWithValueShower(document,'tileEditingPlace','componentWidthSlider','1','500','10','100')

  spawnParagraph(document,'tileEditingPlace','',texts[88],true)
  spawnSliderWithValueShower(document,'tileEditingPlace','componentHeightSlider','1','500','10','100')

}
let editComponent= function(){

}

let insertComponent = function(event:MouseEvent){
  let size = (<HTMLInputElement>doc.getElementById('componentSizeSlider')!).value.slice()
  let color = (<HTMLInputElement>doc.getElementById('componentColorPicker')!).value.slice()
  let stroke = (<HTMLInputElement>doc.getElementById('componentOutlineSlider')!).value.slice()
  let colorStroke = (<HTMLInputElement>doc.getElementById('componentOutlineColorPicker')!).value.slice()
  let type= (<HTMLSelectElement>doc.getElementById('componentTypeMenu')!).value.slice()
  let image = editor.getGame().getBackground().getNextComponentImage()
  let imageWidth = (<HTMLInputElement>doc.getElementById('componentWidthSlider')!).value.slice()
  let imageHeight = (<HTMLInputElement>doc.getElementById('componentHeightSlider')!).value.slice()

  let createdComponent = editor.getGame().getBackground().createComponent(event,type,parseInt(size),color,parseInt(stroke),colorStroke,image,parseInt(imageWidth),parseInt(imageHeight))

  return createdComponent
}

let updateComponent = function(){

 

  let size = (<HTMLInputElement>doc.getElementById('componentSizeSlider')!).value.slice()
  let color = (<HTMLInputElement>doc.getElementById('componentColorPicker')!).value.slice()
  let stroke = (<HTMLInputElement>doc.getElementById('componentOutlineSlider')!).value.slice()
  let colorStroke = (<HTMLInputElement>doc.getElementById('componentOutlineColorPicker')!).value.slice()
  let type= (<HTMLSelectElement>doc.getElementById('componentTypeMenu')!).value.slice()
  let imageWidth = (<HTMLInputElement>doc.getElementById('componentWidthSlider')!).value.slice()
  let imageHeight = (<HTMLInputElement>doc.getElementById('componentHeightSlider')!).value.slice()

  let component = editor.getGame().getBackground().getChoosenComponent()
  component?.setRadius(parseInt(size))
  component?.setColor(color)
  component?.setStroke(parseInt(stroke))
  component?.setStrokeColor(colorStroke)
  component?.setType(type)
  component?.setImage(editor.getGame().getBackground().getNextComponentImage())
  component?.setImageWidth(parseInt(imageWidth))
  component?.setImageHeight(parseInt(imageHeight))

  reload(editor,ctx)
}

function setElements(){
  (<HTMLInputElement>doc.getElementById('componentSizeSlider')!).value = editor.getGame().getBackground().getChoosenComponent()?.getRadius().toString()!;
 (<HTMLInputElement>doc.getElementById('componentColorPicker')!).value= editor.getGame().getBackground().getChoosenComponent()?.getColor()!;
  (<HTMLInputElement>doc.getElementById('componentOutlineSlider')!).value= editor.getGame().getBackground().getChoosenComponent()?.getStroke().toString()!;
  (<HTMLInputElement>doc.getElementById('componentOutlineColorPicker')!).value= editor.getGame().getBackground().getChoosenComponent()?.getStrokeColor()!;
  (<HTMLSelectElement>doc.getElementById('componentTypeMenu')!).value= editor.getGame().getBackground().getChoosenComponent()?.getType()!;
  (<HTMLInputElement>doc.getElementById('componentWidthSlider')!).value= editor.getGame().getBackground().getChoosenComponent()?.getImageWidth()!.toString()!;
  (<HTMLInputElement>doc.getElementById('componentHeightSlider')!).value= editor.getGame().getBackground().getChoosenComponent()?.getImageHeight()!.toString()!;

}
function addComponentMenu(){
  spawnComponentElements(false)
  removeAllListenersAdded()
  unchooseEverything
  canvas.addEventListener('click',insertComponent)
}
function moveComponentMenu(){
  removeAllButtons()
  removeAllListenersAdded()
 
  spawnButton(document,'tileEditingPlace','',['btn','btn-secondary'],texts[89],function(){saveInsertingTiles()})
  moveComponents()
}
function editComponentMenu(){
  removeAllButtons()
  removeAllListenersAdded()
  
 spawnComponentElements(true)
 canvas.addEventListener('click',function(event:MouseEvent){
   editor.getGame().getBackground().findComponent(event,false)
  setElements()
 })
}
function deleteComponentMenu(){
  removeAllButtons()
  removeAllListenersAdded()
  canvas.addEventListener('click',deleteComponent)
  spawnButton(document,'tileEditingPlace','',['btn','btn-secondary'],texts[90],function(){saveInsertingTiles()})
}

function removeAllComponentListeners(){
  canvas.removeEventListener('click',insertComponent)
  canvas.removeEventListener('click',moveComponentHandler)
  canvas.removeEventListener('mousemove',moveComponent)
  canvas.removeEventListener('mousedown',moveComponent)
  canvas.removeEventListener('click',deleteComponent)
}

export {editBackground,addComponentMenu,moveComponentMenu,editComponentMenu,deleteComponentMenu,removeAllComponentListeners,editComponent}