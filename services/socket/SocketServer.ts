
import { Namespace, Server as ioServer, Socket } from "socket.io";

import { Game_db } from "../db/RDG/Game_db";
import { Tile_db } from "../db/RDG/Tile_db";
import { Background_db } from "../db/RDG/Background_db";
import { GameFinder } from "../db/RDG/GameFinder_db";
import { BackgroundFinder } from "../db/RDG/BackgroundFinder";
import { TileFinder } from "../db/RDG/TileFinder";
import { Question } from "../db/RDG/Question";
import { QuestionOption } from "../db/RDG/QuestionOption";
import { QuestionFinder } from "../db/RDG/QuestionFinder";

import { QuestionWithOptionsFinder } from "../db/RDG/QuestionWithOptionsFinder";
import { Pawn } from "../db/RDG/Pawn";
import { PawnStyles } from "../db/RDG/PawnStyle";

import { Rules } from "../db/RDG/Rules";

import { TextsFinder } from "../db/RDG/TextFinder";
import { Texts } from "../db/RDG/Texts";

import { PawnStyleFinder } from "../db/RDG/PawnStyleFinder";
import { QuestionOptionFinder } from "../db/RDG/QuestionOptionFinder";


const Player = require( "../../backEnd/Game/Player")
const path = require('path');
const AccountManager = require('../../backEnd/Accounts/AccountManager.js')
const GameManager = require('../../backEnd/Game/GameManager.js')

export class ServerSocket{
    private static io:ioServer;
    

    static serverListen(){


        this.io.on('connection', (socket:any) => {
           
            socket.on('is online',(msg:{id:string})=>{
              let acc = AccountManager.getAccountByClientId(msg.id)
              acc.setAnswered = 0;
            })
            socket.on('load game',async (msg:{id:string,name:string,room:string,response:boolean}) => {
                    if (msg.response){
                        let game = await GameFinder.getIntance().findByName(msg.name)
                        if (game!.length == 0){
                          socket.emit('wrong game name')
                          return
                        }
                    }
                    let acc = AccountManager.getAccountByClientId(msg.id)

                    if (acc == undefined){
                      window.location.replace('/')
                    }
                    acc.setSocketId(socket.id)
           
                   let emit;
                  
                   if (msg.room!=undefined){
                     
                    let r = GameManager.getActiveRooms().get(parseInt(msg.room))
                     emit  = r.getGameData()

                    emit.pawns.forEach((pawn:{token:string,id:number,tileId:number})=>{
                        pawn.tileId = r.getPawnPositions().get(pawn.id)
                    })
                   }
                   else{
                    emit = await GameManager.loadGame(msg.name)
                    let numOfPawns = emit.game.getNumOfPawnsPerTile()
                    let pawnNumber = 1;
                    let pawns:Array<{token:string,id:number,tileId:number}> = []
                    emit.tiles!.forEach((tile:any)=>{
                      tile.isStartingFor.forEach((token:string)=>{
                        for(let i = 0; i < numOfPawns;i++){
                         pawns.push({token:token,id:pawnNumber,tileId:tile.id})
                         pawnNumber++;
                        }
                      })
                    })
                    emit.pawns = pawns
                    
                   }
        
                    this.emitToSpecificSocket(socket.id,'connected', emit)
                 
            });
            socket.on('chat-waitingRoom',(data:{roomId:string;id:string,msg:string})=>{
              let acc = AccountManager.getAccountByClientId(data.id)
              this.io.to(data.roomId).emit('add chat message',{name:acc.getName(),msg:data.msg})
            })
            socket.on('disconnect', () => {
                    
                GameManager.findRoomBySocketId(socket.id)
            });
        socket.on('saveGame',async (data:any) => {
          let acc = AccountManager.getAccountByClientId(data.clientId)
          let existingGames = await GameFinder.getIntance().findByName(data.name)
          let lastGame = await GameFinder.getIntance().findLast()
          if (acc == undefined){
            return
          }
          let id =0
          if (existingGames!.length > 0){
            if (existingGames![0].getAuthorId()!= acc.getId()){
              socket.emit('not author')

              return
            }
            else{
             id = data.id
            }
           
          }
          else{
            if (lastGame!.length == 0){
              id = 1
            }
            else{
              id = lastGame![0].getId()+1
            }
          }
        let last = await TileFinder.getIntance().findLast()
        let lastId = last?.getId()
      
        await TileFinder.getIntance().deleteByGameId(id)
        await PawnStyleFinder.getIntance().deleteById(id)
        let g = new Game_db()
        g.setId(id)
        g.setAuthorId(acc.getId())
        g.setName(data.name)
        g.setNumOfPlayers(data.numOfPlayers)
        g.setNextTilesIds(data.nextTilesIds)
        g.setInitSizeX(data.initSizeX)
        g.setInitSizeY(data.initSizeY)
        g.setIsPublished(data.isPublished)
        g.setToogleNumber(data.toogleNumber)
        g.setNumOfPawnsPerTile(data.numOfPawnsPerTile)
        data.tiles.forEach((tile:any) =>{
          let t = new Tile_db()
          t.setId(tile.id+lastId)
          t.setCenterX(tile.centerX)
          t.setCenterY(tile.centerY)
          t.setX1(tile.x1)
          t.setX2(tile.x2)
          t.setY1(tile.y1)
          t.setY2(tile.y2)
          t.setRadius(tile.radius)
          t.setColor(tile.color)
          t.setStroke(tile.stroke)
          t.setStrokeColor(tile.strokeColor)
          t.setShape(tile.shape)
          t.setImage(tile.image)
    
          t.setTileNumber(tile.tileNumber) 
          t.setIsEndingFor(tile.isEndingFor)
          t.setIsStartingFor(tile.isStartingFor)     

          t.setGameId(id)
          t.setQuestionId(tile.questionId)
          t.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile)
          t.setNextTilesIds(tile.nextTilesIds)
          t.setSkip(tile.skip)
          t.setRepeat(tile.repeat)
          t.setForward(tile.forward)
          t.setBackward(tile.backward)
          t.setMustThrown(tile.mustThrown)
          t.setRandomQuestion(tile.randomQuestion)
          t.insert()
        })
        g.upsert()
      

        let b = new Background_db()
        b.setGameId(id)
        b.setColor(data.background.color)
        b.setImage(data.background.backgroundImage)
        b.upsert()

        data.styles.forEach((style:any) => {
          let s = new PawnStyles()
          s.setGameId(id)
          s.setColor(style.color)
          s.setImage(style.image)
          s.setType(style.type)
          s.setPlayer(style.player)
          s.insert()
        });
        let rule = new Rules()
        rule.setGameId(id)
        rule.setText(data.rules)
        rule.upsert()

        this.io.emit('chat message');
        socket.emit('game saved',{newId:id})
      });

      socket.on('set Socket',(msg:{id:string,room:string})=>
      {
        let acc = AccountManager.getAccountByClientId(msg.id)
           if(acc === undefined){
             window.location.replace('/')
             return
           }
          acc.setSocketId(socket.id)
   
          let r = GameManager.getActiveRooms().get(parseInt(msg.room))
          let cont = true
         
          if (!r.getHasStarted() && cont){
            r.join(new Player(acc,'Player '+(r.getNumOfPlayers()+1)))}

      }
      
      )
     
      socket.on('game has started',(msg:{room:string})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        r.startGame()
        this.io.in(msg.room).emit('game started',{msg:'Game has started!',tokens:r.getPlayers().map((p:any)=>p.getToken())})
        this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
        GameManager.reloadTables()
        this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
      }
        
      
        )
      
      socket.on('move pawns',(msg:{room:string,pawn:number,value:number})=>{
        this.io.in(msg.room).emit('move Pawn',{pawn:msg.pawn,value:msg.value})
      })
      socket.on('move pawns back',(msg:{room:string,pawn:number,value:number})=>{
        this.io.in(msg.room).emit('move Pawn back',{pawn:msg.pawn,value:msg.value})
      })

    
      socket.on('player thrown',(msg:{room:string,token:string,value:number,tileId:number,canMove:boolean})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }

      
        r.setTimeLeft(120)
        if (r.getPlayerOnTurn().getMustThrown()!=0){
          if (r.getPlayerOnTurn().getMustThrown()!=msg.value){
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})    
            socket.emit('react to event:must Thrown',{token: r.getPlayerOnTurn().getAccount().getName(),value:r.getPlayerOnTurn().getMustThrown(),turnsLeft:r.getPlayerOnTurn().getTurnsToSetFree()})
      
          }
          else{
            r.getPlayerOnTurn().setMustThrown(0)
           
            socket.emit('canMovePawn',{value:msg.value,token:msg.token})
          }
        }
        else if(!msg.canMove){
          socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
        }
        else{
          socket.emit('canMovePawn',{value:msg.value,token:msg.token})
        }      
      })
      
      socket.on('show Dice',(msg:{id:string,value:number})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.id))
        if (r == undefined){
          return
        }
        r.setLastDiceValue(msg.value)

        socket.to(msg.id).emit('show Dice value',{value:msg.value})
      })
      socket.on('react to tile',async (msg:{room:string,id:string,returnValue:number,pawnId:number,canRemovePawnIds:Array<number>,tileNumber:number})=>{

        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        let tile:Tile_db = undefined!

        r.getGameData().tiles.forEach((t:Tile_db)=>{
        if (t.getTileNumber() == msg.tileNumber){
          tile = t
        }
        })

        r.setTimeLeft(120)
        if (r.getPlayerOnTurn().getAccount().getSocketId() ==  socket.id){

          this.io.in(msg.room).emit('return pawns to starting tile',{ids:msg.canRemovePawnIds})
          this.io.in(msg.room).emit('ended turn')
          if (tile.getRandomQuestion()){

            r.setReturnValue(msg.returnValue)
            r.setChoosedPawnId(msg.pawnId)
            let author = (await GameFinder.getIntance().findByName(r.getGameName()))!

            let allQuesstions = await QuestionWithOptionsFinder.getInstance().findByAuthor(author[0]!.getAuthorId())
            let randomId  = allQuesstions![Math.floor(Math.random()*allQuesstions!.length)]!.getQuestionId()
            let questions = await QuestionWithOptionsFinder.getInstance().findById(randomId)
            let data: { questionId: number; optionId: number; questionText: string; optionText: string; authorId: number; isAnswer: boolean;}[] = []

    
            questions?.forEach((question) => {
              data.push({
                questionId: question.getQuestionId(),
                optionId: question.getOptionId(),
                questionText: question.getQuestionText(),
                optionText: question.getOptionText(),
                authorId: question.getAuthorId(),
                isAnswer: question.getIsAnswer()})
            })
            
            this.io.to(msg.room).emit('loadedAnswerQuestions',data)
            socket.emit('canReactToAnswer')
          }
          else if (tile.getQuestionId() >= 0){
            r.setReturnValue(msg.returnValue)
            r.setChoosedPawnId(msg.pawnId)
            let questions = await QuestionWithOptionsFinder.getInstance().findById(tile.getQuestionId())
            let data: { questionId: number; optionId: number; questionText: string; optionText: string; authorId: number; isAnswer: boolean;}[] = []

            questions?.forEach((question) => {
              data.push({
                questionId: question.getQuestionId(),
                optionId: question.getOptionId(),
                questionText: question.getQuestionText(),
                optionText: question.getOptionText(),
                authorId: question.getAuthorId(),
                isAnswer: question.getIsAnswer()})
            })
            
            this.io.to(msg.room).emit('loadedAnswerQuestions',data)
            socket.emit('canReactToAnswer')
           
          }
          else if(tile.getSkip() > 0){
            r.getPlayerOnTurn().setSkip(tile.getSkip())
            
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
          }
          else if(tile.getRepeat() > 0){
            r.getPlayerOnTurn().setRepeat(tile.getRepeat())
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
          }
          
          else if(tile.getForward() > 0){
            socket.emit('react to event: forward',{value:tile.getForward(),pawnId:msg.pawnId,token:r.getPlayerOnTurn().getToken()})
          }
          else if(tile.getBackward() > 0){
            socket.emit('react to event: backward',{value:tile.getBackward(),pawnId:msg.pawnId})  
          }
          else if(tile.getMustThrown() > 0){
            r.getPlayerOnTurn().setMustThrown(tile.getMustThrown())
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
          }
          else{
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
                 }
        }
      })
      socket.on('change Pawn position',(msg:{room:string,tileId:number,pawnId:number,id:string})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        if (r.getPlayerOnTurn().getAccount() ==  AccountManager.getAccountByClientId(msg.id)){
          r.getPawnPositions().set(msg.pawnId,msg.tileId)
  
        }
        console.log(r.getPawnPositions())
      })
       
      socket.on('showAnswersToOthers',(msg:{room:string,wrong:Array<string>,right:Array<string>})=>{
        //socket.to(msg.room).emit('loadAnswersToOthers',{wrong:msg.wrong,right:msg.right})

      })
      socket.on('evaluated end',(msg:{is:boolean,room:string,token:string})=>{
    
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        r.setTimeLeft(120)
        let player = r.findPlayerByToken(msg.token)

        if(msg.is == true &&  !r.getPlayersWhichEnded().includes(player)){
          
          r.getPlayersWhichEnded().push(player)
          let place = r.getPlayersWhichEnded().length
          player.setPlace(place)
          this.io.in(msg.room).emit('player ended',{player:player.getAccount().getName(),place:place,token:player.token})
        }
        
        if(r.gameEnded()){
          this.io.in(msg.room).emit('game has ended',{leaderboards:[]})
          r.getPlayers().forEach((player:any)=>{
            let acc = player.getAccount()
            acc.setScore(acc.getScore()+r.getMaxPlayers()-player.getPlace()+1)

            if (player.getPlace() == 1){
              acc.setGameWon(acc.getGameWon()+1)
            }
            else{
              acc.setGameLost(acc.getGameLost()+1)
            }
            player.getAccount().save()
          })
        }
        else{
          let stop = true
          r.nextTurn()
          if (r.getPlayerOnTurn().getSkip() !=0){

            this.io.in(msg.room).emit('react to event: skip',{token: r.getPlayerOnTurn().getAccount().getName(),left:r.getPlayerOnTurn().getSkip()-1})
            stop = false
          }
          while(!stop){
            if (r.getPlayerOnTurn().getSkip() ==0){
                 stop = true
            }
            else{
              r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
              r.nextTurn()
            }
          }
        
          this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
          this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
          
          r.setReturnValue(-1)
          r.setChoosedPawnId(-1)
        }
      
      })

      socket.on('wasRightAnswer',(msg:{is:boolean,room:string})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))

        if (!msg.is){
          this.io.in(msg.room).emit('return Pawn to place',{pawnId:r.getChoosedPawnId(),value:r.getReturnValue()})
          r.getPawnPositions().set(r.getChoosedPawnId(),r.getReturnValue())
         }

        socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
      })
      socket.on('join player to Room',(msg:{id:string,roomId:string})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
        if(acc === undefined){
          return
        }
        socket.join(msg.roomId)
        
        let r = GameManager.getActiveRooms().get(parseInt(msg.roomId))

          GameManager.reloadTables()
          this.io.in(msg.roomId).emit('player joined',{msg:acc.getName()})

      })

      socket.on('upsertQuestion', async(data:{question:string,options:Array<{txt:string,isAnswer:boolean,id:string}>,id:string,questionId:number})=>{
        let quest = new Question()
        let lastQuest = await QuestionFinder.getIntance().findWithLastId()
        let acc = AccountManager.getAccountByClientId(data.id)
        if (acc == undefined){
          return
        }
        QuestionWithOptionsFinder.getInstance().deleteOptionsByQuestionId(data.questionId)
    
        let id = 0
        if (data.questionId < 0){
          
          try{
            id = lastQuest![0].getId()+1
          }
          catch{
            id = 0
          }
        }
        else{
          id = data.questionId
        }
        
       
        quest.setText(data.question)
        quest.setId(id)
        quest.setAuthorId(acc.getId())
        quest.upsert()
        let lastOption = await QuestionOptionFinder.getIntance().findWithLastId();
        let lastId:number = 0
        if (lastOption!.length > 0){
          lastId = <number>(lastOption![0].getId())
        }
        lastId++;
       
        data.options.forEach((elem:{txt:string,isAnswer:boolean,id:string}) => {
          let option = new QuestionOption()
          option.setId(<number>lastId)
          lastId++;
    
          option.setText(elem.txt)
          option.setQuestionId(id)
          option.setIsAnswer(elem.isAnswer)
          option.insert()
        })
      
      })
  
      socket.on('deleteQuestion', async(data:{questionId:string,id:string})=>{
        ////console.log('edituje')
        let acc = AccountManager.getAccountByClientId(data.id)
        if (acc == undefined){
          return
        }
        let can = (await TileFinder.getIntance().findByQuestionId(parseInt(data.questionId)))!.length == 0
        let questionNumber = (await QuestionFinder.getIntance().findAllByAuthorId(acc.getId()))!.length
        let lastRandomQuestion = (await TileFinder.getIntance().findByAuthorAndRandomQuestion(acc.getId()))!.length > 0
    
        if(questionNumber == 1 && lastRandomQuestion){
          socket.emit('random and 0')
        }
        else   if ((await TileFinder.getIntance().findByQuestionId(parseInt(data.questionId)))!.length == 0){
          QuestionWithOptionsFinder.getInstance().deleteOptionsByQuestionId(parseInt(data.questionId))
          let quest= new Question()
          quest.setId(parseInt(data.questionId))
          quest.delete()
        }
        else{
          socket.emit('question is used')
        }    
      })

      socket.on('insertQuestion', async(data:{text:string,isAnswer:boolean})=>{
        let opt = new QuestionOption()
        opt.setText(data.text)
        opt.setIsAnswer(data.isAnswer)
        opt.insert()
        let last = (await QuestionFinder.getIntance().findWithLastId())![0].getId()
        socket.edit('add Opt',{text:data.text,isAnswer:data.isAnswer,id:last+1})
      })
      
      socket.on('loadQuestions',async(msg:{id:string,pick:boolean})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
        if (acc == undefined){
          return
        }
        let questions = await QuestionWithOptionsFinder.getInstance().findByAuthor(acc.getId())

        let data: { questionId: number; optionId: number; questionText: string; optionText: string; authorId: number; isAnswer: boolean; }[] = []
        questions?.forEach((question) => {
          data.push({
            questionId: question.getQuestionId(),
            optionId: question.getOptionId(),
            questionText: question.getQuestionText(),
            optionText: question.getOptionText(),
            authorId: question.getAuthorId(),
            isAnswer: question.getIsAnswer()})
        })
        
        if (msg.pick == false){
          socket.emit('loadedQuestions',data)
        }
        else{
          socket.emit('loadedQuestions - pick',data)
        }
       
      
      })

      socket.on('answerQuestion',async(msg:{id:number})=>{
        let questions = await QuestionWithOptionsFinder.getInstance().findById(msg.id)
        let data: { questionId: number; optionId: number; questionText: string; optionText: string; authorId: number; isAnswer: boolean; }[] = []

        questions?.forEach((question) => {
          data.push({
            questionId: question.getQuestionId(),
            optionId: question.getOptionId(),
            questionText: question.getQuestionText(),
            optionText: question.getOptionText(),
            authorId: question.getAuthorId(),
            isAnswer: question.getIsAnswer()})
        })
      
        socket.emit('loadedAnswerQuestions',data)
      })

      socket.on('get texts',async ()=>{
        let texts:Array<string> = (await TextsFinder.getIntance().findAll())!.map((txt:Texts)=>txt.getSK())
      
        socket.emit('got texts',{text:texts})
      })
      socket.on('join Room',(msg:{roomName:string})=>{
        socket.join(msg.roomName)
        GameManager.reloadTables()
      })
      socket.on('filter',(msg:{maxPlayers:string,maxTiles:string,questions:boolean})=>{
      })
      socket.on('reload waiting room',(msg:{room:string})=>{
        let r =  GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          socket.emit('exit to main menu')
          return
        }
        let names:Array<{name:string,avatar:string,place:number,token:string}>= []
        r.getPlayers().forEach((player:any)=>{
          names.push({name:player.getAccount().getName(),avatar:player.getAccount().getAvatar(),place:player.getPlace(),token:player.getToken()})
        }
        )
        GameManager.reloadTables()
        
        this.io.in(msg.room).emit('reloaded waiting room',{names:names})
      })
      socket.on('loadGameNames',async(msg:{id:string})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
        if (acc == undefined){
          return
        }
        let names = (await GameFinder.getIntance().findAllPublished())!.map((game) => game.getName())
        let authorNames = (await GameFinder.getIntance().findByAuthorId(acc.getId()))!.map((game) => game.getName())
       
        for ( let i of authorNames){
          if (!names.includes(i)){
            names.push(i)
          }
        }
        socket.emit('loadedGameNames',{names:names,authored:authorNames})
      })
      socket.on('make game not published', async(msg:{name:string,id:string})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
        let existingGames = await GameFinder.getIntance().findByName(msg.name)
      
        if (acc == undefined){
          return
        }
      
        if (existingGames!.length > 0){
          if (existingGames![0].getAuthorId()!= acc.getId()){
            socket.emit('not author')

            return
          }
          else{
            existingGames![0].setIsPublished(false)
            existingGames![0].upsert()
          }
         
        }
      })
      socket.on('deleteGame',async (msg:{id:string,name:string})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
        let existingGames = await GameFinder.getIntance().findByName(msg.name)
      
        if (acc == undefined){
          return
        }
      
        if (existingGames!.length > 0){
          if (existingGames![0].getAuthorId()!= acc.getId()){
            socket.emit('not author')
            return
          }
          else{
            existingGames![0].delete()
          }  
        }
      })
      socket.on('ping',(msg:{id:string})=>{
        console.log('odpingol')
        let acc = AccountManager.getAccountByClientId(msg.id)
        if (acc != undefined){
            acc.setPing(0)
            console.log('nastavil na 0')
      }})
          });
    }
  
    static getIo(){
        return this.io
    }
    static setIo(io:ioServer){
        this.io = io
    }
    static emitToSpecificSocket(socketId:string,event:string,msg:Object){
        this.io.to(socketId).emit(event,msg)
    }
    static emitToRoom(roomName:string,event:string,data:any){
      this.io.to(roomName).emit(event,data);
    }
}

module.exports = ServerSocket