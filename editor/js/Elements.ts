import { game } from "./canvas";
import { showActualState, update } from "./TileEditor";



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

function spawnCheckerWithLabel(doc:HTMLDocument,parent:string,id:string,lbl:string,isChecked:boolean,options:Array<string>){
  let checker:HTMLInputElement = doc.createElement('input')
  checker.type = 'checkbox'
  checker.id = id;
  checker.checked = isChecked
  checker.style.float = 'left'
  checker.style.marginTop = '10px'
  
  
  let div = spawnDiv(document,parent,'div'+id,[])
  div.style.display='inline-block'
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = id
  label.textContent = lbl
  label.style.float = 'left'
  label.style.fontSize = 'large'
  label.style.verticalAlign = 'baseline'

  

  doc.getElementById('div'+id)!.appendChild(checker);
  doc.getElementById('div'+id)!.appendChild(label);
  return checker
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

function spawnSliderWithValueShower(doc:HTMLDocument,parent:string,id:string,lbl:string,min:string,max:string,step:string,value:string){
  spawnDiv(document,parent,'div'+id,[])
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = id
  label.textContent = lbl
  label.style.float = 'left'
  label.style.fontSize = 'large'

    let slider:HTMLInputElement = doc.createElement('input')
    slider.type = 'range'
    slider.id = id;
    slider.value = value;
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.style.float = 'right'
    slider.style.width = '50%'

    let sliderShower = doc.createElement('paragraph');
    sliderShower.id = id+'Shower'
    sliderShower.textContent = value;
    sliderShower.style.float = 'right'

    slider.oninput =function(){
        sliderShower!.textContent =  slider.value;
    }
    doc.getElementById('div'+id)!.appendChild(label);
    doc.getElementById('div'+id)!.appendChild(slider);
    doc.getElementById('div'+id)!.appendChild(sliderShower);
    
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
function spawnButtonWithLabel(doc:HTMLDocument,parent:string,id:string,lbl:string,classList:Array<string>,txt:string,func:Function){
  spawnDiv(document,parent,'div'+id,[])
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = id
  label.textContent = lbl
  label.style.float = 'left'
  label.style.fontSize = 'large'

  let button:HTMLButtonElement = doc.createElement('button')
  button.id = 'div'+id;
  button.textContent = txt;
  button.style.float = 'right'
  classList.forEach((add:string)=>{
      button.classList.add(add)
  })
  button.addEventListener('click',function(){func()})
  doc.getElementById('div'+id)!.appendChild(label)
  doc.getElementById('div'+id)!.appendChild(button)
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
    menu.style.float ='right'
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
function spawnRadioButtons(doc:HTMLDocument,parent:string,id:string,lbl:string,classList:Array<string>,options:Array<string>,onchangeFunc:Function){

  let div = spawnDiv(document,parent,'div'+id,[])
  let divkoMax = document.createElement('div')
  divkoMax.style.float = 'right'
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = id
  label.textContent = lbl
  label.style.float = 'left'
  label.style.fontSize = 'large'
  div.appendChild(label)

    for (let i = 0; i < options.length; i++) {
      let divko = doc.createElement('div')
      divko.style.float= 'left'
      let option = doc.createElement("input");
      option.type ='checkbox'
      option.value = options[i];
      option.id = options[i]
      option.style.width='20px'
      option.style.height='20px'
      option.style.marginTop = '20px'
      option.style.marginLeft = '3%'
      option.style.float = 'left'

        
      let checkerShower = doc.createElement('label');
      checkerShower.id = id+'Shower'+i
      checkerShower.textContent = options[i]
      checkerShower.htmlFor = option.id
      checkerShower.style.float='left'
     
      //option.onchange = function(){onchangeFunc()}
      //option.text = options[i];
      divko.append(option)
      divko.append(checkerShower)
      divkoMax.appendChild(divko);
      
    }
    div.appendChild(divkoMax)
   // doc.getElementById('div'+id)!.appendChild( label);
    //doc.getElementById('div'+id)!.appendChild( menu);
    //return menu
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
function spawnMultiSelect(doc:HTMLDocument,parent:string,id:string,lbl:string,txt:string,options:Array<string>,type:string){
  spawnDiv(document,parent,'div'+id,[])
  let label:HTMLLabelElement = doc.createElement('label')
  label.htmlFor = id
  label.textContent = lbl
  label.style.float = 'left'
  label.style.fontSize = 'large'
  label.style.marginRight = '15%'

  let startMenuWrapper = doc.createElement('div')
  startMenuWrapper.id = 'startMenuWrapper'
  startMenuWrapper.classList.add("dropdown")
  //startMenuWrapper.style.marginTop = '10%'
  startMenuWrapper.style.float = 'right'
  //startMenuWrapper.style.float = 'right'
  let startMenuButton = doc.createElement('button')
  startMenuButton.id = 'startMenuButton'
  startMenuButton.textContent = txt
  startMenuButton.classList.add("btn","btn-dark","dropdown-toggle")
  startMenuButton.setAttribute('data-bs-toggle','dropdown');
  
  startMenuButton.style.float = 'right'
  //startMenuButton.style.marginTop = '3%'
  
  startMenuWrapper.appendChild(startMenuButton)
  document.getElementById('tileEditingPlace')!.appendChild(startMenuWrapper)
  
  let startMenuDropdown = doc.createElement('div')
  startMenuDropdown.classList.add("dropdown-menu")
  startMenuDropdown.style.backgroundColor = '#292b2c'
  
      let types = options
      for (let i = 0; i < types.length; i++) {
        let option = doc.createElement("button");
        option.textContent = types[i];
        option.id = types[i]+type;
        option.style.backgroundColor = 'white'
        option.classList.add("dropdown-item",'btn')
        
        if (type == 'start' && game.getStartForPlayers().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }
        if (type == 'end' && game.getEndForPlayers().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }
        if (type == 'enabled' && game.getEnabledForPlayers().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }
        if (type == 'immune' && game.getCantBeEliminatedOnTile().includes(types[i])){
          option.style.backgroundColor = 'yellow'
        }

        
      
      
        option.addEventListener('click',function(e){
          if (type == 'start'){
            if (i == 0){
              if (game.getStartForPlayers().length < game.getPlayerTokens().length){
                  game.setStartForPlayers(game.getPlayerTokens().slice())
                  game.setStartForPlayers(game.getStartForPlayers().filter((t) => {return t != 'all'}));
                  option.style.backgroundColor = 'yellow'
                  for (let j = 0; j < types.length; j ++){
                    document.getElementById(types[j]+type)!.style.backgroundColor = 'yellow'
                  }
              }
              else{
                game.setStartForPlayers([])
                option.style.backgroundColor = 'white'
                for (let j = 0; j < types.length; j ++){
                  document.getElementById(types[j]+type)!.style.backgroundColor = 'white'
                }
              }
            }
            // if (game.getStartForPlayers().includes(types[i])){
            //   game.setStartForPlayers(game.getStartForPlayers().filter((t) => {return t != types[i]}));
            // }
            // else{
            //   game.getStartForPlayers().push(types[i])
            // }
          }
          else if(type == 'end'){
            if (i == 0){
              if (game.getEndForPlayers().length < game.getPlayerTokens().length){
             
                  game.setEndForPlayers(game.getPlayerTokens().slice())
                  game.setEndForPlayers(game.getEndForPlayers().filter((t) => {return t != 'all'}));
                  option.style.backgroundColor = 'yellow'
                  for (let j = 0; j < types.length; j ++){
            
                    document.getElementById(types[j]+type)!.style.backgroundColor = 'yellow'
                  }
              }
              else{
                game.setEndForPlayers([])
                option.style.backgroundColor = 'white'
                for (let j = 0; j < types.length; j ++){
                  document.getElementById(types[j]+type)!.style.backgroundColor = 'white'
                }
              }
            }
            // if (game.getEndForPlayers().includes(types[i])){
            //   game.setEndForPlayers(game.getEndForPlayers().filter((t) => {return t != types[i]}));
            //   console.log(game.getEndForPlayers())
            // }
            // else{
            //   game.getEndForPlayers().push(types[i])
            //   console.log(game.getEndForPlayers())
            // }
          }
          else if (type == 'enabled'){
            if (game.getEnabledForPlayers().includes(types[i])){
              game.setEnabledForPlayers(game.getEnabledForPlayers().filter((t) => {return t != types[i]}));
            }
            else{
              game.getEnabledForPlayers().push(types[i])
            }
          }
          else if (type == 'immune'){
            if (i == 0){
              if (game.getCantBeEliminatedOnTile().length < game.getPlayerTokens().length){
                  game.setCantBeEliminatedOnTile(game.getPlayerTokens().slice())
                  game.setCantBeEliminatedOnTile(game.getCantBeEliminatedOnTile().filter((t) => {return t != 'all'}));
                  option.style.backgroundColor = 'yellow'
                  for (let j = 0; j < types.length; j ++){
                    document.getElementById(types[j]+type)!.style.backgroundColor = 'yellow'
                  }
              }
              else{
                game.setCantBeEliminatedOnTile([])
                option.style.backgroundColor = 'white'
                for (let j = 0; j < types.length; j ++){
                  document.getElementById(types[j]+type)!.style.backgroundColor = 'white'
                }
              }}
            // if (game.getCantBeEliminatedOnTile().includes(types[i])){
            //   game.setCantBeEliminatedOnTile(game.getCantBeEliminatedOnTile().filter((t) => {return t != types[i]}));
            // }
            // else{
            //   game.getCantBeEliminatedOnTile().push(types[i])
            // }
          }
     
          if (game.getChoosenTile()!=undefined){
            update()
          }
          
          e.stopPropagation()
          if (option.style.backgroundColor == 'white' && i!=0){
            option.style.backgroundColor = 'yellow'
          }
          else if(i!=0){
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
function spawnTextArea(doc:HTMLDocument,parent:string,id:string,txt:string,readonly:boolean){
  let textfield = doc.createElement('textarea')
  textfield.id = id
  textfield.classList.add('ruleField')
  textfield.readOnly = readonly
  doc.getElementById(parent)!.appendChild(textfield);
  return textfield
}

function spawnDiv(doc:HTMLDocument,parent:string,id:string,classList:Array<string>){
  let div:HTMLDivElement = doc.createElement('div')
    div.id = id;
    div.style.float ='left'
    div.style.width = '100%'
    div.style.marginBottom = '3%'
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

export{spawnColorPicker,spawnDiv,spawnParagraph,spawnButtonWithLabel,spawnCheckerWithLabel,spawnRadioButtons,spawnLabel,spawnHeading,spawnTextArea,spawnCanvas,spawnCheckerWithValueShower,spawnSliderWithValueShower,spawnButton,spawnSelectMenu,spawnImageInput,spawnMultiSelect,spawnNumberInput}