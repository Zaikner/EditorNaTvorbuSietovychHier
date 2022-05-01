import { editor } from "./canvas";
import { showActualState } from "./TileEditor";



function spawnColorPicker(doc:HTMLDocument,parent:string,id:string,lbl:string,func:Function= function(){}){

    spawnDiv(document,parent,'div'+id,[])
    let label:HTMLLabelElement = doc.createElement('label')
    label.htmlFor = id
    label.textContent = lbl
    label.style.float = 'left'
    label.style.fontSize = 'large'


    let colorPicker:HTMLInputElement = doc.createElement('input')
    colorPicker.type = 'color'
    colorPicker.id = id;
    colorPicker.value = 'white';
    colorPicker.style.float = 'right'
    colorPicker.onchange = function(){func()}
    doc.getElementById('div'+id)!.appendChild( label);
    doc.getElementById('div'+id)!.appendChild( colorPicker);
    return colorPicker
}

function spawnParagraph(doc:HTMLDocument,parent:string,id:string,textCont:string,margin:boolean){
    let text = doc.createElement('p')
    text.textContent = textCont
    text.id = id
    doc.getElementById(parent)!.appendChild(text);
    text.style.color ='#FFFFFF'
    text.style.textAlign = 'left'
    if (margin){
      text.style.marginTop = "15%"
    }
    return text
}

function spawnCanvas(doc:HTMLDocument,parent:string,id:string){
  let canvas = doc.createElement('canvas')
  canvas.id = id
  doc.getElementById(parent)!.appendChild(canvas);
  return canvas
}

function spawnCheckerWithValueShower(doc:HTMLDocument,parent:string,id:string,isChecked:boolean,options:Array<string>){
    let checker:HTMLInputElement = doc.createElement('input')
    checker.type = 'checkbox'
    checker.id = id;
    
    let checkerShower = doc.createElement('paragraph');
    checkerShower.id = id+'Shower'
    checkerShower.textContent = options[0]

    checker.oninput =function(){
      if (checker.checked){
        checkerShower.textContent = options[1]
      }
      else{
        checkerShower.textContent = options[0]
      }

    }
  
    doc.getElementById(parent)!.appendChild(checker);
    doc.getElementById(parent)!.appendChild(checkerShower);
    return checker
}

function spawnSliderWithValueShower(doc:HTMLDocument,parent:string,id:string,min:string,max:string,step:string,value:string){
    let slider:HTMLInputElement = doc.createElement('input')
    slider.type = 'range'
    slider.id = id;
    slider.value = value;
    slider.min = min;
    slider.max = max;
    slider.step = step;

    let sliderShower = doc.createElement('paragraph');
    sliderShower.id = id+'Shower'
    sliderShower.textContent = value;

    slider.oninput =function(){
        sliderShower!.textContent =  slider.value;
    }
    doc.getElementById(parent)!.appendChild(slider);
    doc.getElementById(parent)!.appendChild(sliderShower);
    return slider
}

function spawnButton(doc:HTMLDocument,parent:string,id:string,classList:Array<string>,txt:string,func:Function){
    let button:HTMLButtonElement = doc.createElement('button')
    button.id = id;
    button.textContent = txt;
    classList.forEach((add:string)=>{
        button.classList.add(add)
    })
    button.addEventListener('click',function(){func()})
    doc.getElementById(parent)!.appendChild(button)
    return button
}
function spawnSelectMenu(doc:HTMLDocument,parent:string,id:string,lbl:string,classList:Array<string>,options:Array<string>){

  spawnDiv(document,parent,'div'+id,[])
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = id
  label.textContent = lbl
  label.style.float = 'left'
  label.style.fontSize = 'large'

    let menu:HTMLSelectElement = doc.createElement('select')
    menu.id = id;
    classList.forEach((add:string)=>{
       menu.classList.add(add)
    })
    for (let i = 0; i < options.length; i++) {
      let option = doc.createElement("option");
      option.value = options[i];
      option.text = options[i];
      menu.appendChild(option);
    }
    doc.getElementById('div'+id)!.appendChild( label);
    doc.getElementById('div'+id)!.appendChild( menu);
    return menu
}
function spawnImageInput(doc:HTMLDocument,parent:string,id:string,txt:string,lbl:string,func:Function){
    spawnDiv(document,parent,'div'+id,[])
    let label:HTMLLabelElement = doc.createElement('label')
    label.htmlFor = id
    label.textContent = lbl
    label.style.float = 'left'
    label.style.fontSize = 'large'

    let image:HTMLInputElement = doc.createElement('input')
    image.id = id
    image.type = 'file'
    image.accept = ".jpg, .jpeg, .png"
    image.textContent = txt
    image.style.float = 'right'
    image.style.width = '50%'
    image.oninput = function(){ 
     func()
    }
   
   image.onchange = function(){func()}
    doc.getElementById('div'+id)!.appendChild( label);
    doc.getElementById('div'+id)!.appendChild( image);
    return image
}
function spawnMultiSelect(doc:HTMLDocument,parent:string,id:string,lbl:string,options:Array<string>,type:string){
  spawnDiv(document,parent,'div'+id,[])
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = id
  label.textContent = lbl
  label.style.float = 'left'
  label.style.fontSize = 'large'

  let startMenuWrapper = doc.createElement('div')
  startMenuWrapper.id = 'startMenuWrapper'
  startMenuWrapper.classList.add("dropdown")
  startMenuWrapper.style.float = 'right'
  let startMenuButton = doc.createElement('button')
  startMenuButton.id = 'startMenuButton'
  startMenuButton.textContent = 'Choose!'
  startMenuButton.classList.add("btn","btn-dark","dropdown-toggle")
  startMenuButton.setAttribute('data-bs-toggle','dropdown');
  
  startMenuWrapper.appendChild(startMenuButton)
  document.getElementById('tileEditingPlace')!.appendChild(startMenuWrapper)
  
  let startMenuDropdown = doc.createElement('div')
  startMenuDropdown.classList.add("dropdown-menu")
  startMenuDropdown.style.backgroundColor = '#292b2c'
  
      let types = options
      for (let i = 0; i < types.length; i++) {
        let option = doc.createElement("button");
        option.textContent = types[i];
        option.id = types[i];
        option.style.backgroundColor = 'white'
        option.classList.add("dropdown-item",'btn')
        
        if (type == 'start' && editor.getStartForPlayers().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }
        if (type == 'end' && editor.getEndForPlayers().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }
        if (type == 'enabled' && editor.getEnabledForPlayers().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }
        if (type == 'immune' && editor.getCantBeEliminatedOnTile().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }

        
      
      
        option.addEventListener('click',function(e){
          if (type == 'start'){
            if (editor.getStartForPlayers().includes(types[i])){
              editor.setStartForPlayers(editor.getStartForPlayers().filter((t) => {return t != types[i]}));
            }
            else{
              editor.getStartForPlayers().push(types[i])
            }
          }
          else if(type == 'end'){
            if (editor.getEndForPlayers().includes(types[i])){
              editor.setEndForPlayers(editor.getEndForPlayers().filter((t) => {return t != types[i]}));
              console.log(editor.getEndForPlayers())
            }
            else{
              editor.getEndForPlayers().push(types[i])
              console.log(editor.getEndForPlayers())
            }
          }
          else if (type == 'enabled'){
            if (editor.getEnabledForPlayers().includes(types[i])){
              editor.setEnabledForPlayers(editor.getEnabledForPlayers().filter((t) => {return t != types[i]}));
            }
            else{
              editor.getEnabledForPlayers().push(types[i])
            }
          }
          else if (type == 'immune'){
            if (editor.getCantBeEliminatedOnTile().includes(types[i])){
              editor.setCantBeEliminatedOnTile(editor.getCantBeEliminatedOnTile().filter((t) => {return t != types[i]}));
            }
            else{
              editor.getCantBeEliminatedOnTile().push(types[i])
            }
          }
          console.log(editor.getStartForPlayers())
          e.stopPropagation()
          if (option.style.backgroundColor == 'white'){
            option.style.backgroundColor = 'yellow'
          }
          else{
            option.style.backgroundColor = 'white'
          }
          e.stopPropagation()
        })
        startMenuDropdown.appendChild(option);
    }
    startMenuWrapper.appendChild(startMenuDropdown)

    doc.getElementById('div'+id)!.appendChild( label);
    doc.getElementById('div'+id)!.appendChild( startMenuWrapper);
}
function spawnNumberInput(doc:HTMLDocument,parent:string,id:string){
  let numberSetter:HTMLInputElement = doc.createElement('input')
  numberSetter.id = id;
  numberSetter.type = 'number'
  doc.getElementById(parent)!.appendChild(numberSetter);
  return numberSetter
}
function spawnHeading(doc:HTMLDocument,parent:string,id:string,txt:string){
  let heading = doc.createElement('H1')
  heading.id = id;
  heading.classList.add('alignCenter')
  heading.textContent = txt
  heading.style.color = 'white'
  heading.style.margin = '3%'
  doc.getElementById(parent)!.appendChild(heading);
  return heading
}
function spawnTextArea(doc:HTMLDocument,parent:string,id:string,txt:string){
  let textfield = doc.createElement('textarea')
  textfield.id = id
  textfield.classList.add('ruleField')
  
  doc.getElementById(parent)!.appendChild(textfield);
  return textfield
}

function spawnDiv(doc:HTMLDocument,parent:string,id:string,classList:Array<string>){
  let div:HTMLDivElement = doc.createElement('div')
    div.id = id;
    div.style.float ='left'
    div.style.width = '100%'
    classList.forEach((c:string)=>{
      div.classList.add(c)
    })
    doc.getElementById(parent)!.appendChild(div);
    return div
}

function spawnLabel(doc:HTMLDocument,labelFor:string,txt:string){
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = labelFor
  label.textContent = txt;
  label.style.color = 'white'
  return label

}

export{spawnColorPicker,spawnDiv,spawnParagraph,spawnLabel,spawnHeading,spawnTextArea,spawnCanvas,spawnCheckerWithValueShower,spawnSliderWithValueShower,spawnButton,spawnSelectMenu,spawnImageInput,spawnMultiSelect,spawnNumberInput}