import {doc,ctx, editor,reload} from './canvas.js'
import {removeAllButtons,removeAllListenersAdded} from './TileEditor.js'

var background:HTMLImageElement = undefined!
function editBackground(){
    removeAllButtons()
    removeAllListenersAdded()

     let backgroundChecker:HTMLInputElement = doc.createElement('input')
    backgroundChecker.type = 'checkbox'
    backgroundChecker.id = 'backgroundChecker';

    let text = doc.createElement('p')
    text.textContent = 'Is background an Image? (checkbox)'

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
    
  
  let backgroundImage:HTMLInputElement = doc.createElement('input')
  backgroundImage.id = 'backgroundImage'
  backgroundImage.type = 'file'
  backgroundImage.accept = ".jpg, .jpeg, .png"
  backgroundImage.textContent = 'Choose an Image!'
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
  buttonSubmit.textContent = 'Change!'
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
  buttonDelete.textContent = 'Delete Background!'
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
  text.textContent = 'Choose color of background:'
  doc.getElementById("tileEditingPlace")!.appendChild(text);

  doc.getElementById("tileEditingPlace")!.appendChild( colorPicker);
}



export {editBackground}