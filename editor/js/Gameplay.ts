import { spawnParagraph } from "./Elements";
import {doc,elementDeleter} from './canvas'


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
    console.log('document je doc:'+doc)
    let dice = new Image()
    dice.src = '../../src/Dice1.png'
    dice.id = 'Dice'
    dice.onload = function(){
        document.getElementById('dicePlace')?.append(dice)
        document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
    }
        
    for (let i = 1; i <=6; i++){
        let image = new Image()
        image.src = '../../src/Dice'+i+'.png'
        console.log()
        image.onload = function(){
            console.log(image.src)
            diceImages.push(image)
            console.log('loaded'+i)
        }
    }
}
function throwDice(){
    let t = 0
    let times = 0
    let interval = setInterval(function () {
        if (times == 10){
            console.log('vypol interaval')
            clearInterval(interval)
            document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
        }
        else{
            times++;
            console.log(times)
            let n  = Math.floor(Math.random()*6)+1
            if (t!=n){
                t=n
            }
            let image = new Image()
            image.src = '../../src/Dice'+t+'.png'
            image.id = 'Dice'
            console.log()
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
    elementDeleter('waitingContainer')
    let i = 0
  
    while (i < accs.length){
    
        let quest = document.createElement('button')
        quest.type = 'button';
        quest.classList.add("list-group-item","list-group-item-action","active","btn-danger")
        quest.style.textAlign =  'center';
        quest.textContent =accs[i].name
        div.appendChild(quest)

        let image:HTMLImageElement =<HTMLImageElement> document.createElement("IMG");
        image.src =accs[i].avatar
        image.style.width = '50px'
        image.style.height = '50px'
        image.style.textAlign = 'right'
        image.onload = function(){
            quest.appendChild(image)
        }
        i++;
    }


    console.log('vykonal change')
   
}
export{initGameInfo,initDice,changeWaitingRoom}