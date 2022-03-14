
import {Account_db} from '../../services/db/RDG/Account_db.js'
import { AccountFinder } from '../../services/db/RDG/AccountFinder.js';
const AccountManager = require('../Accounts/AccountManager.js')
import { Game_db } from '../../services/db/RDG/Game_db.js';
import { GameFinder } from '../../services/db/RDG/GameFinder_db.js';
import { TileFinder } from '../../services/db/RDG/TileFinder';
import { Tile_db } from '../../services/db/RDG/Tile_db.js';
import { BackgroundFinder } from '../../services/db/RDG/BackgroundFinder.js';
const Room = require('./Room.js')




class GameManager{
    private static activeRooms:Array<typeof Room> = []
    public static async loadGame(name:string){
         let game = await GameFinder.getIntance().findByName(name)
            let tiles =await TileFinder.getIntance().findByName(name)
            let background = await BackgroundFinder.getIntance().findByName(name)
    
       return {game:game![0],tiles:tiles,background:background![0]}
    }
      
    public static async createRoom(name:string,numOfPlayers:number){
        let id = Math.floor(Math.random()*9000)+1000

        let room = new Room(id,numOfPlayers,name)
        console.log(room)
        this.activeRooms.push(room)
        //+ pushni hraca
        return room
    }
    public static getActiveRooms(){
        return this.activeRooms
    }
    public static setActiveRooms(newRooms:Array<typeof Room>){
        return this.activeRooms = newRooms;
    }
    
}
module.exports = GameManager