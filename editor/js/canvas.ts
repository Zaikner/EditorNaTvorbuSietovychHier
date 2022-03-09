
import { Point } from "./Point";
import {Tile} from './Tile.js'
import { insertTilesMenu,editTiles,deleteTiles,moveTiles } from "./TileEditor.js";
import { editBackground } from "./BackgroundEditor";
import {GameEditor} from './GameEditor.js'

import { spawnButton } from "./Elements";


import { Background } from "./Background";
const editorSocket='undefined'
// const editorSocket = io('http://sietove-hry.herokuapp.com/');//http://sietove-hry.herokuapp.com/
// //socket.emit('chat message', 'hi');
// import { io } from "socket.io-client";
// editorSocket.on('connected',(msg)=>{
//   console.log('Editor client connected')
//   console.log(msg)
//   msg.tiles.forEach((tile:any) =>{
//     let addedTile = new Tile(tile.type,tile.centerX,tile.centerY,tile.x1,tile.x2,tile.y1,tile.y2,tile.radius,tile.color,tile.tileNumber)
  
    
//      addedTile.setStroke(tile.stroke)
//      addedTile.setStrokeColor(tile.strokeColor)
//      addedTile.setShape(tile.shape)
//      addedTile.setIsChoosen(tile.isChoosen)
//      let image = new Image()
//      image.src = msg.background.image
//      image.onload = function(){
//       addedTile.setBackgroundFile(image)
//       reload(editor,ctx)
//      }
//       //addedTile.setBackgroundFile(tile.backgroundFile)
//       //addedTile.setPatternFile(tile.patternFile)
  
//      addedTile.setIsEnding(tile.isEnding)
//      addedTile.setIsEndingFor(tile.isEndingFor)
//      addedTile.setIsStarting(tile.isStarting)
//      addedTile.setIsStartingFor(tile.isStartingFor)
//      addedTile.setBelongTo(tile.belongTo)
//      addedTile.setCanOccupy(tile.canOccupy)
//      addedTile.setToogleNumber(tile.toggleNumber)
//      addedTile.setNumberingColor(tile.numberingColor)
//      addedTile.setFollowingTileNumber(tile.numberOfFollowingTile)
   
//     editor.getGame().addTile(addedTile)
//   })
//   let background = new Background()
//   background.setColor(msg.background.color)
//   let backImage = new Image()
//   backImage.src = msg.background.image
//   backImage.onload = function(){
//     background.setBackgroundImage(backImage)
    
//     editor.getGame().setBackground(background)
//     console.log('obrazok ready')
//     reload(editor,ctx)
//   }
    
//   background.setBackgroundImage(backImage)
    
//   console.log(background)
//   console.log('sprava je pod')
//   console.log(msg.background)
//   console.log('farba je: '+msg.background.color)
//   editor.getGame().setBackground(background)
//   //editor.getGame().setBackground(msg.background)

//   editor.getGame().setAuthor(msg.game.author)
//   editor.getGame().setName(msg.game.name)
//   editor.getGame().setNumOfPlayers(msg.game.numOfPlayers)
//   //reload(editor,ctx)
//   //edit()
// })


// //editorSocket.on('connected',()=>{console.log('pripojil Client Editor!')})

// if (window.location.href === 'http://localhost:8001/editor/'){
//   edit()
// }
// else{
//   const params = new URLSearchParams(window.location.search);
//   editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
  
// }

// editorSocket.on('loaded game',()=>{
//   console.log('Editor client connected')
//   //edit()
// })
function edit(){
  mainMenu();
document.getElementById('editBackground')!.addEventListener('click',function(){editBackground();} );
document.getElementById('insertTiles')!.addEventListener('click',function(){insertTilesMenu();} );
document.getElementById('moveTiles')!.addEventListener('click',function(){moveTiles();} );
document.getElementById('editTiles')!.addEventListener('click',function(){editTiles();} );
document.getElementById('deleteTiles')!.addEventListener('click',function(){deleteTiles();} );}
var doc = document;
const canvas = document.createElement('canvas');
const editor = new GameEditor()
document.getElementById("canvasPlace")!.appendChild(canvas);

let started:Boolean = false;




function mainMenu(){ 
 started = false


let numOfPlayersSlider:HTMLInputElement = document.createElement('input')
numOfPlayersSlider.type = 'range'
numOfPlayersSlider.id = 'numOfPlayers';
numOfPlayersSlider.value = '2'
numOfPlayersSlider.min = '1';
numOfPlayersSlider.max = '6';
numOfPlayersSlider.step = '1';


let numShower = document.createElement('paragraph');
numShower.id = 'numShower'
numShower.textContent = '2'
let text = document.createElement('p')
text.textContent = 'Počet hráčov:'
document.getElementById("numOfPlayersPlace")!.appendChild(text);
document.getElementById("numOfPlayersPlace")!.appendChild(numShower);

numOfPlayersSlider.oninput =function(){
  document.getElementById("numShower")!.textContent =numOfPlayersSlider.value ;
  editor.getGame().setNumOfPlayers(parseInt(numOfPlayersSlider.value))
  let playerTokens = []
  for (let i = 1; i <= parseInt(numOfPlayersSlider.value); i++){
    playerTokens.push('Player '+i)
  }
  editor.getGame().setPlayerTokens(playerTokens)
}
document.getElementById("numOfPlayersPlace")!.appendChild(numOfPlayersSlider);

let gameName:HTMLInputElement = document.createElement('input')
gameName.id = 'gameName'

text = document.createElement('p')
text.textContent = 'Názov hry:'
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

spawnButton(document,'tileEditingPlace','savaGameButton',["btn","btn-dark"],'Save game to database!',function(){
  editor.getGame().saveGame()
  window.location.replace('/')
})
}


 

 var length:number =0;
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
resize(editor,ctx);

 
window.addEventListener('resize', function(){resize(editor,ctx)});



// // resize canvas
function resize(editor:GameEditor,context:CanvasRenderingContext2D) {
   //endDrawingPath()
   context.canvas.width = window.innerWidth / 3 * 2-30;
   context.canvas.height = window.innerHeight;
   reload(editor,context);
   //if (started) startDrawingPath();
// }
}



function reload(editor:GameEditor,ctx:CanvasRenderingContext2D)
{ 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log(editor.getGame().getBackground())
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
    //console.log(from);
    //console.log(to);

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

  let tiles = editor.getGame().getTiles()
  tiles.forEach((tile:Tile) => {
    tile.drawTile(canvas,ctx)
  })
  
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

function getCookie(name:string) {
  let cookie = new Map();
  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    let key:string = k.trim()
    cookie.set(key,v);
  })
  return cookie.get(name);
}
export{mainMenu,doc,elementDeleter,clear,canvas,ctx,calibreEventCoords,editor,reload,editorSocket,resize};
