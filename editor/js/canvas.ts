
import { Point } from "./Point";
import {Tile} from './Tile.js'
import {editTiles,deleteTiles,moveTiles, removeAllButtons, removeAllListenersAdded, moveEventHandler, pickTile, unchooseEverything, startInsertingByOne, copyNextTileMap, update } from "./TileEditor.js";
import { addComponentMenu, deleteComponentMenu, editBackground, editComponentMenu, moveComponentMenu, removeAllComponentListeners } from "./BackgroundEditor";

import { spawnButton, spawnHeading, spawnNumberInput, spawnParagraph, spawnSliderWithValueShower,spawnCheckerWithValueShower, spawnCheckerWithLabel } from "./Elements";

import { pawnInsertMenu,pawnEditMenu,pawnDeleteMenu } from "./PawnEditor";
import { Pawn } from "./Pawn";
import { addOption, askQuestion, createQuestion, showAllQuestions ,evaluateQuestion, removeLastOption, initCreation, pickQuestion, showResults} from "./Questions";

import { PawnStyle } from "./PawnStyle";

import { editorSocket, isEditor,getCookie,texts } from "./clientSocket";
import { Warning } from "./Warning";
import { Game } from "./Game";



let game = new Game()
initNewGame()
const params = new URLSearchParams(window.location.search);


//socket.emit('chat message', 'hi');
const canvas = document.createElement('canvas');
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");





function initNewGame(){
        game = new Game()
        
        game.getPlayerTokens().forEach((token:string)=>{
            game.getNextTilesIds().set(token,2)
        })
    }   



function edit(){
  mainMenu();

// document.getElementById('nextTileButtonSet')?.addEventListener('click',function(){
//   updateNextTileIds()
// })

document.getElementById('randomQuestionID')?.addEventListener('click',function(){
  if (Array.from(game.getQuestions().entries()).length >0){
    game.setEvents('random',{num:0,value:0})
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    elementDeleter('askTheQuestionEventEdit')
    document.getElementById('pickedEventParagraph')!.textContent =texts[201]
    update()
  }
  else{
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    Warning.show(texts[202])
  }
 
 
})
document.getElementById('noneButton')!.addEventListener('click',function(){

    game.setEvents('none',{num:0,value:0})
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    elementDeleter('askTheQuestionEventEdit')
    document.getElementById('pickedEventParagraph')!.textContent =texts[197]
    update()
})
document.getElementById('forwardButton')!.addEventListener('click',function(){
  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[97],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    game.setEvents('forward',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    elementDeleter('askTheQuestionEventEdit')
    //document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[99] +' ' + nums +' ' + texts[100]
    update()
  })
})
document.getElementById('backwardButton')!.addEventListener('click',function(){
  
  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[102],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    game.setEvents('backward',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    elementDeleter('askTheQuestionEventEdit')
  
    
    //document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[103] +' ' + nums +' ' + texts[100]
    update()
  })
})
document.getElementById('skipButton')!.addEventListener('click',function(){

  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[104],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    game.setEvents('skip',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    elementDeleter('askTheQuestionEventEdit')
    //document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[105] +' ' + nums +' ' + texts[100]
    update()
  })
  
})
document.getElementById('repeatButton')!.addEventListener('click',function(){
 
  elementDeleter('askTheQuestionEventEdit')
  spawnParagraph(document,'askTheQuestionEventEdit','',texts[106],true)
  spawnButton(document,'askTheQuestionEventEdit','',['btn','btn-secondary'],texts[101],function(){
    let nums = (<HTMLInputElement>document.getElementById('howManytimes'))!.value
    game.setEvents('repeat',{num:parseInt(nums),value:0})
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    elementDeleter('askTheQuestionEventEdit')
    //document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[107] +' ' + nums +' ' + texts[100]
    update()
    
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
    game.setEvents('stop',{num:parseInt(nums),value:parseInt(freeInput.value)})
    $('#editEventModal').modal('hide')
    $('#EventModal').modal('hide')
    
    elementDeleter('askTheQuestionEventEdit')
   
    
    //document.getElementById('bindEvent')!.textContent = texts[98]
    document.getElementById('pickedEventParagraph')!.textContent =texts[110] + freeInput.value +texts[111] + nums + texts[100];
    update()
  })
  
});

  //$('#rulesModal').modal('show');
document.getElementById('editBackground')!.addEventListener('click',function(){
  unchooseEverything()
  editBackground();} );
document.getElementById('insertTiles')!.addEventListener('click',function(){
  unchooseEverything()
  startInsertingByOne();} );
// document.getElementById('moveTiles')!.addEventListener('click',function(){
//   unchooseEverything()
//   moveTiles();} );
// document.getElementById('editTiles')!.addEventListener('click',function(){
//   unchooseEverything()
//   editTiles();} );
// document.getElementById('deleteTiles')!.addEventListener('click',function(){deleteTiles();} );

document.getElementById('questionManager')!.addEventListener('click',function(){elementDeleter('listContainer')
                                                                                editorSocket.emit('loadQuestions',{id:localStorage.getItem('id'),pick:false});} )
// document.getElementById('questionSubmitButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )
// document.getElementById('questionEditButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )

//spawnButton(document,'containerAdd','dd',[],'Add Option',addOption)
document.getElementById('generalInfoButton')!.addEventListener('click',function(){
  removeAllButtons()
  removeAllListenersAdded()
  mainMenu();})
// document.getElementById('addComponent')?.addEventListener('click',function(){addComponentMenu()})
// document.getElementById('editComponent')?.addEventListener('click',function(){editComponentMenu()})
// document.getElementById('moveComponent')?.addEventListener('click',function(){moveComponentMenu()})
// document.getElementById('deleteComponent')?.addEventListener('click',function(){deleteComponentMenu()})
  
//document.getElementById('setAnswerButton')!.addEventListener('click',function(){editorSocket.emit('answerQuestion',{id:0})})
document.getElementById('addButtonInsert')!.addEventListener('click',function(){addOption('questionOptions','',false);})
document.getElementById('addButtonEdit')!.addEventListener('click',function(){addOption('editQuestion','',false);})
document.getElementById('createQuestionButtonModal')!.addEventListener('click',function(){initCreation();
                                                                                                      })
document.getElementById('deleteGameButton')!.addEventListener('click',function(){
 editorSocket.emit('deleteGame',{id:localStorage.getItem('id'),name:game.getName()})
  window.location.replace('/editor')
})
//document.getElementById('removeButtonInsert')!.addEventListener('click',function(){removeLastOption('questionOptions');})
//document.getElementById('removeButtonEdit')!.addEventListener('click',function(){removeLastOption('editQuestion');})
document.getElementById('nextTileButtonSet')?.addEventListener('click',function(){
  game.getPlayerTokens().forEach((token:string)=>{
    let input =(<HTMLInputElement>document.getElementById('nextTile'+token))!.value
    // if (game.getChoosenTile()!=undefined){
    game.getNextTilesIds().set(token,parseInt(input))
  })
  if (game.getChoosenTile()!= undefined){
    game.getChoosenTile()?.setNextTilesIds(copyNextTileMap())
  }

})
document.getElementById('questionSubmitButton')!.addEventListener('click',function(){createQuestion(-1);})
document.getElementById('eventQuestionButton')!.addEventListener('click',function(){
  editorSocket.emit('loadQuestions',{id:localStorage.getItem('id'),pick:true})
  $('#pickQuestionModal').modal('show');
})

document.getElementById('loadCreatedGameModal')?.addEventListener('click',function(){
  let val = (<HTMLInputElement>document.getElementById('gameNameInput'))!.value
  removeAllButtons()
  editorSocket.emit('load game',{id:getCookie('id'),name:val,response:true})
 
  mainMenu()
  
})
document.getElementById('loadGameButton')?.addEventListener('click',function(){
  editorSocket.emit('loadGameNames',{id:localStorage.getItem('id')})
})


document.getElementById('editPawn')!.addEventListener('click',function(){pawnEditMenu()} );

// document.getElementById("resetQuestionID")!.addEventListener('click',function(){
//   game.setQuestionId(-1);
//   (<HTMLButtonElement>document.getElementById('bindQuestion'))!.textContent = texts[114]
 
// })
 }

var doc = document;



document.getElementById("canvasPlace")!.appendChild(canvas);

let started:Boolean = false;




function mainMenu(){ 
  
 started = false

spawnHeading(document,'buttonPlace','',texts[21])
let numOfPlayersSlider:HTMLInputElement = document.createElement('input')
numOfPlayersSlider.type = 'range'
numOfPlayersSlider.id = 'numOfPlayers';
numOfPlayersSlider.value = game.getnumOfPlayers().toString()
numOfPlayersSlider.min = '1';
numOfPlayersSlider.max = '6';
numOfPlayersSlider.step = '1';


let numShower = document.createElement('paragraph');
numShower.id = 'numShower'
numShower.textContent = game.getnumOfPlayers().toString()
let text = document.createElement('p')
text.textContent = texts[22]
document.getElementById("numOfPlayersPlace")!.appendChild(text);
document.getElementById("numOfPlayersPlace")!.appendChild(numShower);

numOfPlayersSlider.onclick =function(){
  document.getElementById("numShower")!.textContent =numOfPlayersSlider.value ;
  game.setNumOfPlayers(parseInt(numOfPlayersSlider.value))
  let number =  parseInt(numOfPlayersSlider.value)
  let playerTokens = game.getPlayerTokens()
  if (number < playerTokens.length){
  
    for (let i = number; i <= 6;i++){
      playerTokens.pop()
      game.getPawnStyle().delete('Player '+i)
      game.getNextTilesIds().delete('Player '+i)
      let rem:Array<Pawn> = []
      game.getPawns().forEach((pawn:Pawn)=>{
        if (pawn.player == ('Player '+i)){
          rem.push(pawn)
        }
      })
      rem.forEach((pawn:Pawn)=>{
        game.removePawn(pawn)
        pawn.tile.removePawn(pawn)
      })
    }
  }
  if (number > playerTokens.length){
    for (let i = 1; i <= number;i++){
      if (!playerTokens.includes('Player '+i)){
        playerTokens.push('Player '+ (playerTokens.length+1))
        game.getNextTilesIds().set('Player '+i,game.getTiles().length+1)
        game.getPawnStyle().set('Player '+i,new PawnStyle('Player '+i,'#000000','type1'))
       
      }
     
      //game.getPawnStyle().Player
    }
  }
  //spawnParagraph(doc,"tileEditingPlace",'',texts[137],true)
  //spawnCheckerWithValueShower(doc,"tileEditingPlace",'toogleNumberingChecker',false,[texts[92],texts[93]])
  
  game.setPlayerTokens(playerTokens)
  reload(game,ctx)
}
document.getElementById("numOfPlayersPlace")!.appendChild(numOfPlayersSlider);

let gameName:HTMLInputElement = document.createElement('input')
gameName.id = 'gameName'
gameName.value = game.getName()
text = document.createElement('p')
text.textContent = texts[23]
document.getElementById("gameNamePlace")!.appendChild(text);
gameName.oninput =function(){
  game.setName(gameName.value.trim())
  
}
document.getElementById("gameNamePlace")!.appendChild(gameName);

let gameType:HTMLSelectElement = document.createElement('select');
gameType.id = 'gameType'

// text = document.createElement('p')
// text.textContent = 'Typ hry:'
// document.getElementById("gameTypePlace")!.appendChild(text);
// document.getElementById("gameTypePlace")!.appendChild(gameType);

//spawnParagraph(document,'tileEditingPlace','',texts[112],true)
let slid = spawnSliderWithValueShower(document,'tileEditingPlace','pawnNumberSlider',texts[112],'1','4','1',game.getNumberOfStartingPawns().toString())
slid.style.width = '100%'
slid.onchange = function(){
  let max = parseInt(slid!.value)
  if (max > game.getNumberOfStartingPawns()){
    game.getPlayerTokens().forEach((player:string) => {
      for (let i = 0;i<(max-game.getNumberOfStartingPawns());i++){
        game.getTiles().forEach((tile:Tile)=>{
          if (tile.getIsStartingFor().includes(player)){
            let newPawn = new Pawn(player,tile)
    
            game.getPawns().push(newPawn)
          }
        })
      }
  })
    
  }
  else{
    game.getPlayerTokens().forEach((player:string) => {
      let num = 0
      let rem:Array<Pawn> = []
      //EDITOR PRECHADZAT CEZ TILES A NIE CEZ PAWN BOA
      game.getTiles().forEach((tile:Tile)=>{
        num = 0
        tile.getPawns().forEach((pawn:Pawn)=>{
          if (pawn.player == player){
                    num++;
                    if (num > max){
                      rem.push(pawn)
                    }
                  }
                  rem.forEach((pawn:Pawn)=>{
                          game.removePawn(pawn)
                          pawn.tile.removePawn(pawn)
                        })
        })
      })
      
  //     game.getPawns().forEach((pawn:Pawn)=>{
  //       if (pawn.player == player){
  //         num++;
  //         if (num > max){
  //           rem.push(pawn)
  //         }
  //       }
  //     })
  //     rem.forEach((pawn:Pawn)=>{
  //       game.removePawn(pawn)
  //       pawn.tile.removePawn(pawn)
  //     })
     });
   }
  game.setNumberOfStartingPawns(max)
  

 
  reload(game,ctx)
}
let numbering = spawnCheckerWithLabel(doc,'tileEditingPlace','toogleNumberingChecker',texts[137],game.getToogleNumber(),[texts[92],texts[93]])

numbering.onchange = function(){
  if (numbering.checked){
    game.setToogleNumber(true)
  }
  else{
    game.setToogleNumber(false)
  }
}
spawnButton(document,'tileEditingPlace','savaGameButton',["btn","btn-dark"],texts[113],function(){
  let numOfFinishTiles = game.numberOfFinishingTilesPerToken();
  let numOfPawnsPerPlayers = game.numberOfPawnsPerPlayer()
  let ret = false;
  
  game.getPlayerTokens().forEach((token:string)=>{
    if (numOfFinishTiles.get(token)! > numOfPawnsPerPlayers.get(token)!){
      ret = true
    }
  })
  if (game.checkIfAllPlayersHaveFinishTile().length > 0){
    Warning.show(texts[183])
  }
  else if (game.checkIfAllPlayersHaveStartingTile().length >0){
    Warning.show(texts[184])
  }
  else if (ret){
    Warning.show(texts[209])
  }
  else{

    game.saveGame()
    Warning.show(texts[249])
  }
  
  //window.location.replace('/')
})

let button = spawnButton(document,'tileEditingPlace','publishGame',['btn','btn-dark'],texts[181],function(){
  if (!game.getIsPublished()){
   
    let numOfFinishTiles = game.numberOfFinishingTilesPerToken();
    let numOfPawnsPerPlayers = game.numberOfPawnsPerPlayer()
    let ret = false;
    
    game.getPlayerTokens().forEach((token:string)=>{
      if (numOfFinishTiles.get(token)! > numOfPawnsPerPlayers.get(token)!){
        ret = true
      }
    })
    if (game.checkIfAllPlayersHaveFinishTile().length > 0){
      Warning.show(texts[183])
    }
    else if (game.checkIfAllPlayersHaveStartingTile().length >0){
      Warning.show(texts[184])
    }
    else if (ret){
      Warning.show(texts[209])
    }
    else{
      button.textContent = texts[258]
      game.setIsPublished(true)
      game.saveGame()
      Warning.show(texts[250])
    }
  }
  else{
    game.setIsPublished(false)
    editorSocket.emit('make game not published',{id:localStorage.getItem('id'),name:game.getName()})
    button.textContent =texts[181]
    Warning.show(texts[259])
  }
 
 
})
}


 

 var length:number =0;

//ctx.scale(2, -2);
resize(game,ctx);

 
window.addEventListener('resize', function(){resize(game,ctx)});



// // resize canvas
function resize(editor:Game,context:CanvasRenderingContext2D) {
   context.canvas.width = window.innerWidth/ 3 * 2-30
   context.canvas.height = window.innerHeight;
   //if(!isEditor){
    if(game.getInitSizeX() == 0){
      game.setInitSizeX(canvas.width)
     }
     if(game.getInitSizeY() == 0){
      game.setInitSizeY(canvas.height)
     }
     
     game.setScaleX(canvas.width/game.getInitSizeX())
     game.setScaleY((canvas.height-20)/game.getInitSizeY())
  
   reload(editor,context);
  
}



function reload(editor:Game,ctx:CanvasRenderingContext2D)
{ 
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (game.getBackground() != undefined){
    game.getBackground().draw()
  }
 
  let num = 0
  let size = game.getPath().getPath().length;
  while(num < size-1){
  
    let from:Point = game.getPath().getPath()[num];
    let to:Point  = game.getPath().getPath()[num+1];
    
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
  let tiles = game.getTiles()
  tiles.forEach((tile:Tile) => {
    tile.drawTile(canvas,ctx,false)
    tile.drawPawns(ctx)
  })
  ctx.closePath()
  ctx.restore()
  // let pawns = game.getPawns()
  // pawns.forEach((pawn:Pawn) =>{
  //     pawn.draw(ctx)
  // })
 
  
}

function clear(){ //toto este prerobit
  game.getPath().setPath([]);
  //sessionStorage.points = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function elementDeleter(parent:string){
  while (document.getElementById(parent)?.lastChild!=null){
    document.getElementById(parent)?.removeChild(document.getElementById(parent)!.lastChild!)
  }
}
function calibreEventCoords(event:MouseEvent):{x:number,y:number}{
  //console.log({x:event.offsetX*game.getScaleX(),y:event.offsetY*game.getScaleY()})
  //console.log({x:event.offsetX,y:event.offsetY})
  return {x:event.offsetX,y:event.offsetY}
}

window.onload = function(){
  if(params.get('id') != null){
    editorSocket.emit('reload waiting room',{room:params.get('id')})
   
  }
 
}



setInterval(function(){resize(game,ctx)},500)
export{mainMenu,doc,elementDeleter,edit,clear,canvas,ctx,calibreEventCoords,game,reload,resize,initNewGame};
