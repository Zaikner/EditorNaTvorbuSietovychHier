
import {Account_db} from '../../services/db/RDG/Account_db.js'
import { AccountFinder } from '../../services/db/RDG/AccountFinder.js';
const AccountManager = require('../Accounts/AccountManager.js')
import { Game_db } from '../../services/db/RDG/Game_db.js';
import { GameFinder } from '../../services/db/RDG/GameFinder_db.js';
import { TileFinder } from '../../services/db/RDG/TileFinder';
import { Tile_db } from '../../services/db/RDG/Tile_db.js';
import { BackgroundFinder } from '../../services/db/RDG/BackgroundFinder.js';
import { PawnFinder } from '../../services/db/RDG/PawnFinder.js';
import { PawnStyleFinder } from '../../services/db/RDG/PawnStyleFinder.js';
import { RulesFinder } from '../../services/db/RDG/RulesFinder.js';
import { Room } from './Room.js';
//const Room = require('./Room.js')




class GameManager{
    private static activeRooms:Map<number,Room> = new Map()
    public static async loadGame(name:string){
         let game = await GameFinder.getIntance().findByName(name)
            let tiles =await TileFinder.getIntance().findByName(name)
            let background = await BackgroundFinder.getIntance().findByName(name)
            let pawns = await PawnFinder.getIntance().findByName(name)
            let styles = await PawnStyleFinder.getIntance().findByName(name)
            let rules = await RulesFinder.getIntance().findByName(name)
            console.log('nasiel tieto pravidla')
            console.log(rules)
       return {game:game![0],tiles:tiles,background:background![0],pawns:pawns,styles:styles,rules:rules![0].getText()}
    }
      
    public static async createRoom(name:string,numOfPlayers:number){
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
        console.log(room)
        this.activeRooms.set(id,room)
        //+ pushni hraca
        return room
    }
  
    public static getActiveRooms(){
        return this.activeRooms
    }
    public static setActiveRooms(newRooms:Map<number,Room>){
        return this.activeRooms = newRooms;
    }
    
}
module.exports = GameManager