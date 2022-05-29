import { ctx, game, initNewGame, mainMenu, reload } from "./Canvas";
import { editorSocket, getCookie, texts } from "./ClientSocket";
import { spawnButton, spawnDiv, spawnHeading, spawnSelectMenu } from "./Elements";
import { removeAllButtons, removeAllListenersAdded } from "./TileEditor";


function loadGameMenu(names:Array<string>,authored:Array<string>){
    removeAllButtons()
    removeAllListenersAdded()
    spawnHeading(document,'buttonPlace','',texts[15])
    let div = spawnDiv(document,'tileEditingPlace','divWrapper1',[])
   
    let menu = spawnSelectMenu(document,'divWrapper1','','',['btn','btn-secondary'],names,authored)
    menu.style.float = 'left'
    let button = spawnButton(document,menu.parentElement!.id,'',['btn','btn-secondary','buttonLeftMargin'],texts[251],function(){
        removeAllButtons()
        editorSocket.emit('load game',{id:getCookie('id'),name:menu.value,response:true})
      
        mainMenu()
    })
    button.style.float='right'
    //button.style.marginRight = '30%'

    button = spawnButton(document,'tileEditingPlace',texts[252],['btn','btn-secondary'],texts[252],function(){
        initNewGame()
        reload(ctx)
    })
    button.style.float='right'
    button.style.marginTop='20px';

    
    

    spawnButton(document,'tileEditingPlace',texts[260],['btn','btn-secondary'],texts[260],function(){
        $('#deleteGameModal').modal('show')
    })
       

   
}

export{loadGameMenu}