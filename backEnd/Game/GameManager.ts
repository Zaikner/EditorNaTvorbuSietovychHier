
import {Account_db} from '../../services/db/RDG/Account_db.js'
import { AccountFinder } from '../../services/db/RDG/AccountFinder.js';
const AccountManager = require('../Accounts/AccountManager.js')
import { Game_db } from '../../services/db/RDG/Game_db.js';
import { GameFinder } from '../../services/db/RDG/GameFinder_db.js';
import { TileFinder } from '../../services/db/RDG/TileFinder';
import { TextsFinder } from '../../services/db/RDG/TextFinder';
import { Tile_db } from '../../services/db/RDG/Tile_db.js';
import { BackgroundFinder } from '../../services/db/RDG/BackgroundFinder.js';
import { PawnFinder } from '../../services/db/RDG/PawnFinder.js';
import { PawnStyleFinder } from '../../services/db/RDG/PawnStyleFinder.js';
import { RulesFinder } from '../../services/db/RDG/RulesFinder.js';
import { Room } from './Room.js';
import { Player } from './Player.js';
import { ServerSocket } from '../../services/socket/SocketServer.js';
import { Account } from '../Accounts/Account.js';
import { BackgroundComponent_db } from '../../services/db/RDG/BackgroundComponent_db.js';
import { BackgroundComponentFinder } from '../../services/db/RDG/BackgroundComponentFinder.js';
//const Room = require('./Room.js')




export class GameManager{
    private static activeRooms:Map<number,Room> = new Map()
    public static async loadGame(name:string,author:string){
         let game = await GameFinder.getIntance().findByName(name)
            let tiles =await TileFinder.getIntance().findByGameId(game![0].getId())
            let background = await BackgroundFinder.getIntance().findById(game![0].getId())
            //let pawns = await PawnFinder.getIntance().findByGameId(game![0].getId())
            let styles = await PawnStyleFinder.getIntance().findByGameId(game![0].getId())
            let rules = await RulesFinder.getIntance().findByGameId(game![0].getId())
            //let backgroundComponents = await BackgroundComponentFinder.getIntance().findByName(name)
            let pawns:Array<{token:string,id:number,tileId:number}> = []
            
       return {author:author,pawns:pawns,game:game![0],tiles:tiles,background:background![0],styles:styles,rules:rules![0].getText()}
    }
    
    public static async loadTexts(){
        return {texts:await TextsFinder.getIntance().findAll()}
    }
    public static async createRoom(name:string,numOfPlayers:number,accId:number){
        //console.log('aspon vyvroil room')
        
        //let id = Math.floor(Math.random()*9000)+1000
        let stop = false
        let id = 0
        while(!stop){
            stop = true
            id++;
            this.activeRooms.forEach((room:Room)=>{
                if (room.getId()==id){
                    stop = false
                }
            })
        }
        
        let room = new Room(id,numOfPlayers,name)
        let acc = await AccountFinder.getIntance().findById(accId)
        let gameData =  await GameManager.loadGame(name,acc![0]!.getName())
       
        
        //console.log(room)
        this.activeRooms.set(id,room)
        //+ pushni hraca
        //   let pawns = await PawnFinder.getIntance().findByGameId(gameData.game.getId())

        // pawns!.forEach((pawn)=>{
           
        //     room.getPawnPositions().set(pawn.getId(),pawn.getTileId())
           
        // })
        
        let numOfPawns =  gameData.game.getNumOfPawnsPerTile()
        let pawnNumber = 1;
        let pawns:Array<{token:string,id:number,tileId:number}> = []
        gameData.tiles!.forEach((tile:any)=>{
          tile.isStartingFor.forEach((token:string)=>{
            for(let i = 0; i < numOfPawns;i++){
             room.getPawnPositions().set(pawnNumber,tile.id)
             pawns.push({token:token,id:pawnNumber,tileId:tile.id})
                 
                //[token, pawnNumber,tile.id])
             pawnNumber++;
            }
          })
        })
        gameData.pawns = pawns

        room.setGameData(gameData)
        return room
    }
    
    static findRoomBySocketId(socketId:string){
        Array.from(this.activeRooms.values()).forEach((room:Room)=>{
            room.getPlayers().forEach((player:Player)=>{
                if (player.getAccount().getSocketId() == socketId){
                    room.leave(player)
                    //ServerSocket.getIo().to(room.getId().toString()).emit('player left',{msg:'Player '+player.getAccount().getName()+' has left the room.'})
                 
                }
            })
        })
    }
    static getActivePlayers(acc:Account){
        let ret:Array<Array<any>> = []
        let rooms = Array.from(this.activeRooms.values())
        for (let i = 0; i < rooms.length;i++){
            rooms[i].getPlayers().forEach((player:Player)=>{
                //console.log(acc)
                ret.push([player.getAccount().getName(),rooms[i].getGameName(),rooms[i].getId(),function(){ 
                    rooms[i].join(new Player(acc,''))}])
            })
        }
        return ret
    }
  
    static closeInactiveRooms(){
    
    }
    
    static getActiveRooms(){
        return this.activeRooms
    }
    static setActiveRooms(newRooms:Map<number,Room>){
        return this.activeRooms = newRooms;
    }
    
}
module.exports = GameManager