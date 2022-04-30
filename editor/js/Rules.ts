
import { editor } from "./canvas"
import { texts } from "./clientSocket"
import { spawnButton, spawnHeading, spawnSelectMenu, spawnTextArea } from "./Elements"
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor"

function rulesMenu(){
    removeAllButtons()
    removeAllListenersAdded()
    spawnHeading(document,'tileEditingPlace','',texts[16])

    let field:HTMLTextAreaElement = spawnTextArea(document,'tileEditingPlace','ruleInput','')
    field.style.width = '120%;'
    field.style.height ='50%;'


    field.onchange = function(){
        editor.getGame().setRules(field.value)
    }

}

export{rulesMenu}