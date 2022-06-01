import { doc, elementDeleter } from "./Canvas";
import {spawnParagraph} from './Elements.js'

class Warning{
    static show(txt:string){
        elementDeleter('warningModalBody')
        let p = spawnParagraph(doc,'warningModalBody','',txt,false)
        $('#WarningModal').modal('toggle')
    }
    static showInGame(txt:string){
        elementDeleter('InGameModalBody')

        let p = spawnParagraph(doc,'InGameModalBody','',txt,false)
        $('#InGameModal').modal('toggle')
  
    }
}

export{Warning};