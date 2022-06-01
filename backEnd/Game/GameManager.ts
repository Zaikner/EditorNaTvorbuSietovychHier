
import { GameFinder } from '../../services/db/RDG/GameFinder_db.js';
import { TileFinder } from '../../services/db/RDG/TileFinder';
import { TextsFinder } from '../../services/db/RDG/TextFinder';
import { BackgroundFinder } from '../../services/db/RDG/BackgroundFinder.js';
import { PawnStyleFinder } from '../../services/db/RDG/PawnStyleFinder.js';
import { RulesFinder } from '../../services/db/RDG/RulesFinder.js';
import { Room } from './Room.js';
import { Player } from './Player.js';
import { ServerSocket } from '../../services/socket/SocketServer.js';
import { Account } from '../Accounts/Account.js';

export class GameManager{
    private static activeRooms:Map<number,Room> = new Map()
    public static async loadGame(name:string){
        let game = await GameFinder.getIntance().findByName(name)
        let tiles =await TileFinder.getIntance().findByGameId(game![0].getId())
        let background = await BackgroundFinder.getIntance().findById(game![0].getId())
        let styles = await PawnStyleFinder.getIntance().findByGameId(game![0].getId())
        let rules = await RulesFinder.getIntance().findByGameId(game![0].getId())
        let pawns:Array<{token:string,id:number,tileId:number}> = []
            
       return {pawns:pawns,
               game:game![0],
               tiles:tiles,
               background:background![0],
               styles:styles,
               rules:rules![0].getText()}
    }
    
    public static async loadTexts(){
        return {texts:await TextsFinder.getIntance().findAll()}
    }
    public static reloadTables(){
        let rooms = GameManager.getActiveRoomsTable()
        let players = GameManager.getActivePlayersTable()
        ServerSocket.getIo().emit('refresh lobby',rooms,players)
    }
    public static async createRoom(name:string,numOfPlayers:number,accId:number){
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
        let gameData =  await GameManager.loadGame(name)
       
        this.activeRooms.set(id,room)
     
        let numOfPawns =  gameData.game.getNumOfPawnsPerTile()
        let pawnNumber = 1;
        let pawns:Array<{token:string,id:number,tileId:number}> = []
        gameData.tiles!.forEach((tile:any)=>{
          tile.isStartingFor.forEach((token:string)=>{
            for(let i = 0; i < numOfPawns;i++){
             room.getPawnPositions().set(pawnNumber,tile.id)
             pawns.push({token:token,id:pawnNumber,tileId:tile.id})
             pawnNumber++;
            }
          })
        })
        gameData.pawns = pawns

        room.setGameData(gameData)
        this.reloadTables()
        return room
    }
    
    static findRoomBySocketId(socketId:string){
        Array.from(this.activeRooms.values()).forEach((room:Room)=>{
            room.getPlayers().forEach((player:Player)=>{
                if (player.getAccount().getSocketId() == socketId){
                    room.leave(player)
                }
            })
        })
    }
    static getActivePlayers(acc:Account){
        let ret:Array<Array<any>> = []
        let rooms = Array.from(this.activeRooms.values())
        for (let i = 0; i < rooms.length;i++){
            rooms[i].getPlayers().forEach((player:Player)=>{
                ret.push([player.getAccount().getName(),rooms[i].getGameName(),rooms[i].getId(),function(){ 
                    rooms[i].join(new Player(acc,''))},rooms[i].getHasStarted()|| (rooms[i].getNumOfPlayers() == rooms[i].getMaxPlayers())])
            })
        }
        return ret
    }
    static getActivePlayersTable(){
        let ret:Array<Array<any>> = []
        let rooms = Array.from(this.activeRooms.values())
        for (let i = 0; i < rooms.length;i++){
            rooms[i].getPlayers().forEach((player:Player)=>{
                ret.push([player.getAccount().getName(),rooms[i].getGameName(),rooms[i].getId(),rooms[i].getHasStarted()|| (rooms[i].getNumOfPlayers() == rooms[i].getMaxPlayers())])
            })
        }
        return ret
    }
    static getActiveRoomsTable(){
        let ret:Array<Array<any>> = []
        let rooms = Array.from(this.activeRooms.values())
        for (let i = 0; i < rooms.length;i++){
          let txt =  "Miestnosť: "+rooms[i].getId()+ "  Hra: "+ rooms[i].getGameName()+"   Hráči:  "+ rooms[i].getPlayers().length+'/'+rooms[i].getMaxPlayers()
          ret.push([rooms[i].getId(),rooms[i].getGameName(),rooms[i].getHasStarted()|| (rooms[i].getNumOfPlayers() == rooms[i].getMaxPlayers()),txt])
        }
        return ret
    }
  
    static async gameExists(name:string){
        let existingGames = await GameFinder.getIntance().findByName(name)
        return existingGames!.length>0
    }
    
    static getActiveRooms(){
        return this.activeRooms
    }
    static setActiveRooms(newRooms:Map<number,Room>){
        return this.activeRooms = newRooms;
    }
    
}
module.exports = GameManager