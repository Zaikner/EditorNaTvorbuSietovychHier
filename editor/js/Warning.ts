import { doc } from "./canvas";
import {spawnParagraph} from './Elements.js'

class Warning{
    static show(txt:string){
        spawnParagraph(doc,'modalBody','',txt)
        $('#exampleModal').modal('toggle')
    }
}

export{Warning};