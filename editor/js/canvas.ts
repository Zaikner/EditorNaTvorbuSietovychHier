
import { Point } from "./Point";
import {Tile} from './Tile.js'
import { insertTilesMenu,editTiles,deleteTiles,moveTiles, removeAllButtons, removeAllListenersAdded } from "./TileEditor.js";
import { editBackground } from "./BackgroundEditor";
import {GameEditor} from './GameEditor.js'
import { io } from "socket.io-client";
import { spawnButton } from "./Elements";


import { Background } from "./Background";
import { initGameInfo,initDice } from "./Gameplay";
import { pawnInsertMenu,pawnEditMenu,pawnDeleteMenu } from "./PawnEditor";
import { Pawn } from "./Pawn";
import { addOption, askQuestion, createQuestion, showAllQuestions ,evaluateQuestion} from "./Questions";
import { removeAllListeners } from "process";
import { PawnStyle } from "./PawnStyle";
const editor = new GameEditor()
const editorSocket = io();//'https://sietove-hry.herokuapp.com/'
//socket.emit('chat message', 'hi');

editorSocket.on('connected',(msg)=>{
  msg.tiles.forEach((tile:any) =>{
    let addedTile = new Tile(tile.type,tile.centerX,tile.centerY,tile.x1,tile.x2,tile.y1,tile.y2,tile.radius,tile.color,tile.tileNumber)
  
     addedTile.setId(tile.id)
     addedTile.setStroke(tile.stroke)
     addedTile.setStrokeColor(tile.strokeColor)
     addedTile.setShape(tile.shape)
     addedTile.setIsChoosen(tile.isChoosen)
     if(tile.backgroundFile != 'none'){
      let image = new Image()
      image.src = tile.backgroundFile
      image.onload = function(){
       addedTile.setBackgroundFile(image)
       reload(editor,ctx)
      }
     }
     if(tile.patternFile != 'none'){
      let image = new Image()
      image.src = tile.patternFile
      image.onload = function(){
       addedTile.setPatternFile(image)
       reload(editor,ctx)
      }
     }
   
      //addedTile.setBackgroundFile(tile.backgroundFile)
      //addedTile.setPatternFile(tile.patternFile)
  
     addedTile.setIsEnding(tile.isEnding)
     addedTile.setIsEndingFor(tile.isEndingFor)
     addedTile.setIsStarting(tile.isStarting)
     addedTile.setIsStartingFor(tile.isStartingFor)
     addedTile.setBelongTo(tile.belongTo)
     addedTile.setCanOccupy(tile.canOccupy)
     addedTile.setToogleNumber(tile.toggleNumber)
     addedTile.setNumberingColor(tile.numberingColor)
     addedTile.setFollowingTileNumber(tile.numberOfFollowingTile)
   
    editor.getGame().addTile(addedTile)
    
    reload(editor,ctx)
  })
  let background = new Background()

  background.setColor(msg.background.color)

  if (msg.background.image!='none'){
    let backImage = new Image()
    backImage.src = msg.background.image
    backImage.onload = function(){
      background.setBackgroundImage(backImage)
      
      editor.getGame().setBackground(background)
    
      reload(editor,ctx)
    }
      
    background.setBackgroundImage(backImage)
  }
 
    
  editor.getGame().setBackground(background)
  //editor.getGame().setBackground(msg.background)

  editor.getGame().setAuthor(msg.game.author)
  editor.getGame().setName(msg.game.name)
  editor.getGame().setNumOfPlayers(msg.game.numOfPlayers)
  initGameInfo(msg.game.name)

  let i = 0
  console.log(msg.pawns)
  msg.pawns.forEach((pawn:any) => {
    i++;
    let tile = editor.findTileById(pawn.tileId)!
    
     let p = new Pawn(pawn.player,tile)
     editor.getGame().getPawns().push(p)
     tile.getPawns().push(p)
     console.log('vlozilo pawn do robka')
     console.log(i)
    
  });
  msg.styles.forEach((style:any) => {
    
    let p = new PawnStyle(style.player,style.color,style.type)
    //p.setImage(image)
    editor.getGame().getPawnStyle().set(style.player,p)

    console.log('setlo styl')
    console.log(editor.getGame().getPawnStyle().get(style.player))
  });
  //reload(editor,ctx)
  //edit()
  console.log(editor.getGame())
})

let isEditor = false;
let zoz = window.location.href.split('/')
if (zoz[zoz.length-2] === 'editor'){
  edit()
  isEditor = true;
  //editor.getGame().setInitSizeX(window.innerWidth)
  //editor.getGame().setInitSizeY(window.innerHeight)
  
}
else{
  const params = new URLSearchParams(window.location.search);


  if (params.get('id') == null){
    editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
    //editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
  }
  else{
    initDice()
    editorSocket.emit('load room-info',{room:params.get('room')})
    //editorSocket.emit('load room-game',{room:params.get('room')})
    //editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})

  }
  
}


editorSocket.on('loadedQuestions',(data)=>{showAllQuestions(data)})
editorSocket.on('loadedAnswerQuestions',(data)=>{askQuestion(data)})



function edit(){
  mainMenu();
  
document.getElementById('editBackground')!.addEventListener('click',function(){editBackground();} );
document.getElementById('insertTiles')!.addEventListener('click',function(){insertTilesMenu();} );
document.getElementById('moveTiles')!.addEventListener('click',function(){moveTiles();} );
document.getElementById('editTiles')!.addEventListener('click',function(){editTiles();} );
document.getElementById('deleteTiles')!.addEventListener('click',function(){deleteTiles();} );

document.getElementById('questionManager')!.addEventListener('click',function(){editorSocket.emit('loadQuestions');} )
//spawnButton(document,'containerAdd','dd',[],'Add Option',addOption)
document.getElementById('generalInfoButton')!.addEventListener('click',function(){
  removeAllButtons()
  removeAllListenersAdded()
  mainMenu();})

document.getElementById('answerButton')!.addEventListener('click',function(){evaluateQuestion();})
document.getElementById('setAnswerButton')!.addEventListener('click',function(){editorSocket.emit('answerQuestion',{id:7})})
document.getElementById('addButton')!.addEventListener('click',function(){addOption();})
document.getElementById('questionSubmitButton')!.addEventListener('click',function(){createQuestion();})
document.getElementById('insertPawn')!.addEventListener('click',function(){pawnInsertMenu()} );
document.getElementById('editPawn')!.addEventListener('click',function(){pawnEditMenu()} );
document.getElementById('deletePawn')!.addEventListener('click',function(){pawnDeleteMenu()} );
}

var doc = document;
const canvas = document.createElement('canvas');


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
text.textContent = 'Počet hráčov:'
document.getElementById("numOfPlayersPlace")!.appendChild(text);
document.getElementById("numOfPlayersPlace")!.appendChild(numShower);

numOfPlayersSlider.oninput =function(){
  document.getElementById("numShower")!.textContent =numOfPlayersSlider.value ;
  editor.getGame().setNumOfPlayers(parseInt(numOfPlayersSlider.value))
  let number =  parseInt(numOfPlayersSlider.value)
  let playerTokens = editor.getGame().getPlayerTokens()
  if (number < playerTokens.length){
    for (let i = 0; i < playerTokens.length - number;i++){
      playerTokens.pop()
      editor.getGame().getPawnStyle().delete('Player '+(playerTokens.length))
     
    }
  }
  if (number > playerTokens.length){
    for (let i = 0; i < number - playerTokens.length;i++){
      playerTokens.push('Player '+ (playerTokens.length+1))
      
      editor.getGame().getPawnStyle().set('Player '+(playerTokens.length),new PawnStyle('Player '+(playerTokens.length),'#000000','type1'))
     
      //editor.getGame().getPawnStyle().Player
    }
  }
 
  editor.getGame().setPlayerTokens(playerTokens)
}
document.getElementById("numOfPlayersPlace")!.appendChild(numOfPlayersSlider);

let gameName:HTMLInputElement = document.createElement('input')
gameName.id = 'gameName'
gameName.value = editor.getGame().getName()
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
  //window.location.replace('/')
})
}


 

 var length:number =0;
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
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
      editor.getGame().setInitSizeX(window.innerWidth/ 3 * 2-30)
     }
     if(editor.getGame().getInitSizeY() == 0){
      editor.getGame().setInitSizeY(window.innerHeight)
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

function getCookie(name:string) {
  let cookie = new Map();
  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    let key:string = k.trim()
    cookie.set(key,v);
  })
  return cookie.get(name);
}
$('#addButton').on('load', function() {
  console.log('tototottoott')}
  //document.getElementById('addButton')!.addEventListener('click',addOption)}
  )

export{mainMenu,doc,elementDeleter,clear,canvas,ctx,calibreEventCoords,editor,reload,editorSocket,resize};
