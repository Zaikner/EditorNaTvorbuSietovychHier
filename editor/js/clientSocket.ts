import { io } from "socket.io-client";
import { Background } from "./Background";
import { BackgroundComponent } from "./BackgroundComponent";
import { ctx, reload,game, elementDeleter, canvas, edit, clear,initNewGame } from "./canvas";
import { spawnButton, spawnParagraph } from "./Elements";
import { Game } from "./Game";
import { loadGameMenu } from "./gameLoader";
import { Gameplay } from "./Gameplay";
import { Pawn } from "./Pawn";
import { PawnStyle } from "./PawnStyle";
import { addOption, askQuestion, evaluateQuestion, pickQuestion, showAllQuestions, showResults } from "./Questions";
import { rulesMenu } from "./Rules";
import { Tile } from "./Tile";
import { pickTile } from "./TileEditor";
import { Warning } from "./Warning";

let texts:Array<string> = []
let isEditor = false;
let zoz = window.location.href.split('/')
const params = new URLSearchParams(window.location.search);
const editorSocket = io();//'https://sietove-hry.herokuapp.com/'
setInterval(function(){ editorSocket.emit('ping',{id:localStorage.getItem('id')})},5000)


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
       if(tile.backgroundFile != 'none'){
        let image = new Image()
        image.src = tile.backgroundFile
        image.onload = function(){
         addedTile.setImage(image)
         reload(game,ctx)
        }
       }
      

      //addedTile.setBackgroundFile(tile.backgroundFile)
        //addedTile.setPatternFile(tile.patternFile)
    
       addedTile.setIsEndingFor(tile.isEndingFor)
      
       addedTile.setIsStartingFor(tile.isStartingFor)
     
  
  

       addedTile.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile)
  
       addedTile.setSkip(tile.skip)
        addedTile.setRepeat(tile.repeat)
        addedTile.setForward(tile.forward)
        addedTile.setBackward(tile.backward)
        addedTile.setMustThrown(tile.mustThrown)
        addedTile.setTurnsToSetFree(tile.turnToSetFree)
        addedTile.setQuestionId(tile.questionId)
        addedTile.setRandomQuestion(tile.randomQuestion)
        let t = tile.nextTilesIds;
        let add:Map<string,number> = new Map()
        for (let i = 0; i*2 < t.length;i++){
          add.set(t[2*i],parseInt(t[2*i+1]))
        }
        addedTile.setNextTilesIds(add)
     
      game.addTile(addedTile)
      
      // let num = msg.game.numOfPawnsPerTile
      // tile.isStartingFor.forEach((token:string)=>{
      //   for(let i = 0; i < num;i++){
          
      //     let p = new Pawn(token,addedTile)
      //     game.getPawns().push(p)
      //     //addedTile.getPawns().push(p)

      //   }
      // })
      


      
      reload(game,ctx)
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
      
        reload(game,ctx)
      }
        
      background.setBackgroundImage(backImage)
    }
    // msg.components.forEach((component:any)=>{
      
    //   let newComponent = new BackgroundComponent()
    //   if(component.image != 'none' || component.image != undefined){
    //     let image = new Image()
    //     image.src = component.image
    //     image.onload = function(){
    //      newComponent.setImage(image)
    //      background.getComponents().push(newComponent)
    //      reload(game,ctx)
    //     }
    //    }
  
    //   newComponent.setType(component.type)
    //   newComponent.setColor(component.color)
    //   newComponent.setImage(component.image)
    //   newComponent.setImageHeight(component.imageHeigth)
    //   newComponent.setImageWidth(component.imageWidth)
    //   newComponent.setCenterX(component.centerX)
    //   newComponent.setCenterY(component.centerY)
    //   newComponent.setRadius(component.radius)
    //   newComponent.setStroke(component.stroke)
    //   newComponent.setStrokeColor(component.strokeColor)
    //   newComponent.setX1(component.x1)
    //   newComponent.setY1(component.y1)
    //   newComponent.setX2(component.x2)
    //   newComponent.setY2(component.y2)
  
      
    // })
      
    game.setBackground(background)
    //game.setBackground(msg.background)
  
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
    //Gameplay.initGameInfo(msg.game.name)
  
    let i = 0

    msg.pawns.forEach((pawn: {token:string,id:number,tileId:number}) => {
      i++;
      let tile = game.findTileById(newIds.get(pawn.tileId)!)!
    
     
       let p = new Pawn(pawn.token,tile)
       p.id = pawn.id
  
       game.getPawns().push(p)
      
       //tile.getPawns().push(p)
      
      
    });

   
    msg.styles.forEach((style:any) => {
      
      let p = new PawnStyle(style.player,style.color,style.type)
      if (style.image != 'none'){
        p.setImage(style.image)
        let backImage = new Image()
        backImage.src = style.image
        backImage.onload = function(){
          p.setImage(backImage)
          
          //game.setBackground(background)
          game.getPawnStyle().set(style.player,p)
          reload(game,ctx)
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
  })

  editorSocket.on('react to event: forward',(msg:{value:number,pawnId:number})=>{
    game.setIsOnTurn(true)
    let ret = game.howManyCanMove(msg.pawnId,msg.value)
    Warning.showInGame('Event occured: Go forward!')
    editorSocket.emit('move pawns',{pawn:msg.pawnId,value:ret,room:params.get('id')})
})

editorSocket.on('react to event: backward',(msg:{value:number,pawnId:number})=>{
  game.setIsOnTurn(true)
  let ret = game.howManyCanMoveBack(msg.pawnId,msg.value)
  Warning.showInGame('Event occured: Go backward!')
  editorSocket.emit('move pawns back',{pawn:msg.pawnId,value:ret,room:params.get('id')})
})

editorSocket.on('not author',()=>{
  Warning.show(texts[185])
 
})
editorSocket.on('game saved',(msg:{newId:number})=>{
  game.setId(msg.newId)
})
editorSocket.on('react to event: skip',(msg:{token:string,left:number})=>{
  Warning.showInGame('Event occured: Player '+ msg.token +' ' +'skipped his turn! Turns left to skip: ' + msg.left)
})
editorSocket.on('react to event:must Thrown',(msg:{token:string,value:number,turnsLeft:number})=>{
  Warning.showInGame('Event occured: Player '+ msg.token +' ' +'must wait '+msg.turnsLeft+'! turns or throw ' + msg.value +' to set pawn free ')
})
editorSocket.on('return pawns to starting tile',(msg:{ids:Array<number>})=>{
  msg.ids.forEach((id:number)=>{
    game.findPawnById(id).returnToStart()
  })
  reload(game,ctx)
})
editorSocket.on('join Room',(msg:{id:string,name:string,started:boolean})=>{
  Gameplay.initDice(msg.name)
  editorSocket.emit('join player to Room',{id:getCookie('id'),roomId:msg.id})

  if (!msg.started){
    $('#waitingModal').modal('show')
    
  }
  reload(game,ctx)
  


editorSocket.on('player joined',(msg:{msg:string})=>{
  editorSocket.emit('reload waiting room',{room:params.get('id')})
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
  reload(game,ctx)
})})
editorSocket.on('player left',(msg:{msg:string,token:string})=>{
  console.log(msg.msg)
  console.log(msg)
  let rem:Array<Pawn>  = []
  game.getPawns().forEach((pawn:Pawn)=>{
    if (pawn.player == msg.token){
      rem.push(pawn)
      console.log('odstranil:')
      console.log(pawn)
    }
  })
  rem.forEach((pawn:Pawn)=>{
    game.removePawn(pawn)
    pawn.tile.removePawn(pawn)
  })
  reload(game,ctx)
  let chat =  (<HTMLTextAreaElement>document.getElementById('chat'))!
  let chatPlaying =  (<HTMLTextAreaElement>document.getElementById("chatPlaying"))!
  if (chat.value == ''){
    //chat.value =  'Player '+msg.msg +' has left the room.'
    chat.value = texts[227] + ' ' + msg.msg + texts[228]
  }
  else{
    chat.value = chat.value +  '\n' +  texts[227] + ' ' + msg.msg + texts[228]}

  
  if (chatPlaying.value == ''){
    chatPlaying.value =   texts[227] + ' ' + msg.msg + texts[228]
  }
  else{
    chatPlaying.value = chatPlaying.value +  '\n' +  texts[227] + ' ' + msg.msg + texts[228];
  }
  editorSocket.emit('reload waiting room',{room:params.get('id')})
  reload(game,ctx)
})

editorSocket.on('game started',(msg:{tokens:Array<string>})=>{
 // game.setHasStarted(true)
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
  reload(game,ctx)
})


//editorSocket.emit('set Socket',{id:getCookie('id'),room:params.get('id')})

editorSocket.on('move Pawn',(msg:{pawn:number,value:number})=>{
  //msg.pawn.move(msg.value)
  
 
 let pawn:any = (game.movePawnById(msg.pawn,msg.value))!
  game.setChoosenTile(undefined!)

})
editorSocket.on('move Pawn back',(msg:{pawn:number,value:number})=>{

 
 let pawn:any = (game.movePawnBack(msg.pawn,msg.value,true))!
  game.setChoosenTile(undefined!)

})
editorSocket.on('return Pawn to place',(msg:{pawnId:number,value:number})=>{
  game.movePawnBack(msg.pawnId,msg.value,false)
})
editorSocket.on('loadAnswersToOthers',(msg:{wrong:Array<string>,right:Array<string>})=>{
  showResults(msg.right,msg.wrong)
})

editorSocket.on('evaluate End',(msg:{token:string})=>{

  let is = game.playerEnded(msg.token)
  console.log('evaluatol end')
  if (!game.getCanThrow()){
    editorSocket.emit('evaluated end',{token:msg.token,is:is,room:params.get('id')})
  }
  else{
    console.log('chcel evaluatnut, ale mohol hodit')
  }
  
})

editorSocket.on('is online?',()=>{
  editorSocket.emit('is online',{id:localStorage.getItem('id')})
})
           
editorSocket.on('exit to main menu',()=>{
  window.location.replace('/gamelobby')
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
    
  
    texts = msg.text
  
    if (zoz[zoz.length-2] === 'editor'){
      edit()
      
      let butt = spawnButton(document,'rulesButtons',"questionRuleButton" ,["btn","btn-secondary"],texts[35],function(){
    
        $('#rulesModal').modal('hide');
       
      })
      butt.onclick = function(){
        game.setRules( (<HTMLTextAreaElement>document.getElementById("ruleInput"))!.value)
      }
      //document.getElementById('rulesButtons')!
     // <button type="button" class="btn btn-secondary" id="questionRuleButton" onclick="$('#rulesModal').modal('hide');">Edit Changes!</button>
      isEditor = true;
      //game.setInitSizeX(window.innerWidth)
      //game.setInitSizeY(window.innerHeight)
      
    }
    else {
      
      //
      Gameplay.init()
      if (params.get('id') != null){
        document.getElementById('leaveEndRoom')!.addEventListener('click',function(){window.location.replace('/gamelobby')})
        editorSocket.emit('set Socket',{id:getCookie('id'),room:params.get('id')})
        editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name'),room:params.get('id')})
       
        
      }
      else{
        
        editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
      }
      reload(game,ctx)
      document.getElementById("leaveWaitinRoom")?.addEventListener('click',function(){
        window.location.replace('/gameLobby')
      })
      document.getElementById('startGameRoom')?.addEventListener('click',function(){
       
     
        Warning.show(texts[186])
       
       
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
    Warning.show(texts[187])
  })
  editorSocket.on('turn',(msg:{player:string,token:string})=>{
    console.log('recieved: turn')
    console.log(game.getIsOnturn())
    game.setHasThrown(false)
    //canvas.removeEventListener('click',pickTile)
    elementDeleter('onTurnPlace')
    let p = spawnParagraph(document,'onTurnPlace','',texts[96]+msg.player,false)
    p.style.textAlign = 'center'
   
    
  })

 
  editorSocket.on('turnMove',(msg:{player:string,token:string})=>{
    console.log('recieved: turn move')
    game.setIsOnTurn(true)
    game.setCanThrow(true)
    game.setHasThrown(false)
    
    document.getElementById('Dice')?.addEventListener('click',function()
    {// let pawn = game.getChoosenTile()!.havePawnOnTile(msg.token)
     // if (game.getChoosenTile()!=undefined && pawn!= undefined){
     // canvas.removeEventListener('click',pickTile)
     if (game.getCanThrow()){
        Gameplay.throwDice(msg.token)
     }
    
    
    
    
    }
    //}
    )
    
  })
  let canMovePawnFunc:(event: MouseEvent) => void;
  editorSocket.on('canMovePawn',(msg:{token:string,value:number})=>{
    // console.log('recived canMovePawn')
    // console.log(' OBDRZAL CAN MOVE TAK SA POHOL')
    // let can = false
    // game.getPawns().forEach((pawn:Pawn)=>{
    //   if (pawn.player == msg.token){
    //     if (pawn.canMove(msg.value)){
    //       can = true
    //     }
    //   }
    // })
    // if (can){
      canMovePawnFunc = function(event:MouseEvent){pickTile(event,msg.token,msg.value)}
      canvas.addEventListener('click',canMovePawnFunc)
    //}
    // else{
    //   Warning.showInGame('You cant move with any of your remaining pawns. You skip your turn')
    //   console.log('tu emitol evaluated end')
    //   editorSocket.emit('evaluated end',{is:false,room:params.get('id')})
    // }
    
    
  })
  
  editorSocket.on('end turn',()=>{
    game.setIsOnTurn(false)
    game.setCanThrow(false)
    canvas.removeEventListener('click',canMovePawnFunc)
    console.log('recived end turn')
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
        let newQuestions = new  Map<number,string>()

        data.forEach((elem:any) =>{
          newQuestions.set(elem.questionId,elem.questionText)
          //elem.questionId
        })
        game.setQuestions(newQuestions)
                                             //pickQuestion(data)
                                            })
  editorSocket.on('loadedQuestions - pick',(data)=>{//showAllQuestions(data)
                                              pickQuestion(data)
                                              let newQuestions = new  Map<number,string>()

                                              data.forEach((elem:any) =>{
                                                newQuestions.set(elem.questionId,elem.questionText)
                                                //elem.questionId
                                              })
                                              game.setQuestions(newQuestions)
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
    Gameplay.changeWaitingRoom(msg.names)
   
  })
  editorSocket.on('question is used',()=>{
    Warning.show(texts[203])
  })
  editorSocket.on('random and 0',()=>{
    Warning.show(texts[204])
  })
  editorSocket.on('player ended',(msg:{player:string,place:number,token:string})=>{
    editorSocket.emit('reload waiting room',{room:params.get('id')})
    Warning.showInGame(msg.player + texts[190] + msg.place + texts[189])
    game.getPawns().forEach((pawn:Pawn)=>{
        if (pawn.player == msg.token){
            pawn.hasEnded = true
        }
    })
  })
  document.getElementById("showRulesButton")?.addEventListener('click',function(){
   
    //$('#rulesModal').modal('show');
    rulesMenu();
    (<HTMLTextAreaElement>document.getElementById("ruleInput"))!.value = game.getRules()
   
    
  })


  editorSocket.on('loadedGameNames',(msg:{names:Array<string>})=>{
    loadGameMenu(msg.names)
  
  })

  
  
  editorSocket.on('room is full',()=>{
      Warning.showInGame(texts[188])
      setTimeout(function(){ window.location.replace('/gameLobby')},1000)
     
  })

  export{editorSocket,canMovePawnFunc,isEditor,clickFunction,getCookie,texts}