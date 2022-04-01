import { doc } from "./canvas";
import {spawnParagraph} from './Elements.js'

class Warning{
    static show(txt:string){
        let p = spawnParagraph(doc,'modalBody','',txt)
        $('#exampleModal').modal('toggle')
    }
}

export{Warning};