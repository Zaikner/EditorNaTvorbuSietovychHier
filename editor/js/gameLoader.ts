import { mainMenu } from "./canvas";
import { editorSocket, getCookie, texts } from "./clientSocket";
import { spawnButton, spawnDiv, spawnHeading, spawnSelectMenu } from "./Elements";
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor";

function loadGameMenu(names:Array<string>){
    removeAllButtons()
    removeAllListenersAdded()
    spawnHeading(document,'buttonPlace','',texts[15])
    let div = spawnDiv(document,'tileEditingPlace','divWrapper1',[])
   
    let menu = spawnSelectMenu(document,'divWrapper1','','',['btn','btn-secondary'],names)
    menu.style.float = 'left'
    let button = spawnButton(document,menu.parentElement!.id,'',['btn','btn-secondary','buttonLeftMargin'],texts[15],function(){
        removeAllButtons()
        editorSocket.emit('load game',{id:getCookie('id'),name:menu.value,response:true})
      
        mainMenu()
    })
    button.style.float='left'
    
}

export{loadGameMenu}