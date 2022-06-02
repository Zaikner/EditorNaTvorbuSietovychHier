import { io, Socket } from "socket.io-client";
import { Background } from "./Background";
import { ctx, reload,game, elementDeleter, canvas, edit, clear,initNewGame, resize } from "./Canvas";
import { spawnButton, spawnParagraph } from "./Elements";
import { loadGameMenu } from "./GameLoader";
import { Gameplay } from "./Gameplay";
import { Pawn } from "./Pawn";
import { PawnStyle } from "./PawnStyle";
import { addOption, askQuestion, evaluateQuestion, pickQuestion, showAllQuestions, showResults } from "./Questions";
import { rulesMenu } from "./Rules";
import { Tile } from "./Tile";
import { pickTile } from "./TileEditor";
import { getCookie } from "./UtilityFunctions";
import { Warning } from "./Warning";

let texts:Array<string> = []
let isEditor = false;
let zoz = window.location.href.split('/')
const params = new URLSearchParams(window.location.search);
const editorSocket = io();
setInterval(function(){ editorSocket.emit('ping',{id:localStorage.getItem('id')})},5000)
let canMovePawnFunc:(event: MouseEvent) => void;
let clickFunction = function(){evaluateQuestion();}


class ClientSocket{
  constructor(s:Socket){
    s.emit('get texts',{})
    s.on('connected',(msg)=>{
   
    initNewGame()
    clear()
    let newIds:Map<number,number> = new Map()
    let newId = 0
    msg.tiles.forEach((tile:any) =>{
      newId++;
      let addedTile = new Tile(tile.centerX,tile.centerY,tile.x1,tile.x2,tile.y1,tile.y2,tile.radius,tile.color,tile.tileNumber)
      
       addedTile.setId(newId)
       newIds.set(tile.id,newId)
       addedTile.setStroke(tile.stroke)
       addedTile.setStrokeColor(tile.strokeColor)
       addedTile.setShape(tile.shape)
       addedTile.setIsChoosen(tile.isChoosen)
       if(tile.image != 'none'){
        let image = new Image()
        image.src = tile.image
        image.onload = function(){
         addedTile.setImage(image)
         reload(ctx)
        }
       }
       addedTile.setIsEndingFor(tile.isEndingFor) 
       addedTile.setIsStartingFor(tile.isStartingFor)
       addedTile.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile)
       addedTile.setSkip(tile.skip)
        addedTile.setRepeat(tile.repeat)
        addedTile.setForward(tile.forward)
        addedTile.setBackward(tile.backward)
        addedTile.setMustThrown(tile.mustThrown)
        addedTile.setQuestionId(tile.questionId)
        addedTile.setRandomQuestion(tile.randomQuestion)
        let t = tile.nextTilesIds;
        let add:Map<string,number> = new Map()
        for (let i = 0; i*2 < t.length;i++){
          add.set(t[2*i],parseInt(t[2*i+1]))
        }
        addedTile.setNextTilesIds(add)
     
      game.addTile(addedTile) 
      reload(ctx)
    })
    game.setNextTileId(newId+1)
    let background = new Background()
  
    background.setColor(msg.background.color)
  
    if (msg.background.image!='none'){
      let backImage = new Image()
      backImage.src = msg.background.image
      backImage.onload = function(){
        background.setBackgroundImage(backImage)
        
        game.setBackground(background)
      
        reload(ctx)
      }
        
      background.setBackgroundImage(backImage)
    }
    
    game.setBackground(background)
    game.setAuthor(msg.author)
    game.setName(msg.game.name)
    game.setNumOfPlayers(msg.game.numOfPlayers)
    game.setNumberOfStartingPawns(msg.game.numOfPawnsPerTile)

    let numOfPlayer = <HTMLInputElement>document.getElementById('numOfPlayers')
    let numOfPlayerShower = <HTMLParagraphElement>document.getElementById('numShower')
    let numberOfStartingPawns  = <HTMLInputElement>document.getElementById('pawnNumberSlider')
    let numberOfStartingPawnsShower  = <HTMLParagraphElement>document.getElementById('pawnNumberSliderShower')

    if (numOfPlayer != undefined){
      numOfPlayer.value = msg.game.numOfPlayers
      numOfPlayerShower.textContent = msg.game.numOfPlayers
    }
    if (numberOfStartingPawns != undefined){
      numberOfStartingPawns.value = msg.game.numOfPawnsPerTile
      numberOfStartingPawnsShower.textContent = msg.game.numOfPawnsPerTile
    }
    game.setRules(msg.rules)

    game.setInitSizeX(msg.game.initSizeX)
    game.setInitSizeY(msg.game.initSizeY)
    game.setIsPublished(msg.game.isPublished)
    game.setToogleNumber(msg.game.toogleNumber)
    game.setId(msg.game.id);
  
    if (isEditor){
      (<HTMLInputElement>document.getElementById('toogleNumberingChecker'))!.checked = game.getToogleNumber()
      if (game.getIsPublished()){
        (<HTMLInputElement>document.getElementById('publishGame')).textContent = texts[258]
      }
    }
    
    let gameNextTiles = msg.game.nextTilesIds;
    let add:Map<string,number> = new Map()
    for (let i = 0; i*2 < gameNextTiles.length;i++){
      add.set(gameNextTiles[2*i],parseInt(gameNextTiles[2*i+1]))
    }
    game.setNextTilesIds(add)
    
    
    let tokens:Array<string> = []
    for (let i = 1; i <= game.getnumOfPlayers(); i++){
      tokens.push('Player '+i)
    }
    game.setPlayerTokens(tokens)
    if (params.get('id') == undefined && params.get('name')!=undefined){
      Gameplay.initGameInfo(msg.game.name)
    }
  
    let i = 0

    msg.pawns.forEach((pawn: {token:string,id:number,tileId:number}) => {
      i++;
      let tile = game.findTileById(newIds.get(pawn.tileId)!)!
    
     
       let p = new Pawn(pawn.token,tile)
       p.id = pawn.id
  
       game.getPawns().push(p)
    });

   
    msg.styles.forEach((style:any) => {
      
      let p = new PawnStyle(style.player,style.color,style.type)
      if (style.image != 'none'){
        p.setImage(style.image)
        let backImage = new Image()
        backImage.src = style.image
        backImage.onload = function(){
          p.setImage(backImage)
      
          game.getPawnStyle().set(style.player,p)
          reload(ctx)
        }
      }
      else{
        game.getPawnStyle().set(style.player,p)
      }

    });
    console.log('loaded game:')
    console.log(game)

    let gm:HTMLInputElement = <HTMLInputElement>document.getElementById('gameName')
    if (gm!= undefined){
      gm.value = game.getName()
    }
    resize(game,ctx)
  })

  s.on('react to event: forward',(msg:{value:number,pawnId:number,token:string})=>{
    game.setIsOnTurn(true)
    let ret = game.howManyCanMove(msg.pawnId,msg.value)

    s.emit('move pawns',{pawn:msg.pawnId,value:ret,room:params.get('id'),eval})
})

s.on('react to event: backward',(msg:{value:number,pawnId:number})=>{
  game.setIsOnTurn(true)
  let ret = game.howManyCanMoveBack(msg.pawnId,msg.value)
  s.emit('move pawns back',{pawn:msg.pawnId,value:ret,room:params.get('id')})
})

s.on('not author',()=>{
  Warning.show(texts[185])
 
})
s.on('game saved',(msg:{newId:number})=>{
  game.setId(msg.newId)
})
s.on('react to event: skip',(msg:{token:string,left:number})=>{
  Warning.showInGame(texts[262]+' '+ msg.token +' '+  texts[263] + msg.left)
})
s.on('react to event:must Thrown',(msg:{token:string,value:number})=>{
  Warning.showInGame(texts[262]+' '+ msg.token +texts[264] +' '+ msg.value)
})
s.on('return pawns to starting tile',(msg:{ids:Array<number>})=>{
  msg.ids.forEach((id:number)=>{
    game.findPawnById(id).returnToStart()
  })
  reload(ctx)
})
s.on('join Room',(msg:{id:string,name:string,started:boolean})=>{
  Gameplay.initDice(msg.name)
  s.emit('join player to Room',{id:getCookie('id'),roomId:msg.id})

  if (!msg.started){
    $('#waitingModal').modal('show')
    
  }
  reload(ctx)
  
s.on('player joined',(msg:{msg:string})=>{
  s.emit('reload waiting room',{room:params.get('id')})
  let chat =  (<HTMLTextAreaElement>document.getElementById('chat'))!
  let chatPlaying =  (<HTMLTextAreaElement>document.getElementById("chatPlaying"))!
  if (chat.value == ''){
    chat.value =  texts[227] + ' ' + msg.msg + ' '  + texts[229]
  }
  else{ 
    chat.value = chat.value +  '\n' + texts[227] + ' ' + msg.msg + ' ' + texts[229];}

  
  if (chatPlaying.value == ''){
    chatPlaying.value =  texts[227] + ' ' + msg.msg + ' ' + texts[229]
  }
  else{
    chatPlaying.value = chatPlaying.value +  '\n' + texts[227] + ' ' + msg.msg  + ' ' + texts[229];
  }
  reload(ctx)
})})
s.on('player left',(msg:{msg:string,token:string})=>{
 
  let rem:Array<Pawn>  = []
  game.getPawns().forEach((pawn:Pawn)=>{
    if (pawn.player == msg.token){
      rem.push(pawn)
    }
  })
  rem.forEach((pawn:Pawn)=>{
    game.removePawn(pawn)
    pawn.tile.removePawn(pawn)
  })
  reload(ctx)
  let chat =  (<HTMLTextAreaElement>document.getElementById('chat'))!
  let chatPlaying =  (<HTMLTextAreaElement>document.getElementById("chatPlaying"))!
  if (chat.value == ''){
    chat.value = texts[227] + ' ' + msg.msg +  ' ' + texts[228]
  }
  else{
    chat.value = chat.value +  '\n' +  texts[227] + ' ' + msg.msg + ' ' + texts[228]}

  
  if (chatPlaying.value == ''){
    chatPlaying.value =   texts[227] + ' ' + msg.msg + ' ' + texts[228]
  }
  else{
    chatPlaying.value = chatPlaying.value +  '\n' +  texts[227] + ' ' + msg.msg +' ' +  texts[228];
  }
  s.emit('reload waiting room',{room:params.get('id')})
  reload(ctx)
})

s.on('game started',(msg:{tokens:Array<string>})=>{
 $('#waitingModal').modal('hide')
  let chat =  (<HTMLTextAreaElement>document.getElementById('chat'))!
  let chatPlaying =  (<HTMLTextAreaElement>document.getElementById("chatPlaying"))!
  if (chat.value == ''){
    chat.value =  texts[231]
  }
  else{
    chat.value = chat.value +  '\n' + texts[231];}

  
  if (chatPlaying.value == ''){
    chatPlaying.value = texts[231]
  }
  else{
    chatPlaying.value = chatPlaying.value +  '\n' +texts[231];
  }
  let rem:Array<Pawn> = []
  game.getPawns().forEach((pawn:Pawn)=>{
      if (!msg.tokens.includes(pawn.player)){
        rem.push(pawn)
      }
  })
 
  rem.forEach((pawn:Pawn)=>{
    game.removePawn(pawn)
    pawn.tile.removePawn(pawn)
  })
  reload(ctx)
})

s.on('move Pawn',(msg:{pawn:number,value:number})=>{
  
 let pawn:any = (game.movePawnById(msg.pawn,msg.value))!
  game.setChoosenTile(undefined!)

})
s.on('move Pawn back',(msg:{pawn:number,value:number})=>{

 let pawn:any = (game.movePawnBack(msg.pawn,msg.value,true))!
  game.setChoosenTile(undefined!)

})
s.on('return Pawn to place',(msg:{pawnId:number,value:number})=>{
  game.movePawnBack(msg.pawnId,msg.value,false)
})
s.on('loadAnswersToOthers',(msg:{wrong:Array<string>,right:Array<string>})=>{
  showResults(msg.right,msg.wrong)
})

s.on('evaluate End',(msg:{token:string})=>{

  let is = game.playerEnded(msg.token)
  if (!game.getCanThrow()){
    s.emit('evaluated end',{token:msg.token,is:is,room:params.get('id')})
  }
})

s.on('is online?',()=>{
  s.emit('is online',{id:localStorage.getItem('id')})
})
           
s.on('exit to main menu',()=>{
  window.location.replace('/gamelobby')
})
s.on('game has ended',(msg:{leaderboards:any})=>{
  $('#endModal').modal('show');
})

s.on('show Dice value',(msg:{value:number})=>{
  let image = new Image()
  image.src = '../../src/Dice'+msg.value+'.png'
  image.id = 'Dice'
 
  image.onload = function(){
      elementDeleter('dicePlace')
      document.getElementById('dicePlace')?.append(image)
  }
 
})
s.on('got texts',(msg:{text:Array<string>})=>{
    texts = msg.text
  
    if (zoz[zoz.length-2] === 'editor'){
      edit()
      
      let butt = spawnButton(document,'rulesButtons',"questionRuleButton" ,["btn","btn-secondary"],texts[35],function(){
    
        $('#rulesModal').modal('hide');
       
      })
      butt.onclick = function(){
        game.setRules( (<HTMLTextAreaElement>document.getElementById("ruleInput"))!.value)
      }
      isEditor = true;
    }
    else {

      Gameplay.init()
      if (params.get('id') != null){
        document.getElementById('leaveEndRoom')!.addEventListener('click',function(){window.location.replace('/gamelobby')})
       s.emit('set Socket',{id:getCookie('id'),room:params.get('id')})
       s.emit('load game',{id:getCookie('id'),name:params.get('name'),room:params.get('id')})
      }
      else{
      s.emit('load game',{id:getCookie('id'),name:params.get('name')})
      }
      reload(ctx)
      document.getElementById("leaveWaitinRoom")?.addEventListener('click',function(){
        window.location.replace('/gameLobby')
      })
      document.getElementById('startGameRoom')?.addEventListener('click',function(){
        Warning.show(texts[186])
      })
      document.getElementById("confirmStart")?.addEventListener('click',function(){
     s.emit('game has started',{room:params.get('id')})
      })
    
      document.getElementById('messageSubmitButton')?.addEventListener('click',function(){
        
       s.emit('chat-waitingRoom',{roomId:params.get('id'),id:getCookie('id'),msg:(<HTMLInputElement>document.getElementById('messagePlace'))!.value});
        (<HTMLInputElement>document.getElementById('messagePlace'))!.value = '';
        })
    
        document.getElementById('messagePlayingSubmitButton')?.addEventListener('click',function(){
        
       s.emit('chat-waitingRoom',{roomId:params.get('id'),id:getCookie('id'),msg:(<HTMLInputElement>document.getElementById('messagePlayingPlace'))!.value});
          (<HTMLInputElement>document.getElementById('messagePlayingPlace'))!.value = '';
        
          })
    }
  })
  
 s.on('wrong game name',()=>{
    Warning.show(texts[187])
  })
 s.on('turn',(msg:{player:string,token:string})=>{
    $('#pickQuestionModal').modal('hide')
    $('#answerModal').modal('hide')
    $('#WarningModal').modal('hide')
    game.setHasThrown(false)
    elementDeleter('onTurnPlace')
    let p = spawnParagraph(document,'onTurnPlace','',texts[96]+' '+msg.player,false)
    p.style.textAlign = 'center'
  })

  s.on('turnMove',(msg:{player:string,token:string})=>{
    game.setIsOnTurn(true)
    game.setCanThrow(true)
    game.setHasThrown(false)
    
    document.getElementById('Dice')?.addEventListener('click',function()
    {
     if (game.getCanThrow()){
        Gameplay.throwDice(msg.token)
     }
    }
    )
    
  })
  
  s.on('canMovePawn',(msg:{token:string,value:number})=>{
      canMovePawnFunc = function(event:MouseEvent){pickTile(event,msg.token,msg.value)}
      canvas.addEventListener('click',canMovePawnFunc)   
  })
  
  s.on('end turn',()=>{
    game.setIsOnTurn(false)
    game.setCanThrow(false)
    canvas.removeEventListener('click',canMovePawnFunc)
  })

  s.on('add chat message',(data:{name:string,msg:string})=>{
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
  
  s.on('loadedQuestions',(data)=>{showAllQuestions(data)
        let newQuestions = new  Map<number,string>()

        data.forEach((elem:any) =>{
          newQuestions.set(elem.questionId,elem.questionText)
        })
        game.setQuestions(newQuestions)                                       
                                            })
  s.on('loadedQuestions - pick',(data)=>{
                                              pickQuestion(data)
                                              let newQuestions = new  Map<number,string>()

                                              data.forEach((elem:any) =>{
                                                newQuestions.set(elem.questionId,elem.questionText)
                                             
                                              })
                                              game.setQuestions(newQuestions)
                                             })
                                           
  s.on('loadedAnswerQuestions',(data)=>{
    askQuestion(data)
  })
  
  s.on('canReactToAnswer',()=>{
    document.getElementById('answerButtonRoom')!.removeAttribute('hidden')
    document.getElementById('answerButtonRoom')!.addEventListener('click',clickFunction)
  })
  s.on('add Opt',(data:any) =>{
    addOption('editQuestion',data.text,data.isAnswer,data.id)
  })
  
  s.on('reloaded waiting room',(msg)=>{
    Gameplay.changeWaitingRoom(msg.names)
   
  })
  s.on('question is used',()=>{
    Warning.show(texts[203])
  })
 s.on('random and 0',()=>{
    Warning.show(texts[204])
  })
  s.on('player ended',(msg:{player:string,place:number,token:string})=>{
   s.emit('reload waiting room',{room:params.get('id')})
    Warning.showInGame(msg.player + ' '+ texts[190] +' ' +msg.place + texts[189])
    game.getPawns().forEach((pawn:Pawn)=>{
        if (pawn.player == msg.token){
            pawn.hasEnded = true
        }
    })
  })
  document.getElementById("showRulesButton")?.addEventListener('click',function(){
    rulesMenu();
    (<HTMLTextAreaElement>document.getElementById("ruleInput"))!.value = game.getRules()
  })


  editorSocket.on('loadedGameNames',(msg:{names:Array<string>,authored:Array<string>})=>{
    loadGameMenu(msg.names,msg.authored)
  })

  editorSocket.on('room is full',()=>{
      Warning.showInGame(texts[188])
      setTimeout(function(){ window.location.replace('/gameLobby')},1000)
     
  })
}
}
let clientSocket = new ClientSocket(editorSocket)
  export{editorSocket,canMovePawnFunc,isEditor,clickFunction,getCookie,texts}