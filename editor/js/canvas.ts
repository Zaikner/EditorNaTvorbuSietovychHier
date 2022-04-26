
import { Point } from "./Point";
import {Tile} from './Tile.js'
import { insertTilesMenu,editTiles,deleteTiles,moveTiles, removeAllButtons, removeAllListenersAdded, moveEventHandler, pickTile, unchooseEverything } from "./TileEditor.js";
import { addComponentMenu, deleteComponentMenu, editBackground, editComponentMenu, moveComponentMenu, removeAllComponentListeners } from "./BackgroundEditor";
import {GameEditor} from './GameEditor.js'
import { io } from "socket.io-client";
import { spawnButton, spawnNumberInput, spawnParagraph, spawnSliderWithValueShower } from "./Elements";


import { Background } from "./Background";
import { initGameInfo,initDice, changeWaitingRoom, throwDice } from "./Gameplay";
import { pawnInsertMenu,pawnEditMenu,pawnDeleteMenu } from "./PawnEditor";
import { Pawn } from "./Pawn";
import { addOption, askQuestion, createQuestion, showAllQuestions ,evaluateQuestion, removeLastOption, initCreation, pickQuestion, showResults} from "./Questions";

import { PawnStyle } from "./PawnStyle";
import { Warning } from "./Warning";
import { BackgroundComponent } from "./BackgroundComponent";


let texts:Array<string> = []
const editor = new GameEditor()
const editorSocket = io();//'https://sietove-hry.herokuapp.com/'
editorSocket.emit('get texts',{language:getCookie('language')})
editorSocket.emit('loadGameNames')

//socket.emit('chat message', 'hi');
const canvas = document.createElement('canvas');
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
editorSocket.on('connected',(msg)=>{
  
  let newIds:Map<number,number> = new Map()
  let newId = 0
  msg.tiles.forEach((tile:any) =>{
    newId++;
    let addedTile = new Tile(tile.type,tile.centerX,tile.centerY,tile.x1,tile.x2,tile.y1,tile.y2,tile.radius,tile.color,tile.tileNumber)
    
     addedTile.setId(newId)
     newIds.set(tile.id,newId)
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
     addedTile.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile)

     addedTile.setSkip(tile.skip)
      addedTile.setRepeat(tile.repeat)
      addedTile.setForward(tile.forward)
      addedTile.setBackward(tile.backward)
      addedTile.setMustThrown(tile.mustThrown)
      addedTile.setTurnsToSetFree(tile.turnToSetFree)
      addedTile.setQuestionId(tile.questionId)
      let t = tile.nextTilesIds;
      let add:Map<string,number> = new Map()
      for (let i = 0; i*2 < t.length;i++){
        add.set(t[2*i],t[2*i+1])
      }
      addedTile.setNextTilesIds(add)
   
    editor.getGame().addTile(addedTile)
    
    reload(editor,ctx)
  })
  editor.setNextTileId(newId+1)
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
  msg.components.forEach((component:any)=>{
    
    let newComponent = new BackgroundComponent()
    if(component.image != 'none' || component.image != undefined){
      let image = new Image()
      image.src = component.image
      image.onload = function(){
       newComponent.setImage(image)
       background.getComponents().push(newComponent)
       reload(editor,ctx)
      }
     }

    newComponent.setType(component.type)
    newComponent.setColor(component.color)
    newComponent.setImage(component.image)
    newComponent.setImageHeight(component.imageHeigth)
    newComponent.setImageWidth(component.imageWidth)
    newComponent.setCenterX(component.centerX)
    newComponent.setCenterY(component.centerY)
    newComponent.setRadius(component.radius)
    newComponent.setStroke(component.stroke)
    newComponent.setStrokeColor(component.strokeColor)
    newComponent.setX1(component.x1)
    newComponent.setY1(component.y1)
    newComponent.setX2(component.x2)
    newComponent.setY2(component.y2)

    
  })
    
  editor.getGame().setBackground(background)
  //editor.getGame().setBackground(msg.background)

  editor.getGame().setAuthor(msg.game.author)
  editor.getGame().setName(msg.game.name)
  editor.getGame().setNumOfPlayers(msg.game.numOfPlayers)
 
  editor.getGame().setRules(msg.rules)

  let gameNextTiles = msg.game.nextTilesIds;
  let add:Map<string,number> = new Map()
  for (let i = 0; i*2 < gameNextTiles.length;i++){
    add.set(gameNextTiles[2*i],gameNextTiles[2*i+1])
  }
  editor.getGame().setNextTilesIds(add)
  
  
  let tokens:Array<string> = []
  for (let i = 1; i <= editor.getGame().getnumOfPlayers(); i++){
    tokens.push('Player '+i)
  }
  editor.getGame().setPlayerTokens(tokens)
  initGameInfo(msg.game.name)

  let i = 0
 
  msg.pawns.forEach((pawn:any) => {
    i++;
    let tile = editor.findTileById(newIds.get(pawn.tileId)!)!
  
   
     let p = new Pawn(pawn.player,tile)
     p.id = pawn.id

     editor.getGame().getPawns().push(p)
    
     //tile.getPawns().push(p)
    
    
  });
  msg.styles.forEach((style:any) => {
    
    let p = new PawnStyle(style.player,style.color,style.type)
    //p.setImage(image)
    editor.getGame().getPawnStyle().set(style.player,p)


  });
  console.log('loaded game:')
  console.log(editor)
})

editorSocket.on('react to event: forward',(msg:{value:number,pawnId:number})=>{
    editor.getGame().setIsOnTurn(true)
    let ret = editor.getGame().howManyCanMove(msg.pawnId,msg.value)
    Warning.showInGame('Event occured: Go forward!')
    editorSocket.emit('move pawns',{pawn:msg.pawnId,value:ret,room:params.get('id')})
})

editorSocket.on('react to event: backward',(msg:{value:number,pawnId:number})=>{
  console.log('recieved react to event: backward')
  editor.getGame().setIsOnTurn(true)
  let ret = editor.getGame().howManyCanMoveBack(msg.pawnId,msg.value)
  Warning.showInGame('Event occured: Go backward!')
 
  editorSocket.emit('move pawns back',{pawn:msg.pawnId,value:ret,room:params.get('id')})
})

editorSocket.on('not author',()=>{
  Warning.show('You can not create game with this name. Game with this name already exists, and you are not author of it.')
  console.log ('not author')
})
editorSocket.on('game saved',()=>{
  window.location.replace('/')
})
editorSocket.on('react to event: skip',(msg:{token:string,left:number})=>{
  Warning.showInGame('Event occured: Player '+ msg.token +' ' +'skipped his turn! Turns left to skip: ' + msg.left)
})
editorSocket.on('react to event:must Thrown',(msg:{token:string,value:number,turnsLeft:number})=>{
  Warning.showInGame('Event occured: Player '+ msg.token +' ' +'must wait '+msg.turnsLeft+'! turns or throw ' + msg.value +' to set pawn free ')
})
editorSocket.on('return pawns to starting tile',(msg:{ids:Array<number>})=>{
  msg.ids.forEach((id:number)=>{
    editor.findPawnById(id).returnToStart()
  })
  reload(editor,ctx)
})
editorSocket.on('join Room',(msg:{id:string,started:boolean})=>{
  
 
  editorSocket.emit('join player to Room',{id:getCookie('id'),roomId:msg.id})

  if (!msg.started){
    $('#waitingModal').modal('show')
    
  }
  reload(editor,ctx)
  


editorSocket.on('player joined',(msg:{msg:string})=>{
  editorSocket.emit('reload waiting room',{room:params.get('id')})
  let chat =  (<HTMLTextAreaElement>document.getElementById('chat'))!
  let chatPlaying =  (<HTMLTextAreaElement>document.getElementById("chatPlaying"))!
  if (chat.value == ''){
    chat.value =  msg.msg
  }
  else{
    chat.value = chat.value +  '\n' + msg.msg;}

  
  if (chatPlaying.value == ''){
    chatPlaying.value =  msg.msg
  }
  else{
    chatPlaying.value = chatPlaying.value +  '\n' + msg.msg;
  }
  reload(editor,ctx)
})})
editorSocket.on('player left',(msg:{msg:string})=>{
  editorSocket.emit('reload waiting room',{room:params.get('id')})
  reload(editor,ctx)
})

editorSocket.on('game started',(msg:{msg:string})=>{
 // editor.getGame().setHasStarted(true)
 $('#waitingModal').modal('hide')
  let chat =  (<HTMLTextAreaElement>document.getElementById('chat'))!
  let chatPlaying =  (<HTMLTextAreaElement>document.getElementById("chatPlaying"))!
  if (chat.value == ''){
    chat.value =  msg.msg
  }
  else{
    chat.value = chat.value +  '\n' + msg.msg;}

  
  if (chatPlaying.value == ''){
    chatPlaying.value =  msg.msg
  }
  else{
    chatPlaying.value = chatPlaying.value +  '\n' + msg.msg;
  }
})
const params = new URLSearchParams(window.location.search);

//editorSocket.emit('set Socket',{id:getCookie('id'),room:params.get('id')})

editorSocket.on('move Pawn',(msg:{pawn:number,value:number})=>{
  //msg.pawn.move(msg.value)
  console.log('recieved move Pawn')
 
 let pawn:any = (editor.getGame().movePawnById(msg.pawn,msg.value))!
  editor.setChoosenTile(undefined!)

})
editorSocket.on('move Pawn back',(msg:{pawn:number,value:number})=>{
  //msg.pawn.move(msg.value)
  console.log('recieved move Pawn back')
 
 let pawn:any = (editor.movePawnBack(msg.pawn,msg.value,true))!
  editor.setChoosenTile(undefined!)

})
editorSocket.on('return Pawn to place',(msg:{pawnId:number,tileId:number})=>{
  editor.movePawnBack(msg.pawnId,msg.tileId,false)
})
editorSocket.on('loadAnswersToOthers',(msg:{wrong:Array<string>,right:Array<string>})=>{
  showResults(msg.right,msg.wrong)
})

editorSocket.on('evaluate End',(msg:{token:string})=>{
  console.log('emitol evalued end')
  let is = editor.playerEnded(msg.token)
  if (is){
    console.log('TENTO SKONCIL')
    console.log('player')
   
  }
  editorSocket.emit('evaluated end',{token:msg.token,is:is,room:params.get('id')})
})

editorSocket.on('game has ended',(msg:{leaderboards:any})=>{
  $('#endModal').modal('show');
})

editorSocket.on('show Dice value',(msg:{value:number})=>{
  let image = new Image()
  image.src = '../../src/Dice'+msg.value+'.png'
  image.id = 'Dice'
 
  image.onload = function(){
      elementDeleter('dicePlace')
      document.getElementById('dicePlace')?.append(image)
  }
})

let isEditor = false;
let zoz = window.location.href.split('/')

editorSocket.on('got texts',(msg:{text:Array<string>})=>{
  texts = msg.text
  console.log(texts)
  if (zoz[zoz.length-2] === 'editor'){
    edit()
    
    let butt = spawnButton(document,'rulesButtons',"questionRuleButton" ,["btn","btn-secondary"],texts[35],function(){
  
      $('#rulesModal').modal('hide');
     
    })
    butt.onclick = function(){
      editor.getGame().setRules( (<HTMLTextAreaElement>document.getElementById("ruleInput"))!.value)
    }
    //document.getElementById('rulesButtons')!
   // <button type="button" class="btn btn-secondary" id="questionRuleButton" onclick="$('#rulesModal').modal('hide');">Edit Changes!</button>
    isEditor = true;
    //editor.getGame().setInitSizeX(window.innerWidth)
    //editor.getGame().setInitSizeY(window.innerHeight)
    
  }
  else {
    
    //
    
    if (params.get('id') != null){
      document.getElementById('leaveEndRoom')!.addEventListener('click',function(){window.location.replace('/gamelobby')})
      editorSocket.emit('set Socket',{id:getCookie('id'),room:params.get('id')})
      editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name'),room:params.get('id')})
      initDice()
      
    }
    else{
      
      editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
    }
    reload(editor,ctx)
    document.getElementById("leaveWaitinRoom")?.addEventListener('click',function(){
      window.location.replace('/gameLobby')
    })
    document.getElementById('startGameRoom')?.addEventListener('click',function(){
     
   
      Warning.show('Are you sure to start the Game ? After start no one will be able to join!')
     
     
    })
    document.getElementById("confirmStart")?.addEventListener('click',function(){
      editorSocket.emit('game has started',{room:params.get('id')})
    })
  
    document.getElementById('messageSubmitButton')?.addEventListener('click',function(){
      
      editorSocket.emit('chat-waitingRoom',{roomId:params.get('id'),id:getCookie('id'),msg:(<HTMLInputElement>document.getElementById('messagePlace'))!.value});
      (<HTMLInputElement>document.getElementById('messagePlace'))!.value = '';
      
      })
  
      document.getElementById('messagePlayingSubmitButton')?.addEventListener('click',function(){
      
        editorSocket.emit('chat-waitingRoom',{roomId:params.get('id'),id:getCookie('id'),msg:(<HTMLInputElement>document.getElementById('messagePlayingPlace'))!.value});
        (<HTMLInputElement>document.getElementById('messagePlayingPlace'))!.value = '';
      
        })
  }
})


editorSocket.on('wrong game name',()=>{
  Warning.show('Game with this name does not exist')
})
editorSocket.on('turn',(msg:{player:string,token:string})=>{
  console.log('recieved: turn')
  console.log(editor.getGame().getIsOnturn())
  //canvas.removeEventListener('click',pickTile)
  elementDeleter('onTurnPlace')
  spawnParagraph(document,'onTurnPlace','',texts[96]+msg.player,true)
 
  
})
editorSocket.on('turnMove',(msg:{player:string,token:string})=>{
  console.log('recieved: turn move')
  editor.getGame().setIsOnTurn(true)
  document.getElementById('Dice')?.addEventListener('click',function()
  {// let pawn = editor.getChoosenTile()!.havePawnOnTile(msg.token)
   // if (editor.getChoosenTile()!=undefined && pawn!= undefined){
   // canvas.removeEventListener('click',pickTile)
    throwDice(msg.token)}
  //}
  )
  
})
let canMovePawnFunc:(event: MouseEvent) => void;
editorSocket.on('canMovePawn',(msg:{token:string,value:number})=>{
  console.log('canMovePawn emitol token:' + msg.token)
  let can = false
  editor.getGame().getPawns().forEach((pawn:Pawn)=>{
    if (pawn.player == msg.token){
      if (pawn.canMove(msg.value)){
        can = true
      }
    }
  })
  if (can){
    canMovePawnFunc = function(event:MouseEvent){pickTile(event,msg.token,msg.value)}
    canvas.addEventListener('click',canMovePawnFunc)
  }
  else{
    Warning.showInGame('You cant move with any of your remaining pawns. You skip your turn')
    
    editorSocket.emit('evaluated end',{is:false,room:params.get('id')})
  }
  
  
})


// editorSocket.on('can throw',()=>{
//   document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
// })
editorSocket.on('add chat message',(data:{name:string,msg:string})=>{
  let chat =  (<HTMLTextAreaElement>document.getElementById('chat'))!
  let chatPlaying =  (<HTMLTextAreaElement>document.getElementById("chatPlaying"))!
  if (chat.value == ''){
    chat.value =  data.name+':'+ data.msg
  }
  else{
    chat.value = chat.value +  '\n' + data.name+':'+ data.msg;
  }

  if (chatPlaying.value == ''){
    chatPlaying.value =  data.name+':'+ data.msg
  }
  else{
    chatPlaying.value = chatPlaying.value +  '\n' + data.name+':'+ data.msg;
  }}
 )

editorSocket.on('loadedQuestions',(data)=>{showAllQuestions(data)
                                           pickQuestion(data)})
//editorSocket.on('pickQuestions',(data)=>{pickQuestion(data)})
editorSocket.on('loadedAnswerQuestions',(data)=>{
  askQuestion(data)
})
let clickFunction = function(){evaluateQuestion();}
editorSocket.on('canReactToAnswer',()=>{
  document.getElementById('answerButtonRoom')!.addEventListener('click',clickFunction)
})
editorSocket.on('add Opt',(data:any) =>{
  addOption('editQuestion',data.text,data.isAnswer,data.id)
})

editorSocket.on('reloaded waiting room',(msg)=>{
  changeWaitingRoom(msg.names)
 
})

editorSocket.on('player ended',(msg:{player:string,place:number})=>{
  editorSocket.emit('reload waiting room',{room:params.get('id')})
  Warning.showInGame(msg.player + ' finished on ' + msg.place + ' place.')
  console.log('zapol')
})
document.getElementById("showRulesButton")?.addEventListener('click',function(){
 
  $('#rulesModal').modal('show');
  (<HTMLTextAreaElement>document.getElementById("ruleInput"))!.value = editor.getGame().getRules()
 
  
})


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

function getCookie(name:string) {
  let cookie = new Map();
  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    let key:string = k.trim()
    cookie.set(key,v);
  })
  return cookie.get(name);
}


editorSocket.on('loadedGameNames',(msg:{names:Array<string>})=>{
  console.log('socket odchytil loadedGameNames')
  loadGameNames(msg.names)
})


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
export{mainMenu,doc,elementDeleter,clear,canvas,ctx,calibreEventCoords,editor,reload,editorSocket,resize,getCookie,canMovePawnFunc,clickFunction,texts};
