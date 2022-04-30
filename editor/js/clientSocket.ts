import { io } from "socket.io-client";
import { Background } from "./Background";
import { BackgroundComponent } from "./BackgroundComponent";
import { ctx, reload,editor, elementDeleter, canvas, edit, clear } from "./canvas";
import { spawnButton, spawnParagraph } from "./Elements";
import { Game } from "./Game";
import { loadGameMenu } from "./gameLoader";
import { changeWaitingRoom, initDice, initGameInfo, throwDice } from "./Gameplay";
import { Pawn } from "./Pawn";
import { PawnStyle } from "./PawnStyle";
import { addOption, askQuestion, evaluateQuestion, pickQuestion, showAllQuestions, showResults } from "./Questions";
import { rulesMenu } from "./Rules";
import { Tile } from "./Tile";
import { pickTile } from "./TileEditor";
import { Warning } from "./Warning";

let texts:Array<string> = []
let isEditor = false;
const params = new URLSearchParams(window.location.search);
const editorSocket = io();//'https://sietove-hry.herokuapp.com/'



function getCookie(name:string) {
    let cookie = new Map();
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      let key:string = k.trim()
      cookie.set(key,v);
    })
    return cookie.get(name);
  }
  editorSocket.emit('get texts',{language:getCookie('language')})


editorSocket.on('connected',(msg)=>{
    console.log('obdržal:')
    console.log(msg)
    editor.setGame(new Game())
    clear()
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
    
       addedTile.setIsEndingFor(tile.isEndingFor)
      
       addedTile.setIsStartingFor(tile.isStartingFor)
    
       
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

    editor.getGame().setInitSizeX(msg.game.initSizeX)
    editor.getGame().setInitSizeY(msg.game.initSizeY)
  
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

editorSocket.on('game started',(msg:{msg:string,tokens:Array<string>})=>{
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
  let rem:Array<Pawn> = []
  editor.getGame().getPawns().forEach((pawn:Pawn)=>{
      if (!msg.tokens.includes(pawn.player)){
        rem.push(pawn)
      }
  })
  console.log('removol')
  console.log(rem)
  rem.forEach((pawn:Pawn)=>{
    editor.getGame().removePawn(pawn)
    pawn.tile.removePawn(pawn)
  })
  reload(editor,ctx)
})


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
editorSocket.on('got texts',(msg:{text:Array<string>})=>{
    
  let zoz = window.location.href.split('/')
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
    editor.getGame().setCanThrow(true)
    
    document.getElementById('Dice')?.addEventListener('click',function()
    {// let pawn = editor.getChoosenTile()!.havePawnOnTile(msg.token)
     // if (editor.getChoosenTile()!=undefined && pawn!= undefined){
     // canvas.removeEventListener('click',pickTile)
     if (editor.getGame().getCanThrow()){
        throwDice(msg.token)
     }
    
    
    
    
    }
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
                                             //pickQuestion(data)
                                            })
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
  
  editorSocket.on('player ended',(msg:{player:string,place:number,token:string})=>{
    editorSocket.emit('reload waiting room',{room:params.get('id')})
    Warning.showInGame(msg.player + ' finished on ' + msg.place + ' place.')
    console.log('zapol')
    editor.getGame().getPawns().forEach((pawn:Pawn)=>{
        if (pawn.player == msg.token){
            pawn.hasEnded = true
        }
    })
  })
  document.getElementById("showRulesButton")?.addEventListener('click',function(){
   
    //$('#rulesModal').modal('show');
    rulesMenu();
    (<HTMLTextAreaElement>document.getElementById("ruleInput"))!.value = editor.getGame().getRules()
   
    
  })


  editorSocket.on('loadedGameNames',(msg:{names:Array<string>})=>{
    console.log('socket odchytil loadedGameNames')
    loadGameMenu(msg.names)
  
  })

  
  
  editorSocket.on('room is full',()=>{
      Warning.showInGame('This game room is full, you become spectator')
  })

  export{editorSocket,canMovePawnFunc,isEditor,clickFunction,getCookie,texts}