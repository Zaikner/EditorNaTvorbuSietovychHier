
import { Server as ioServer } from "socket.io";

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
const path = require('path');
const AccountManager = require('../../backEnd/Accounts/AccountManager.js')
const GameManager = require('../../backEnd/Game/GameManager.js')
class ServerSocket{
    private static io:ioServer;
    

    static serverListen(){
        this.io.on('connection', (socket:any) => {
            console.log('a user connected');
            console.log(socket.id)
            socket.emit('pipi')
            
            socket.on('load game',async (msg:{id:string,name:string}) => {
                    console.log('aspon emitol load game')
                    let acc = AccountManager.getAccountByClientId(msg.id)
                    acc.setSocketId(msg.id)
                    // let game = await GameFinder.getIntance().findByName(msg.name)
                    // let tt =await TileFinder.getIntance().findByName(msg.name)
                    // let background = await BackgroundFinder.getIntance().findByName(msg.name)
                
                   
                   console.log('toto returnol:'+await GameManager.loadGame(msg.name))
                   console.log(await GameManager.loadGame(msg.name))
                    this.emitToSpecificSocket(socket.id,'connected', await GameManager.loadGame(msg.name))
                    console.log('zapol som hru'+ msg.name);
            });
            
            socket.on('disconnect', () => {
                    console.log('user disconnected');
            });
        socket.on('saveGame',async (data:any) => {
      
      console.log('odchytil')
        console.log(data)
        console.log('odchytil')
        let last = await TileFinder.getIntance().findLast()
        let lastId = last?.getId()

        let g = new Game_db()
        g.setAuthor(data.author)
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
    //static setSocketToAccount()
}

module.exports = ServerSocket