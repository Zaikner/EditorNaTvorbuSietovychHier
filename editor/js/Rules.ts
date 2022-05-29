
import { game,elementDeleter } from "./Canvas"
import { isEditor, texts } from "./ClientSocket"
import { spawnButton, spawnHeading, spawnSelectMenu, spawnTextArea } from "./Elements"
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor"

function rulesMenu(){ 
    removeAllListenersAdded()
    let field:HTMLTextAreaElement;
    if (isEditor){
        removeAllButtons()
        spawnHeading(document,'tileEditingPlace','',texts[16])
        field= spawnTextArea(document,'tileEditingPlace','ruleInput','',false)
        field.style.width = '120%;'
        field.style.height ='50%;'
    }
    else{
        field=(<HTMLTextAreaElement>document.getElementById('ruleInput'))!
        $('#rulesModal').modal('show');
    }
  
    field.onchange = function(){
        game.setRules(field.value)
    }
}

export{rulesMenu}