import { doc, elementDeleter } from "./canvas";
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
        console.log('ukazal InGameModal')
        
    }
}

export{Warning};