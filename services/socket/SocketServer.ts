
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

import { QuestionWithAnswersFinder } from "../db/RDG/QuestionWithAnswersFinder";
import { Pawn } from "../db/RDG/Pawn";
import { PawnStyles } from "../db/RDG/PawnStyle";

import { Rules } from "../db/RDG/Rules";

import { TextsFinder } from "../db/RDG/TextFinder";
import { Texts } from "../db/RDG/Texts";
import { BackgroundComponent } from "../../editor/js/BackgroundComponent";
import { BackgroundComponent_db } from "../db/RDG/BackgroundComponent_db";
import { BackgroundComponentFinder } from "../db/RDG/BackgroundComponentFinder";
import { PawnFinder } from "../db/RDG/PawnFinder";
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
              console.log('ohlasil sa:' + acc.getName())
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
          
          console.log('saved game:')
          console.log(data)
          let acc = AccountManager.getAccountByClientId(data.clientId)
          let existingGames = await GameFinder.getIntance().findByName(data.name)
          let lastGame = await GameFinder.getIntance().findLast()
          console.log('prebehli vsetkz queries')
          console.log(acc)
          console.log(existingGames)
          console.log(lastGame)
          let id =0
          if (existingGames!.length > 0){
            if (existingGames![0].getAuthorId()!= acc.getId()){
              socket.emit('not author')

              return
            }
            else{
              console.log('je author a chce zmenit')
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
            console.log('neexistuje taka hra')
            console.log(existingGames)
          }
        let last = await TileFinder.getIntance().findLast()
        let lastId = last?.getId()
      
        await TileFinder.getIntance().deleteByGameId(id)
        await BackgroundComponentFinder.getIntance().deleteByGameName(data.name)
        await PawnFinder.getIntance().deleteByName(data.name)
        await PawnStyleFinder.getIntance().deleteById(id)

        console.log('ucet je:'+ acc)
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
          t.setTurnsToSetFree(tile.turnToSetFree)
          t.setRandomQuestion(tile.randomQuestion)
          t.insert()
        })
        g.upsert()
      

        let b = new Background_db()
        b.setGameId(id)
        b.setColor(data.background.color)
        b.setImage(data.background.backgroundImage)
        data.background.components.forEach((comp:any)=>{
          let c = new BackgroundComponent_db()
          c.setGameName(data.name)
          c.setImage(comp.image)
          c.setColor(comp.color)
          c.setType(comp.type)
          c.setCenterX(comp.centerX)
          c.setCenterY(comp.centerY)
          c.setX1(comp.x1)
          c.setX2(comp.x2)
          c.setY1(comp.y1)
          c.setY2(comp.y2)
          c.setRadius(comp.radius)
        
          c.setStroke(comp.stroke)
          c.setStrokeColor(comp.strokeColor)
        
          c.setImageWidth(comp.imageWidth)
          c.setImageHeight(comp.imageHeigth)
          c.insert()
          console.log(c)

        })
        b.upsert()


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
        console.log('dostal set Socket')
        console.log(msg)
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
         
          if (!r.getHasStarted() && cont){
            //r.join(new Player(acc,'spectator'))
            r.join(new Player(acc,'Player '+(r.getNumOfPlayers()+1)))}
          // }
          // else if (cont){
          //   r.join(new Player(acc,'Player '+(r.getNumOfPlayers()+1)))
          // }
         
      
     
 
      }
      
      )
     
      socket.on('game has started',(msg:{room:string})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        r.setHasStarted(true)
        
        this.io.in(msg.room).emit('game started',{msg:'Game has started!',tokens:r.getPlayers().map((p:any)=>p.getToken())})
        this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
     
        this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
      }
        
      
        )
      
      socket.on('move pawns',(msg:{room:string,pawn:number,value:number})=>{
        this.io.in(msg.room).emit('move Pawn',{pawn:msg.pawn,value:msg.value})
      })
      socket.on('move pawns back',(msg:{room:string,pawn:number,value:number})=>{
        console.log('posunul dozadu o ' + msg.value)
        this.io.in(msg.room).emit('move Pawn back',{pawn:msg.pawn,value:msg.value})
      })

    
      socket.on('player thrown',(msg:{room:string,token:string,value:number,tileId:number})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        if (r.getPlayerOnTurn().getMustThrown()!=0){
          if (r.getPlayerOnTurn().getMustThrown()!=msg.value){
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
            r.getPlayerOnTurn().setTurnsToSetFree( r.getPlayerOnTurn().getTurnsToSetFree()-1)
            
            socket.emit('react to event:must Thrown',{token: r.getPlayerOnTurn().getAccount().getName(),value:r.getPlayerOnTurn().getMustThrown(),turnsLeft:r.getPlayerOnTurn().getTurnsToSetFree()})
            if ( r.getPlayerOnTurn().getTurnsToSetFree() == 0){
              r.getPlayerOnTurn().setMustThrown(0)
            }
            
          }
          else{
            r.getPlayerOnTurn().setMustThrown(0)
            r.getPlayerOnTurn().setTurnsToSetFree(0)
            socket.emit('canMovePawn',{value:msg.value,token:msg.token})
          }
        }
        else{
          socket.emit('canMovePawn',{value:msg.value,token:msg.token})
        }
        console.log('recieved player thrown' +msg.token)
        console.log('emited movePawn')
        //this.io.in(msg.room).emit('move Pawn',{pawn:msg.pawn,value:msg.value})
        
        
      })
      
      socket.on('show Dice',(msg:{id:string,value:number})=>{
        
        socket.to(msg.id).emit('show Dice value',{value:msg.value})
      })
      socket.on('react to tile',async (msg:{room:string,questionId:number,randomQuestion:boolean,id:string,returnValue:number,pawnId:number,repeat:number,skip:number,forward:number,backward:number,turnsToSetFree:number,mustThrown:number,canRemovePawnIds:Array<number>})=>{
        //returnValue
        console.log('recieved react to tile id: '+msg.id)
        console.log(msg)
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        if (r.getPlayerOnTurn().getAccount().getSocketId() ==  socket.id){
          this.io.in(msg.room).emit('return pawns to starting tile',{ids:msg.canRemovePawnIds})
          this.io.in(msg.room).emit('ended turn')
          if (msg.randomQuestion){
            console.log('nasiel otazku')
            r.setReturnValue(msg.returnValue)
            r.setChoosedPawnId(msg.pawnId)
            let author = (await GameFinder.getIntance().findByName(r.getGameName()))!

            let allQuesstions = await QuestionWithAnswersFinder.getInstance().findByAuthor(author[0]!.getAuthorId())
            let randomId  = allQuesstions![Math.floor(Math.random()*allQuesstions!.length)]!.getQuestionId()
            let questions = await QuestionWithAnswersFinder.getInstance().findById(randomId)
            let data: { questionId: number; optionId: number; questionText: string; optionText: string; authorId: number; isAnswer: boolean;}[] = []
            console.log(questions)
    
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
          else if (msg.questionId >= 0){
            console.log('nasiel otazku')
            r.setReturnValue(msg.returnValue)
            r.setChoosedPawnId(msg.pawnId)
            let questions = await QuestionWithAnswersFinder.getInstance().findById(msg.questionId)
            let data: { questionId: number; optionId: number; questionText: string; optionText: string; authorId: number; isAnswer: boolean;}[] = []
            console.log(questions)
    
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
          else if(msg.skip > 0){
            r.getPlayerOnTurn().setSkip(msg.skip)
            
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
          }
          else if(msg.repeat > 0){
            r.getPlayerOnTurn().setRepeat(msg.repeat)
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
          }
          
          else if(msg.forward > 0){
            socket.emit('react to event: forward',{value:msg.forward,pawnId:msg.pawnId})
          }
          else if(msg.backward > 0){
            console.log('react to event: backward emitol')
            console.log({value:msg.backward})
            socket.emit('react to event: backward',{value:msg.backward,pawnId:msg.pawnId})  
          }
          else if(msg.mustThrown > 0){
            r.getPlayerOnTurn().setMustThrown(msg.mustThrown)
            r.getPlayerOnTurn().setTurnsToSetFree(msg.turnsToSetFree)
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
          }
          else{
            socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
            // r.nextTurn()
      
            // //console.log(r)
       
            // this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
            // this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
   
          }

    
        }
        else{
          console.log([r.getPlayerOnTurn().getAccount().getSocketId(),socket.id])
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
        else{
        
          //console.log([socket.id, r.getPlayerOnTurn().getAccount().getSocketId()])
        }
        
       
      })
       
      socket.on('showAnswersToOthers',(msg:{room:string,wrong:Array<string>,right:Array<string>})=>{
        socket.to(msg.room).emit('loadAnswersToOthers',{wrong:msg.wrong,right:msg.right})

      })
      socket.on('evaluated end',(msg:{is:boolean,room:string,token:string})=>{
        console.log('odchyil evaluetedEnd')
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          return
        }
        let player = r.findPlayerByToken(msg.token)

        if(msg.is == true &&  !r.getPlayersWhichEnded().includes(player)){
          
          r.getPlayersWhichEnded().push(player)
          let place = r.getPlayersWhichEnded().length
          r
          console.log(r.getPlayersWhichEnded())
          console.log(msg.is,msg.token,place)
          player.setPlace(place)
          console.log('prisiel aspon po emit')
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
          //dorobit
          //GameManager.getActiveRooms().delete(r.getId())
        }
        else{
          let stop = true
          r.nextTurn()
          if (r.getPlayerOnTurn().getSkip() !=0){
            //r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
            this.io.in(msg.room).emit('react to event: skip',{token: r.getPlayerOnTurn().getAccount().getName(),left:r.getPlayerOnTurn().getSkip()-1})
            stop = false
          }
          while(!stop){
            console.log('skipped:' + r.getPlayerOnTurn().getAccount().getName())
            console.log('skipped:' + r.getPlayerOnTurn().getSkip())
            
            
            if (r.getPlayerOnTurn().getSkip() ==0){
                 stop = true
            }
            else{
              r.getPlayerOnTurn().setSkip(r.getPlayerOnTurn().getSkip()-1)
              r.nextTurn()
              //this.io.in(msg.room).emit('react to event: skip',{token: r.getPlayerOnTurn().getToken(),left:r.getPlayerOnTurn().getSkip()})
            }
          }
          console.log('ide:'+ r.getPlayerOnTurn().getAccount().getName())
          //console.log(r)
     
          this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
          this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
          
          r.setReturnValue(-1)
          r.setChoosedPawnId(-1)
        }
      
      })

      socket.on('wasRightAnswer',(msg:{is:boolean,room:string})=>{
        let r = GameManager.getActiveRooms().get(parseInt(msg.room))

        if (!msg.is){
          console.log('vratil spat figurku ,lebo bol false')
          this.io.in(msg.room).emit('return Pawn to place',{pawnId:r.getChoosedPawnId(),value:r.getReturnValue()})
          r.getPawnPositions().set(r.getChoosedPawnId(),r.getReturnValue())
         }
        else{
          console.log('bol true')
        }
      
      
        //console.log(r)
        socket.emit('evaluate End',{token:r.getPlayerOnTurn().getToken()})
        // this.io.in(msg.room).emit('turn',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})
        // this.io.to(r.getPlayerOnTurn().getAccount().getSocketId()).emit('turnMove',{player:r.getPlayerOnTurn().getAccount().getName(),token:r.getPlayerOnTurn().getToken()})

   
        // r.setReturnValue(-1)
        // r.setChoosedPawnId(-1)
      })
      socket.on('join player to Room',(msg:{id:string,roomId:string})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
        if(acc === undefined){
          return
        }
        socket.join(msg.roomId)
        
        let r = GameManager.getActiveRooms().get(parseInt(msg.roomId))
        let isSpectator = r.isSpectator(acc)
        
        // if (r.getHasStarted() || isSpectator){
        //   console.log('emitol spravne')
        //   this.io.in(msg.roomId).emit('player joined',{msg:'Player '+ acc.getName() + ' has joined the room.(spectating)'})

        // }
        // else{
          this.io.in(msg.roomId).emit('player joined',{msg:'Player '+ acc.getName() + ' has joined the room.'})
        //}
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

      socket.on('newQuestion', async(data:{question:string,options:Array<{txt:string,isAnswer:boolean,id:string}>,id:string,questionId:number})=>{
        let quest = new Question()
        let lastQuest = await QuestionFinder.getIntance().findWithLastId()
        let acc = AccountManager.getAccountByClientId(data.id)
      
        QuestionWithAnswersFinder.getInstance().deleteOptionsByQuestionId(data.questionId)
        console.log('options na servery su:')
        console.log(data.options)
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
        //quest.setAuthor(AccountManager.getAccountByClientId(data.id).getName()) -->ked bude fungovat user

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
          console.log('posunul'+lastId)
          // if (elem.id == undefined){
          //     option.setId(<number>lastId)
          //     lastId++;
          //     console.log('posunul'+lastId)
          // }
          // else{
          //   option.setId(parseInt(elem.id))
          //   console.log(elem.id)
          //   console.log('nastavil id:' + elem.id)
          // }
          option.setText(elem.txt)
          option.setQuestionId(id)
          option.setIsAnswer(elem.isAnswer)
  
          console.log(option)
          option.insert()
        })
        
        //console.log(await QuestionWithAnswersFinder.getIntance().findAll())
      })
  
      socket.on('deleteQuestion', async(data:{questionId:string,id:string})=>{
        console.log('edituje')
        let acc = AccountManager.getAccountByClientId(data.id)
        let can = (await TileFinder.getIntance().findByQuestionId(parseInt(data.questionId)))!.length == 0
        let questionNumber = (await QuestionFinder.getIntance().findAllByAuthorId(acc.getId()))!.length
        let lastRandomQuestion = (await TileFinder.getIntance().findByAuthorAndRandomQuestion(acc.getName()))!.length > 0
        
        //DOPLNIT AUTHORA
      
        console.log('can je:' + can)
        console.log('questionNumber je' + questionNumber)
        console.log('number of question for author'+ lastRandomQuestion)
      
        if(questionNumber == 1 && lastRandomQuestion){
          socket.emit('random and 0')
        }
        else   if ((await TileFinder.getIntance().findByQuestionId(parseInt(data.questionId)))!.length == 0){
          QuestionWithAnswersFinder.getInstance().deleteOptionsByQuestionId(parseInt(data.questionId))
          let quest= new Question()
          quest.setId(parseInt(data.questionId))
          quest.delete()
        }
        else{
          socket.emit('question is used')
        }


       
        
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
      
      socket.on('loadQuestions',async(msg:{id:string,pick:boolean})=>{
        let acc = AccountManager.getAccountByClientId(msg.id)
  
        let questions = await QuestionWithAnswersFinder.getInstance().findByAuthor(acc.getId())

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
        console.log('odchytil answerQuestion' )
        console.log(msg.id)
        let questions = await QuestionWithAnswersFinder.getInstance().findById(msg.id)
        let data: { questionId: number; optionId: number; questionText: string; optionText: string; authorId: number; isAnswer: boolean; }[] = []
        console.log(questions)

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

      socket.on('get texts',async (msg:{language:string})=>{
        let texts:Array<string> = []
        if (msg.language == 'SK'){
          texts = (await TextsFinder.getIntance().findAll())!.map((txt:Texts)=>txt.getSK())
        }
        else{
          texts = (await TextsFinder.getIntance().findAll())!.map((txt:Texts)=>txt.getEN())
        }


        socket.emit('got texts',{text:texts})
      })
      socket.on('join Room',(msg:{roomName:string})=>{
        socket.join(msg.roomName)
      })
      socket.on('reload waiting room',(msg:{room:string})=>{
        let r =  GameManager.getActiveRooms().get(parseInt(msg.room))
        if (r == undefined){
          socket.emit('exit to main menu')
          console.log('exitol bo nebola roomka')
          return
        }
        let names:Array<{name:string,avatar:string,place:number,token:string}>= []
        r.getPlayers().forEach((player:any)=>{
          names.push({name:player.getAccount().getName(),avatar:player.getAccount().getAvatar(),place:player.getPlace(),token:player.getToken()})
        }
        )
        console.log('emitol reload waiting')
        this.io.in(msg.room).emit('reloaded waiting room',{names:names})
      })
      socket.on('loadGameNames',async()=>{
        let names = (await GameFinder.getIntance().findAll())!.map((game) => game.getName())
        socket.emit('loadedGameNames',{names:names})
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