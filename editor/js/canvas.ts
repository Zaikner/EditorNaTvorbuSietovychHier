
import { Point } from "./Point";
import {Tile} from './Tile.js'
import { insertTilesMenu,editTiles,deleteTiles,moveTiles, removeAllButtons, removeAllListenersAdded, moveEventHandler, pickTile, unchooseEverything } from "./TileEditor.js";
import { addComponentMenu, deleteComponentMenu, editBackground, editComponentMenu, moveComponentMenu, removeAllComponentListeners } from "./BackgroundEditor";
import {GameEditor} from './GameEditor.js'

import { spawnButton, spawnNumberInput, spawnParagraph, spawnSliderWithValueShower } from "./Elements";


import { Background } from "./Background";
import { initGameInfo,initDice, changeWaitingRoom, throwDice } from "./Gameplay";
import { pawnInsertMenu,pawnEditMenu,pawnDeleteMenu } from "./PawnEditor";
import { Pawn } from "./Pawn";
import { addOption, askQuestion, createQuestion, showAllQuestions ,evaluateQuestion, removeLastOption, initCreation, pickQuestion, showResults} from "./Questions";

import { PawnStyle } from "./PawnStyle";
import { Warning } from "./Warning";
import { BackgroundComponent } from "./BackgroundComponent";
import { editorSocket, isEditor,getCookie,texts } from "./clientSocket";



const editor = new GameEditor()
const params = new URLSearchParams(window.location.search);


//socket.emit('chat message', 'hi');
const canvas = document.createElement('canvas');
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");










function edit(){
  mainMenu();

// document.getElementById('nextTileButtonSet')?.addEventListener('click',function(){
//   updateNextTileIds()
// })
document.getElementById('forwardButton')!.addEventListener('click',function(){
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[97],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    editor.setEvents('forward',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    elementDeleter('askTheQuestionEventEdit')
    document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[99] +' ' + nums +' ' + texts[100]
  })
})
document.getElementById('backwardButton')!.addEventListener('click',function(){
  
  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[102],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    editor.setEvents('backward',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    elementDeleter('askTheQuestionEventEdit')
  
    
    document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[103] +' ' + nums +' ' + texts[100]
  })
})
document.getElementById('skipButton')!.addEventListener('click',function(){

  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[104],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    editor.setEvents('skip',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    elementDeleter('askTheQuestionEventEdit')
    document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[105] +' ' + nums +' ' + texts[100]
  })
  
})
document.getElementById('repeatButton')!.addEventListener('click',function(){
 
  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[106],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    editor.setEvents('repeat',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    elementDeleter('askTheQuestionEventEdit')
    document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[107] +' ' + nums +' ' + texts[100]
    
  })
  
});
document.getElementById('stopButton')!.addEventListener('click',function(){
 
  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[108],true)
  
  let freeInput = spawnNumberInput(document,'askTheQuestionEventEdit','freeInput')!
  freeInput.max = '6'
  freeInput.min = '1'
  freeInput.placeholder = texts[55]
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[109],true)
  
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    editor.setEvents('stop',{num:parseInt(nums),value:parseInt(freeInput.value)})
    $('#editEventModal').modal('hide')
    elementDeleter('askTheQuestionEventEdit')
   
    
    document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[110] + freeInput.value +texts[111] + nums + texts[100];
  })
  
});

  //$('#rulesModal').modal('show');
document.getElementById('editBackground')!.addEventListener('click',function(){
  unchooseEverything()
  editBackground();} );
document.getElementById('insertTiles')!.addEventListener('click',function(){
  unchooseEverything()
  insertTilesMenu();} );
document.getElementById('moveTiles')!.addEventListener('click',function(){
  unchooseEverything()
  moveTiles();} );
document.getElementById('editTiles')!.addEventListener('click',function(){
  unchooseEverything()
  editTiles();} );
document.getElementById('deleteTiles')!.addEventListener('click',function(){deleteTiles();} );

document.getElementById('questionManager')!.addEventListener('click',function(){elementDeleter('listContainer')
                                                                                editorSocket.emit('loadQuestions');} )
// document.getElementById('questionSubmitButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )
// document.getElementById('questionEditButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )

//spawnButton(document,'containerAdd','dd',[],'Add Option',addOption)
document.getElementById('generalInfoButton')!.addEventListener('click',function(){
  removeAllButtons()
  removeAllListenersAdded()
  mainMenu();})
document.getElementById('addComponent')?.addEventListener('click',function(){addComponentMenu()})
document.getElementById('editComponent')?.addEventListener('click',function(){editComponentMenu()})
document.getElementById('moveComponent')?.addEventListener('click',function(){moveComponentMenu()})
document.getElementById('deleteComponent')?.addEventListener('click',function(){deleteComponentMenu()})
  
//document.getElementById('setAnswerButton')!.addEventListener('click',function(){editorSocket.emit('answerQuestion',{id:0})})
document.getElementById('addButtonInsert')!.addEventListener('click',function(){addOption('questionOptions','',false);})
document.getElementById('addButtonEdit')!.addEventListener('click',function(){addOption('editQuestion','',false);})
document.getElementById('createQuestionButtonModal')!.addEventListener('click',function(){initCreation('questionOptions');
                                                                                                      })

//document.getElementById('removeButtonInsert')!.addEventListener('click',function(){removeLastOption('questionOptions');})
//document.getElementById('removeButtonEdit')!.addEventListener('click',function(){removeLastOption('editQuestion');})
document.getElementById('questionSubmitButton')!.addEventListener('click',function(){createQuestion(-1);})



document.getElementById('loadCreatedGameModal')?.addEventListener('click',function(){
  let val = (<HTMLInputElement>document.getElementById('gameNameInput'))!.value
  removeAllButtons()
  editorSocket.emit('load game',{id:getCookie('id'),name:val,response:true})
 
  mainMenu()
  
})

document.getElementById('editPawn')!.addEventListener('click',function(){pawnEditMenu()} );

document.getElementById("resetQuestionID")!.addEventListener('click',function(){
  editor.setQuestionId(-1);
  (<HTMLButtonElement>document.getElementById('bindQuestion'))!.textContent = texts[114]
 
})
 }

var doc = document;



document.getElementById("canvasPlace")!.appendChild(canvas);

let started:Boolean = false;




function mainMenu(){ 
  
 started = false


let numOfPlayersSlider:HTMLInputElement = document.createElement('input')
numOfPlayersSlider.type = 'range'
numOfPlayersSlider.id = 'numOfPlayers';
numOfPlayersSlider.value = editor.getGame().getnumOfPlayers().toString()
numOfPlayersSlider.min = '1';
numOfPlayersSlider.max = '6';
numOfPlayersSlider.step = '1';


let numShower = document.createElement('paragraph');
numShower.id = 'numShower'
numShower.textContent = editor.getGame().getnumOfPlayers().toString()
let text = document.createElement('p')
text.textContent = texts[22]
document.getElementById("numOfPlayersPlace")!.appendChild(text);
document.getElementById("numOfPlayersPlace")!.appendChild(numShower);

numOfPlayersSlider.onclick =function(){
  document.getElementById("numShower")!.textContent =numOfPlayersSlider.value ;
  editor.getGame().setNumOfPlayers(parseInt(numOfPlayersSlider.value))
  let number =  parseInt(numOfPlayersSlider.value)
  let playerTokens = editor.getGame().getPlayerTokens()
  if (number < playerTokens.length){
  
    for (let i = number; i <= 6;i++){
      playerTokens.pop()
      editor.getGame().getPawnStyle().delete('Player '+i)
      editor.getGame().getNextTilesIds().delete('Player '+i)
      let rem:Array<Pawn> = []
      editor.getGame().getPawns().forEach((pawn:Pawn)=>{
        if (pawn.player == ('Player '+i)){
          rem.push(pawn)
        }
      })
      rem.forEach((pawn:Pawn)=>{
        editor.getGame().removePawn(pawn)
        pawn.tile.removePawn(pawn)
      })
    }
  }
  if (number > playerTokens.length){
    for (let i = 1; i <= number;i++){
      if (!playerTokens.includes('Player '+i)){
        playerTokens.push('Player '+ (playerTokens.length+1))
        editor.getGame().getNextTilesIds().set('Player '+i,editor.getGame().getTiles().length+1)
        editor.getGame().getPawnStyle().set('Player '+i,new PawnStyle('Player '+i,'#000000','type1'))
       
      }
     
      //editor.getGame().getPawnStyle().Player
    }
  }
  
  editor.getGame().setPlayerTokens(playerTokens)
  console.log(playerTokens)
  console.log(editor.getGame().getNextTilesIds())
  reload(editor,ctx)
}
document.getElementById("numOfPlayersPlace")!.appendChild(numOfPlayersSlider);

let gameName:HTMLInputElement = document.createElement('input')
gameName.id = 'gameName'
gameName.value = editor.getGame().getName()
text = document.createElement('p')
text.textContent = texts[23]
document.getElementById("gameNamePlace")!.appendChild(text);
gameName.oninput =function(){
  editor.getGame().setName(gameName.value)
  
}
document.getElementById("gameNamePlace")!.appendChild(gameName);

let gameType:HTMLSelectElement = document.createElement('select');
gameType.id = 'gameType'

text = document.createElement('p')
text.textContent = 'Typ hry:'
document.getElementById("gameTypePlace")!.appendChild(text);
document.getElementById("gameTypePlace")!.appendChild(gameType);

spawnParagraph(document,'tileEditingPlace','',texts[112],true)
let slid = spawnSliderWithValueShower(document,'tileEditingPlace','tileNumberSlider','0','4','1',editor.getGame().getNumberOfStartingPawns().toString())
slid.onchange = function(){
  let max = parseInt(slid!.value)
  if (max > editor.getGame().getNumberOfStartingPawns()){
    editor.getGame().getPlayerTokens().forEach((player:string) => {
      for (let i = 0;i<(max-editor.getGame().getNumberOfStartingPawns());i++){
        editor.getGame().getTiles().forEach((tile:Tile)=>{
          if (tile.getIsStartingFor().includes(player)){
            let newPawn = new Pawn(player,tile)
    
            editor.getGame().getPawns().push(newPawn)
          }
        })
      }
  })
    
  }
  else{
    editor.getGame().getPlayerTokens().forEach((player:string) => {
      let num = 0
      let rem:Array<Pawn> = []
      //EDITOR PRECHADZAT CEZ TILES A NIE CEZ PAWN BOA
      editor.getGame().getTiles().forEach((tile:Tile)=>{
        num = 0
        tile.getPawns().forEach((pawn:Pawn)=>{
          if (pawn.player == player){
                    num++;
                    if (num > max){
                      rem.push(pawn)
                    }
                  }
                  rem.forEach((pawn:Pawn)=>{
                          editor.getGame().removePawn(pawn)
                          pawn.tile.removePawn(pawn)
                        })
        })
      })
      
  //     editor.getGame().getPawns().forEach((pawn:Pawn)=>{
  //       if (pawn.player == player){
  //         num++;
  //         if (num > max){
  //           rem.push(pawn)
  //         }
  //       }
  //     })
  //     rem.forEach((pawn:Pawn)=>{
  //       editor.getGame().removePawn(pawn)
  //       pawn.tile.removePawn(pawn)
  //     })
     });
   }
  editor.getGame().setNumberOfStartingPawns(max)
  

 
  reload(editor,ctx)
}

spawnButton(document,'tileEditingPlace','savaGameButton',["btn","btn-dark"],texts[113],function(){
  editor.getGame().saveGame()
  //window.location.replace('/')
})
}


 

 var length:number =0;

ctx.scale(2, -2);
resize(editor,ctx);

 
window.addEventListener('resize', function(){resize(editor,ctx)});



// // resize canvas
function resize(editor:GameEditor,context:CanvasRenderingContext2D) {
   //endDrawingPath()
  
   context.canvas.width = window.innerWidth / 3 * 2-30;
   context.canvas.height = window.innerHeight;
   if(!isEditor){
    if(editor.getGame().getInitSizeX() == 0){
      editor.getGame().setInitSizeX(canvas.width)
     }
     if(editor.getGame().getInitSizeY() == 0){
      editor.getGame().setInitSizeY(canvas.height)
     }
     editor.getGame().setScaleX((window.innerWidth/ 3 * 2-30)/editor.getGame().getInitSizeX())
   
     editor.getGame().setScaleY(window.innerHeight/editor.getGame().getInitSizeY())
     
   }
   
  
   reload(editor,context);
   //if (started) startDrawingPath();
// }
}



function reload(editor:GameEditor,ctx:CanvasRenderingContext2D)
{ 
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (editor.getGame().getBackground() != undefined){
    editor.getGame().getBackground().draw()
  }
 
  let num = 0
  let size = editor.getGame().getPath().getPath().length;
  while(num < size-1){
  
    let from:Point = editor.getGame().getPath().getPath()[num];
    let to:Point  = editor.getGame().getPath().getPath()[num+1];
    
    if (from.getEnd()){
      num++;
      continue;
    }
   

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#c0392b';

    ctx.moveTo(from.getX(), from.getY()); // from
    ctx.lineTo(to.getX(), to.getY()); // to
  
    length+= Math.sqrt( Math.pow((from.getX()-to.getX()), 2) + Math.pow((from.getY()-to.getY()), 2) );
    ctx.stroke(); // draw it!
    num++;
  }
  ctx.closePath()
  let tiles = editor.getGame().getTiles()
  tiles.forEach((tile:Tile) => {
    tile.drawTile(canvas,ctx,false)
    tile.drawPawns(ctx)
  })
  ctx.closePath()
  ctx.restore()
  // let pawns = editor.getGame().getPawns()
  // pawns.forEach((pawn:Pawn) =>{
  //     pawn.draw(ctx)
  // })
 
  
}

function clear(){ //toto este prerobit
  editor.getGame().getPath().setPath([]);
  //sessionStorage.points = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function elementDeleter(parent:string){
  while (document.getElementById(parent)?.lastChild!=null){
    document.getElementById(parent)?.removeChild(document.getElementById(parent)!.lastChild!)
  }
}
function calibreEventCoords(event:MouseEvent):{x:number,y:number}{
  return {x:event.offsetX,y:event.offsetY}
}





function loadGameNames(names:Array<string>){
  let root = document.getElementById('loadGameModalBody')!

  names.forEach((name:string)=>{
    let div = document.createElement('div')
    div.style.textAlign = 'left'
    let hr = document.createElement('hr')
      hr.style.margin = '5%'
      hr.style.backgroundColor = 'white'
      div.appendChild(hr)

    let p = document.createElement('paragraph')
    p.style.color = 'white'
    p.style.fontSize = '20px'
    p.style.marginLeft = '100px'
    p.textContent = name
    p.addEventListener('mouseEnter',function(){
      p.style.cursor = 'pointer'
    })
    p.addEventListener('mouseLeave',function(){
      p.style.cursor = 'default'
    })
    p.style.fontWeight = 'bold'
    
    p.onclick = function(){
      removeAllButtons()
      editorSocket.emit('load game',{id:getCookie('id'),name:name,response:true})
      $('#loadGameModal').modal('hide')
      mainMenu()
    }
  
    // let button = document.createElement('button')
    // button.textContent = 'Choose!'
    // button.classList.add('btn','btn-secondary')

    



    div.append(p)
    // div.append(button)
    root.appendChild(div)
  })


}


window.onload = function(){
  if(params.get('id') != null){
    editorSocket.emit('reload waiting room',{room:params.get('id')})
   
  }
 
}



setInterval(function(){resize(editor,ctx)},500)
export{mainMenu,doc,elementDeleter,edit,clear,canvas,ctx,calibreEventCoords,editor,reload,resize,loadGameNames};
