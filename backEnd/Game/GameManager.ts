
import {Account_db} from '../../services/db/RDG/Account_db.js'
import { AccountFinder } from '../../services/db/RDG/AccountFinder.js';
import{Account} from '../Accounts/Account.js'
import { Game_db } from '../../services/db/RDG/Game_db.js';
import { GameFinder } from '../../services/db/RDG/GameFinder_db.js';
import { TileFinder } from '../../services/db/RDG/TileFinder';
import { Tile_db } from '../../services/db/RDG/Tile_db.js';
import { BackgroundFinder } from '../../services/db/RDG/BackgroundFinder.js';



class GameManager{
    public static async loadGame(name:string){
         let game = await GameFinder.getIntance().findByName(name)
            let tiles =await TileFinder.getIntance().findByName(name)
            let background = await BackgroundFinder.getIntance().findByName(name)
    
       return {game:game![0],tiles:tiles,background:background![0]}

      

       
    }
    
}
module.exports = GameManager