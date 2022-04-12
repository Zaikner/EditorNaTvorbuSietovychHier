import { doc, elementDeleter } from "./canvas";
import {spawnParagraph} from './Elements.js'

class Warning{
    static show(txt:string){
        elementDeleter('warningModalBody')
      
        
        let p = spawnParagraph(doc,'warningModalBody','',txt)
        $('#WarningModal').modal('toggle')
    }
    static showInGame(txt:string){
        elementDeleter('InGameModalBody')
      
        
        let p = spawnParagraph(doc,'InGameModalBody','',txt)
        $('#InGameModal').modal('toggle')
        console.log('ukazal InGameModal')
        
    }
}

export{Warning};