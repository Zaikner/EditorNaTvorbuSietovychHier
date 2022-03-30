import {mainMenu,elementDeleter,doc,canvas,ctx,calibreEventCoords, editor, reload} from './canvas.js'

import { Tile } from './Tile.js';
import { Point } from './Point.js';
import {removeAllButtons,removeAllListenersAdded,spawnElements,spawnTile,undoTileInsert,saveInsertingTiles, showActualState} from './TileEditor.js'
import { spawnButton } from './Elements.js';

var can = false
function editTrack(){
  editor.nullEditor()
  removeAllButtons()
  removeAllListenersAdded()
    spawnButton(doc,"buttonPlace",'start',["btn","btn-dark"],'Start Inserting!',startDrawingPath) 
    spawnButton(doc,"buttonPlace",'spawn',["btn","btn-dark"],'Spawn Tiles!',spawnTiles)
    spawnButton(doc,"buttonPlace",'end',["btn","btn-dark"],'End Inserting!',endDrawingPath)   
    spawnElements()
    spawnButton(doc,"buttonPlace",'undoButton',["btn","btn-dark"],'Undo last Tile/s added!',undoTileInsert) 
    spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],'Save!',saveInsertingTiles)
    showActualState()
  }

  
function saveEditingTrack(){
    endDrawingPath()
    //if (sessionStorage.points === '' || sessionStorage.points == null){
      if (editor.getGame().getPath().getPath()== []){
    //socket.emit('saveEditingTrack',{lenght:length,points:editor.getGame().getPath().getPath(),type:(<HTMLSelectElement>document.getElementById('Select')).value})
    
    }
    elementDeleter('buttonPlace')
   
    mainMenu();
  }

  function startDrawingPath():void{
    editor.getGame().getPath().setPath([]);
    reload(editor,ctx)
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', setPosition);
    canvas.addEventListener('mouseenter', setPosition);
   
  }
  function endDrawingPath():void{
    editor.getGame().getPath().setPath([]);
    reload(editor,ctx)
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mousedown', setPosition);
    canvas.removeEventListener('mouseenter', setPosition);
  }
  var pos:{x:number,
    y:number,
  end:boolean} = {x:0,y:0,end:false};
  
   function setPosition(event:MouseEvent) {
     let coords = calibreEventCoords(event);
     if (coords.x < 0){
       pos.x = 0
   }
   else if (coords.x > ctx.canvas.width){
       pos.x = ctx.canvas.width
   }
   else{
     pos.x = coords.x
   }
   if (coords.y < 0){
     pos.y = 0
   }
   else if (coords.y > ctx.canvas.height){
     pos.y = ctx.canvas.height
   }
   else{
     pos.y = coords.y
   }
   }
  function draw(event:MouseEvent) {
    if (event.buttons !== 1) return;
    let coords = calibreEventCoords(event);
   
    editor.getGame().getPath().add(new Point(coords.x,coords.y,pos.end))
  
    if (editor.getGame().getPath().getPath().length == 1){
      ctx.moveTo(coords.x,coords.y);
      return;
    } 
    ctx.beginPath(); 
    
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#c0392b';
  
    ctx.moveTo(pos.x, pos.y); 
    setPosition(event); 
    ctx.lineTo(pos.x, pos.y); 
  
    ctx.stroke(); 
    //socket.emit('skuska');
  }
  function spawnTiles(){
    let spawnedTiles:Array<Tile> = []
    editor.getGame().getPath().getPath().forEach((point:Point) => {
      canSpawn(point.getX(),point.getY())
      if (can == true){
        spawnedTiles.push(spawnTile({x:point.getX(),y:point.getY()}))
        console.log(editor.getGame().getTiles().length)
      }})
    endDrawingPath()
    editor.addToUndoLog(spawnedTiles)
    }


  function canSpawn(x:number,y:number){
    can = true
    editor.getGame().getTiles().forEach((tile:Tile) => {
      if (Math.sqrt( Math.pow((x-tile.getCenterX()), 2) + Math.pow((y-tile.getCenterY()), 2)) <= 2*tile.getRadius()){
        can = false
      }
      return 
      


    })
    
  }


 
export {editTrack,saveEditingTrack,endDrawingPath}


