import { doc, elementDeleter } from "./canvas";
import {spawnParagraph} from './Elements.js'

class Warning{
    static show(txt:string){
        elementDeleter('warningModalBody')
        let p = spawnParagraph(doc,'warningModalBody','',txt)
        $('#WarningModal').modal('toggle')
    }
}

export{Warning};