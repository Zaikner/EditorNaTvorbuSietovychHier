import { spawnParagraph } from "./Elements";
import {doc,editor,editorSocket,elementDeleter} from './canvas'
import { Pawn } from "./Pawn";


const diceImages:Array<HTMLImageElement> = []
let dice:HTMLImageElement;
for (let i = 1; i <=6; i++){
    let image = new Image()
    image.src = '../../src/Dice1.png'
    image.onload = function(){
        diceImages.push(image)
    }
}
function initGameInfo(name:string){
    spawnParagraph(doc,"tileEditingPlace",'','Game: '+name)
}


function initDice(){
  
    let dice = new Image()
    dice.src = '../../src/Dice1.png'
    dice.id = 'Dice'
    dice.onload = function(){
        document.getElementById('dicePlace')?.append(dice)
        
    }
        
    for (let i = 1; i <=6; i++){
        let image = new Image()
        image.src = '../../src/Dice'+i+'.png'
       
        image.onload = function(){
            
            diceImages.push(image)
           
        }
    }
}
function throwDice(player:string,pawn:Pawn){
    let t = 0
    let times = 0
    let n  = 0
    let interval = setInterval(function () {
        if (times == 10){
            const params = new URLSearchParams(window.location.search);
            clearInterval(interval)
            console.log('player emitol takyto hod:')
            console.log({room:params.get('id'),player:player,value:n,tileId:editor.getChoosenTile()?.getId(),pawn:pawn.id})
            
            editorSocket.emit('player thrown',{room:params.get('id'),player:player,value:n,tileId:editor.getChoosenTile()?.getId(),pawn:pawn.id})
            //document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
        }
        else{
            times++;
           
            n  = Math.floor(Math.random()*6)+1
            if (t!=n){
                t=n
            }
            let image = new Image()
            image.src = '../../src/Dice'+t+'.png'
            image.id = 'Dice'
           
            image.onload = function(){
                let rem  = document.getElementById('Dice')
                elementDeleter('dicePlace')
                document.getElementById('dicePlace')?.append(image)
            }
        }
    
        //.getElementById('dicePlace')?.append(dice)
    }, 200);

}

function changeWaitingRoom(accs:any){
    let div = <HTMLDivElement>document.getElementById('waitingContainer')
    let divPlaying = <HTMLDivElement>document.getElementById('playingContainer')
    elementDeleter('waitingContainer')
    elementDeleter('playingContainer')
    let i = 0
  
    while (i < accs.length){
    
        let quest = document.createElement('button')
        quest.type = 'button';
        quest.classList.add("list-group-item","list-group-item-action","active","btn-danger")
        quest.style.textAlign =  'center';
        quest.textContent =accs[i].name
        div.appendChild(quest)
        let questClone = quest.cloneNode()
        questClone.textContent =accs[i].name
        divPlaying.appendChild(questClone)

        let image:HTMLImageElement =<HTMLImageElement> document.createElement("IMG");
        image.src =accs[i].avatar
        image.style.width = '50px'
        image.style.height = '50px'
        image.style.textAlign = 'right'
        image.onload = function(){
            quest.appendChild(image)
            questClone.appendChild(image.cloneNode())

        }
        i++;
    }


    
   
}
export{initGameInfo,initDice,changeWaitingRoom,throwDice}