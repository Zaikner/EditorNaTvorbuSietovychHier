import { ctx, game, initNewGame, mainMenu, reload } from "./canvas";
import { editorSocket, getCookie, texts } from "./clientSocket";
import { spawnButton, spawnButtonWithLabel, spawnDiv, spawnHeading, spawnSelectMenu } from "./Elements";
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
    button.style.float='right'
    //button.style.marginRight = '30%'

    button = spawnButton(document,'tileEditingPlace',texts[199],['btn','btn-secondary'],texts[199],function(){
        initNewGame()
        reload(game,ctx)
    })
    button.style.float='right'
    button.style.marginTop='20px';
}

export{loadGameMenu}