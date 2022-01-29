//const TileEditor = require('./TileEditor.js')
//const PathEditor = require('./PathEditor.js')
import { Point } from "./Point";
import {Tile} from './Tile.js'
//import {Socket} from "./../../services/socket/Socket.js" --nemaz ale spojazdni
import { insertTilesMenu,editTiles,deleteTiles,moveTiles } from "./TileEditor.js";
import { editBackground } from "./BackgroundEditor";
import { Background } from "./Background";
import { editTrack } from "./PathEditor";
import {GameEditor} from './GameEditor.js'
import { io } from "socket.io-client";
//const socket = io('http://localhost:8001')

//socket.emit("greetings","Hello!")

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
  document.getElementById("numShower")!.textContent = numOfPlayersSlider.value;
}
document.getElementById("numOfPlayersPlace")!.appendChild(numOfPlayersSlider);

let gameName:HTMLInputElement = document.createElement('input')
gameName.id = 'gameName'

text = document.createElement('p')
text.textContent = 'Názov hry:'
document.getElementById("gameNamePlace")!.appendChild(text);

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
   ctx.canvas.height = window.innerHeight - 70;
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
  return {x:event.clientX-18,y:event.clientY-54}
}


export{mainMenu,doc,elementDeleter,clear,canvas,ctx,calibreEventCoords,editor,reload};


  // ///
  // let u = {x:(to.getX() - from.getX())/10,y:(to.getY() - from.getY())/10}
  // let newPoint= new Point(from.getX(),from.getY(),false)
  // let t = 0.1
  // console.log('zaciatok'+'x: '+newPoint.getX()+' y: '+newPoint.getY())
  // //console.log('dufany koniec'+'x: '+to.getX()+' y: '+to.getY())
  // while (Math.sqrt( Math.pow((newPoint.getX()-to.getX()), 2) + Math.pow((newPoint.getY()-to.getY()), 2) ) > 1){
  //   newPoint.setX(from.getX()+t*u.x) 
  //   newPoint.setY(from.getY()+t*u.y)
  //   if (newPoint.getX()%1 == 0){
  //     console.log(Math.sqrt( Math.pow((newPoint.getX()-to.getX()), 2) + Math.pow((newPoint.getY()-to.getY()), 2) ))
  //     console.log('novy'+'x: '+newPoint.getX()+' y: '+newPoint.getY())
  //   }
  //   t+=0.1
  // }
  // console.log('koniec'+'x: '+newPoint.getX()+' y: '+newPoint.getY())