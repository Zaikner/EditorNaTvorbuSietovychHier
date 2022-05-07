
import { game } from "./canvas"
import { isEditor, texts } from "./clientSocket"
import { spawnButton, spawnHeading, spawnSelectMenu, spawnTextArea } from "./Elements"
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor"

function rulesMenu(){
    removeAllButtons()
    removeAllListenersAdded()
    spawnHeading(document,'tileEditingPlace','',texts[16])
    let field:HTMLTextAreaElement;
    if (isEditor){
        field= spawnTextArea(document,'tileEditingPlace','ruleInput','',false)
    }
    else{
        field= spawnTextArea(document,'tileEditingPlace','ruleInput','',true)
    }
    //let field:HTMLTextAreaElement = spawnTextArea(document,'tileEditingPlace','ruleInput','',false)
    field.style.width = '120%;'
    field.style.height ='50%;'


    field.onchange = function(){
        game.setRules(field.value)
    }

}

export{rulesMenu}