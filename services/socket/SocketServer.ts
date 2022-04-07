
import { Server as ioServer, Socket } from "socket.io";

import { Game_db } from "../db/RDG/Game_db";
import { Tile_db } from "../db/RDG/Tile_db";
import { Background_db } from "../db/RDG/Background_db";
import { GameFinder } from "../db/RDG/GameFinder_db";
import { BackgroundFinder } from "../db/RDG/BackgroundFinder";
import { TileFinder } from "../db/RDG/TileFinder";
import { Question } from "../db/RDG/Question";
import { QuestionOption } from "../db/RDG/QuestionOption";
import { QuestionFinder } from "../db/RDG/QuestionFinder";

import { QuestionWithAnswersFinder } from "../db/RDG/QuestionWithAnswersFinder";
import { Pawn } from "../db/RDG/Pawn";
import { PawnStyles } from "../db/RDG/PawnStyle";
import { QuestionWithAnswers } from "../db/RDG/QuestionsWithAnswers";
import { text } from "body-parser";
import { addOption } from "../../editor/js/Questions";
import { BlobOptions } from "buffer";
import { Rules } from "../db/RDG/Rules";
import { RulesFinder } from "../db/RDG/RulesFinder";
import { access } from "fs";
import { editor } from "../../editor/js/canvas";
import { Account } from "../../backEnd/Accounts/Account";


const Player = require( "../../backEnd/Game/Player")
const path = require('path');
const AccountManager = require('../../backEnd/Accounts/AccountManager.js')
const GameManager = require('../../backEnd/Game/GameManager.js')
export class ServerSocket{
    private static io:ioServer;
    

    static serverListen(){
        this.io.on('connection', (socket:any) => {
            socket.emit('pipi')
            
            socket.on('load game',async (msg:{id:string,name:string,room:string}) => {
               
                    let acc = AccountManager.getAccountByClientId(msg.id)
                    acc.setSocketId(socket.id)
                    // let game = await GameFinder.getIntance().findByName(msg.name)
                    // let tt =await TileFinder.getIntance().findByName(msg.name)
                    // let background = await BackgroundFinder.getIntance().findByName(msg.name)
                
                   
                  
                   let emit;
                   if (msg.room!=undefined){
                     
                    let r = GameManager.getActiveRooms().get(parseInt(msg.room))
                    emit  = r.getGameData()
                    emit.pawns.forEach((pawn:Pawn)=>{
                        pawn.tileId = r.getPawnPositions().get(pawn.getId())
                    })
                   }
                   else{
                    emit = await GameManager.loadGame(msg.name)
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
          let acc = AccountManager.getAccountByClientId(data.id)
     
        let last = await TileFinder.getIntance().findLast()
        let lastId = last?.getId()
      
        let g = new Game_db()
        g.setAuthor(acc.getName())
        g.setName(data.name)
        g.setNumOfPlayers(data.numOfPlayers)
        data.tiles.forEach((tile:any) =>{
          let t = new Tile_db()
          t.setId(tile.id+lastId)
          t.setType(tile.type)
          t.setCenterX(tile.centerX)
          t.setCenterY(tile.centerY)
          t.setX1(tile.x1)
          t.setX2(tile.x2)
          t.setY1(tile.y1)
          t.setY2(tile.y2)
          t.setRadius(tile.radius)
          t.setIsOccupied(tile.isOccupied)
          t.setColor(tile.color)
          t.setStroke(tile.stroke)
          t.setStrokeColor(tile.strokeColor)
          t.setShape(tile.shape)
          t.setBackgroundFile(tile.backgroundFile)
          t.setPatternFile(tile.patternFile)
          t.setTileNumber(tile.tileNumber) 
          t.setIsEnding(tile.isEnding)
          t.setIsEndingFor(tile.isEndingFor)
          t.setIsStarting(tile.isStarting)
          t.setIsStartingFor(tile.isStartingFor)     
          t.setBelongTo(tile.belongTo)     
          t.setCanOccupy(tile.canOccupy)
          t.setToogleNumber(tile.toggleNumber)
          t.setNumberingColor(tile.numberingColor)
          t.setFollowingTileNumber(tile.numberOfFollowingTile)
          t.setGameName(data.name)
          t.setQuestionId(tile.questionId)
          t.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile)
         
          t.setSkip(tile.skip)
          t.setRepeat(tile.repeat)
          t.setForward(tile.forward)
          t.setBackward(tile.backward)
          t.setMustThrown(tile.mustThrown)
          t.setTurnsToSetFree(tile.turnToSetFree)
          t.insert()
        })
        g.insert()
      

        let b = new Background_db()
        b.setGameName(data.name)
        b.setColor(data.background.color)
        b.setImage(data.background.backgroundImage)
        b.insert()


        data.pawns.forEach((pawn:any)=>{
           let p = new Pawn()
          // p.setColor(pawn.color)
           //p.setImage(pawn.image)
           p.setPlayer(pawn.player)
           p.setTileId(pawn.tileId +lastId)
           p.insert()
        })
        data.styles.forEach((style:any) => {
          let s = new PawnStyles()
          s.setGameName(data.name)
          s.setColor(style.color)
          s.setImage(style.image)
          s.setType(style.type)
          s.setPlayer(style.player)
          s.insert()
        });
        let rule = new Rules()
        rule.setGameName(data.name)
        rule.setText(data.rules)
        rule.upsert()

        this.io.emit('chat message');
      });

      socket.on('set Socket',(msg:{id:string,room:string})=>
      {
        let acc = AccountManager.getAccountByClientId(msg.id)
           if(acc === undefined){
             return
           }
          acc.setSocketId(socket.id)
   
          let r = GameManager.getActiveRooms().get(parseInt(msg.room))
          let cont = true
          // r.getPlayers().forEach((player:any)=>{
          //   if (player.getAccount().getName() == acc.getName()){
          //     cont = false
          //   }
          //   else{
          //     console.log(player.getAccount().getName())
          //     console.log(pl)
          //   }
          // })
         
          if (r.getHasStarted() && cont){
            r.join(new Player(acc,'spectator'))
          }
          else if (cont){
            r.join(new Player(acc,'Player '+(r.getNumOfPlayers()+1)))
          }
         
      
     
 
      }
      
      )
     
      socket.on('game has started',(msg:{room:string})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        r.setHasStarted(true)
        
        this.io.in(msg.room).emit('game started',{msg:'Game has started!'})
        this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
     
        this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
      }
        
      
        )
       
      socket.on('player thrown',(msg:{room:string,player:string,value:number,tileId:number,pawn:number})=>{
        console.log('recieved player thrown' +msg.player)
        console.log('emited movePawn')
        this.io.in(msg.room).emit('move Pawn',{pawn:msg.pawn,value:msg.value})
        
      })
      socket.on('react to tile',(msg:{room:string,questionId:number,id:string})=>{
        console.log('recieved react to tile id: '+msg.id)
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r.getPlayerOnTurn().getAccount().getSocketId() ==  socket.id){
        
          this.io.in(msg.room).emit('ended turn')
          console.log('pred zmenou turnu')
          console.log({player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})

          r.nextTurn()
      
          //console.log(r)
          console.log('emited turn: ')
          console.log({player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
          this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
          console.log('emited turnMove:')
          console.log({player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
          this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
   
        }
        else{
          console.log([r.getPlayerOnTurn().getAccount().getSocketId(),socket.id])
        }
         
      })
      socket.on('change Pawn position',(msg:{room:string,tileId:number,pawnId:number,id:string})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r.getPlayerOnTurn().getAccount() ==  AccountManager.getAccountByClientId(msg.id)){
          r.getPawnPositions().set(msg.pawnId,msg.tileId)
  
        }
        else{
        
          //console.log([socket.id, r.getPlayerOnTurn().getAccount().getSocketId()])
        }
        
       
      })
       


      socket.on('join player to Room',(msg:{id:string,roomId:string})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
        if(acc === undefined){
          return
        }
        socket.join(msg.roomId)
       
        let r = GameManager.getActiveRooms().get(parseInt(msg.roomId))
        if (r.getHasStarted()){
          this.io.in(msg.roomId).emit('player joined',{msg:'Player '+ acc.getName() + ' has joined the room.(spectating)'})

        }
        else{
          this.io.in(msg.roomId).emit('player joined',{msg:'Player '+ acc.getName() + ' has joined the room.'})
        }
      })
      // socket.on('relog',async(msg:{id:string})=>{
      //   console.log('skusil relognut'+msg.id)
      //   //console.log(msg.id)
      //   let acc = AccountManager.getAccountByClientId(msg.id)
      //   if(acc === undefined){
      //     return
      //   }
      //   AccountManager.login(acc)
      //   socket.emit('set cookie')
      //   console.log('pripojil'+acc)
      // })

      socket.on('newQuestion', async(data:{question:string,options:Array<{txt:string,isAnswer:boolean}>,id:string,questionId:number})=>{
        let quest = new Question()
        let lastQuest = await QuestionFinder.getIntance().findWithLastId()
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
        //quest.setAuthor(AccountManager.getAccountByClientId(data.id).getName()) -->ked bude fungovat user

        quest.insert()

        data.options.forEach((elem:{txt:string,isAnswer:boolean}) => {
          let option = new QuestionOption()
          option.setText(elem.txt)
          option.setQuestionId(id)
          option.setIsAnswer(elem.isAnswer)
          console.log(option)
          option.insert()
        })

        //console.log(await QuestionWithAnswersFinder.getIntance().findAll())
      })
      socket.on('editOption', async(data:{isAnswer:boolean,text:string,id:string})=>{
        console.log('edituje')
        console.log(data)
        let opt = new QuestionOption()
        opt.setId(parseInt(data.id))
        opt.setText(data.text)
        opt.setIsAnswer(data.isAnswer)
        opt.update()
        
      })
      socket.on('editQuestion', async(data:{text:string,id:number})=>{
        console.log('edituje')

        let quest = new Question()
        quest.setId(data.id)
        quest.setText(data.text)
        
        quest.update()
        
      })
      socket.on('deleteQuestion', async(data:{id:string})=>{
        console.log('edituje')
        let opt = new QuestionOption()
        opt.setId(parseInt(data.id))
        opt.delete()
        
      })
      // socket.on('upsertRule', async(data:{text:string,gameName:string})=>{
      //   console.log('upsertuje Rule')
      //   let find = await  RulesFinder.getIntance().findByName(data.gameName)
      //   let rule = new Rules()
      //   rule.setGameName(data.gameName)
      //   rule.setText(data.text)
      //   if (find!.length > 0){
      //     rule.setId(find![0].getId())
      //   }
       
        
      // })
      socket.on('insertQuestion', async(data:{text:string,isAnswer:boolean})=>{
        console.log('edituje')
        let opt = new QuestionOption()
        opt.setText(data.text)
        opt.setIsAnswer(data.isAnswer)
        opt.insert()
        let last = (await QuestionFinder.getIntance().findWithLastId())![0].getId()
        socket.edit('add Opt',{text:data.text,isAnswer:data.isAnswer,id:last+1})
        //addOption('editQuestion',data.text,data.isAnswer,last+1)
        
      })
      
      socket.on('loadQuestions',async()=>{
        let questions = await QuestionWithAnswersFinder.getIntance().findAll()

        let data: { questionId: number; optionId: number; questionText: string; optionText: string; author: string; isAnswer: boolean; }[] = []
        questions?.forEach((question) => {
          data.push({
            questionId: question.getQuestionId(),
            optionId: question.getOptionId(),
            questionText: question.getQuestionText(),
            optionText: question.getOptionText(),
            author: question.getAuthor(),
            isAnswer: question.getIsAnswer()})
        })
        
        socket.emit('loadedQuestions',data)
        socket.emit('picked')
      })

      socket.on('answerQuestion',async(msg:{id:number})=>{
        console.log('odchytil answerQuestion' )
        console.log(msg.id)
        let questions = await QuestionWithAnswersFinder.getIntance().findById(msg.id)
        let data: { questionId: number; optionId: number; questionText: string; optionText: string; author: string; isAnswer: boolean; }[] = []
        console.log(questions)

        questions?.forEach((question) => {
          data.push({
            questionId: question.getQuestionId(),
            optionId: question.getOptionId(),
            questionText: question.getQuestionText(),
            optionText: question.getOptionText(),
            author: question.getAuthor(),
            isAnswer: question.getIsAnswer()})
        })
      
        socket.emit('loadedAnswerQuestions',data)
      })

      socket.on('join Room',(msg:{roomName:string})=>{
        socket.join(msg.roomName)
      })
      socket.on('reload waiting room',(msg:{room:string})=>{
        let names:Array<{name:string,avatar:string}>= []
        GameManager.getActiveRooms().get(parseInt(msg.room)).getPlayers().forEach((player:any)=>{
          names.push({name:player.getAccount().getName(),avatar:player.getAccount().getAvatar()})
        }
        )
        console.log('emitol reload waiting')
        this.io.in(msg.room).emit('reloaded waiting room',{names:names})
      })

   
      

    
      
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
    //static setSocketToAccount()
}

module.exports = ServerSocket