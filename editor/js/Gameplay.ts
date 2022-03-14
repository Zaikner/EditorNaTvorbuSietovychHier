import { spawnParagraph } from "./Elements";
import {doc} from './canvas'

function initGameInfo(name:string){
    spawnParagraph(doc,"tileEditingPlace",'','Game: '+name)
}

export{initGameInfo}