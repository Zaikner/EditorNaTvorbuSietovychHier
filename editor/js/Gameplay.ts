import { spawnParagraph } from "./Elements";
import {canvas, doc,editor,elementDeleter} from './canvas'
import { editorSocket, texts} from './clientSocket.js'
import {pickTile} from './TileEditor'
import { Pawn } from "./Pawn";
import { Socket } from "socket.io";


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
    spawnParagraph(doc,"tileEditingPlace",'',texts[118]+name,true)
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
function throwDice(token:string){
    console.log('hodin throw dice')
    editor.getGame().setCanThrow(false)
    const params = new URLSearchParams(window.location.search);
    let t = 0
    let times = 0
    let n  = 0
    let interval = setInterval(function () {
        if (times == 10){
            const params = new URLSearchParams(window.location.search);
            clearInterval(interval)
            console.log('player emitol takyto hod:')
            console.log({room:params.get('id'),value:n,tileId:editor.getChoosenTile()?.getId()})
            
            editorSocket.emit('player thrown',{room:params.get('id'),token:token,value:n,tileId:editor.getChoosenTile()?.getId()})
            //document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
        }
        else{
            times++;
           
            n  = Math.floor(Math.random()*6)+1
            if (t!=n){
                t=n
                editorSocket.emit('show Dice',{id:params.get('id'),value:t})
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
    console.log(accs)
    let div = <HTMLDivElement>document.getElementById('waitingContainer')
    let divPlaying = <HTMLDivElement>document.getElementById('playingContainer')
    let divending = <HTMLDivElement>document.getElementById('endContainer')
    elementDeleter('waitingContainer')
    elementDeleter('playingContainer')
    elementDeleter('endContainer')
    let i = 0
  
    while (i < accs.length){
        
        let quest = document.createElement('button')
        quest.type = 'button';
        quest.classList.add("list-group-item","list-group-item-action","active")
        quest.style.backgroundColor = editor.getGame().getPawnStyle().get(accs[i].token)!.getColor()
        quest.style.textAlign =  'center';
        quest.textContent =accs[i].name
        div.appendChild(quest)

        let place = document.createElement('place')
        if (accs[i].place > 0){
            if (accs[i].place == 1){
                quest.textContent = texts[116] +  quest.textContent
            }
            else{
                quest.textContent = accs[i].place.toString()+texts[117] +  quest.textContent
            }
        }
     
   

        let questClone = quest.cloneNode()
        questClone.textContent =quest.textContent

        let questClone1 = quest.cloneNode()
        questClone1.textContent =quest.textContent

        divPlaying.appendChild(questClone)
        divending.appendChild(questClone1)
      

        let image:HTMLImageElement =<HTMLImageElement> document.createElement("IMG");
        image.src =accs[i].avatar
        image.style.width = '50px'
        image.style.height = '50px'
        image.style.textAlign = 'right'
        image.onload = function(){
            quest.appendChild(image)
            questClone.appendChild(image.cloneNode())
            questClone1.appendChild(image.cloneNode())

        }
        //if(accs[i].place != 0){
            // let place = document.createElement('place')
            // if (accs[i].place == 1){
            //     place.textContent = 'Winner !!'
            // }
            // else{
            //     place.textContent = accs[i].place.toString()+'. Place'
            // }
            // quest.appendChild(place)
            // questClone.appendChild(place.cloneNode())
        //}
       
        i++;
    }


    
   
}
export{initGameInfo,initDice,changeWaitingRoom,throwDice}