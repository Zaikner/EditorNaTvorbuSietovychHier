
import { Point } from "./Point";
import {Tile} from './Tile.js'
import { insertTilesMenu,editTiles,deleteTiles,moveTiles } from "./TileEditor.js";
import { editBackground } from "./BackgroundEditor";
import {GameEditor} from './GameEditor.js'
import { io } from "socket.io-client";
require("dotenv").config('.env');


const socket = io('http://sietove-hry.herokuapp.com');
socket.emit('chat message', 'hi');
socket.on('chat message', function(msg) {
console.log('pekne sa mi odzdravil')
});
var doc = document;
const canvas = document.createElement('canvas');
const editor = new GameEditor()
document.getElementById("canvasPlace")!.appendChild(canvas);

let started:Boolean = false;

document.getElementById('editBackground')!.addEventListener('click',function(){editBackground();} );
document.getElementById('insertTiles')!.addEventListener('click',function(){insertTilesMenu();} );
document.getElementById('moveTiles')!.addEventListener('click',function(){moveTiles();} );
document.getElementById('editTiles')!.addEventListener('click',function(){editTiles();} );
document.getElementById('deleteTiles')!.addEventListener('click',function(){deleteTiles();} );

mainMenu();

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


}


 

 var length:number =0;
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
resize();

 
window.addEventListener('resize', resize);



// // resize canvas
function resize() {
   //endDrawingPath()
   ctx.canvas.width = window.innerWidth / 3 * 2-30;
   ctx.canvas.height = window.innerHeight;
   reload();
   //if (started) startDrawingPath();
// }
}



function reload()
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

export{mainMenu,doc,elementDeleter,clear,canvas,ctx,calibreEventCoords,editor,reload};
