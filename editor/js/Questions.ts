import { doc, game,  elementDeleter, mainMenu} from './Canvas'
import { editorSocket,clickFunction,texts} from './ClientSocket.js'
import { spawnButton, spawnDiv, spawnHeading } from './Elements';
import { removeAllButtons, removeAllListenersAdded, update } from './TileEditor';
import { Warning } from './Warning';

let num = 0
let newQuestions:Array<number> = []
let givenOptions = 0


function initCreation(){
    removeAllButtons()

    spawnHeading(document,'buttonPlace','',texts[243])
    newQuestions = []
    num = 0
    let div = doc.createElement('div')
    div.classList.add("form-group")
    div.id = 'questionDiv'
    
    let text = doc.createElement('input')
    text.type = 'text'
    text.id = 'question'
    text.classList.add('form-control')
    text.name = 'question'
    text.required = true
    text.style.width = '50%'
    text.placeholder = 'Sem napíš otázku'
    text.style.marginBottom = '3%'
   
    let label = doc.createElement('label')
    label.style.color='white'
    label.htmlFor = text.id
    label.textContent = texts[66] 
    
   
    div.appendChild(label)
    div.appendChild(text)
    
    div.style.marginBottom = '5px'
    div.style.width = '100%'
    document.getElementById('questionPlace')!.appendChild(div)

    addOption('questionPlace','',false)
    addOption('questionPlace','',false)
  
    //div = spawnDiv(document,'tileEditingPlace','buttonDiv',[])
    div = document.createElement('div')
    div.style.display = 'flex'
    div.id = 'addDiv'
    document.getElementById('tileEditingPlace')!.appendChild(div)

    let but = spawnButton(document,'addDiv','',['btn','btn-secondary'],texts[67],function(){addOption('questionPlace','',false)})
    div = document.createElement('div')
    div.style.display = 'flex'
    div.id = 'buttonDiv'
    div.style.marginTop = '3%'
    document.getElementById('tileEditingPlace')!.appendChild(div)
   
    but = spawnButton(document,'buttonDiv','',['btn','btn-secondary'],texts[58],function(){createQuestion(-1);})
    but.style.whiteSpace = 'nowrap'
    but=spawnButton(document,'buttonDiv','',['btn','btn-secondary','buttonLeftMargin'],texts[70],function(){ editorSocket.emit('loadQuestions',{id:localStorage.getItem('id'),pick:false})})
    but.style.whiteSpace = 'nowrap'
    but=spawnButton(document,'buttonDiv','',['btn','btn-secondary','buttonLeftMargin'],texts[242],function(){initCreation()})
    but.style.whiteSpace = 'nowrap'
}


function renumOptions(){
    let i = 1;
    let n = 1;

    while(n<= num){
        let text:HTMLInputElement = <HTMLInputElement>document.getElementById('ans'+i)
        let check:HTMLInputElement = <HTMLInputElement>document.getElementById('check'+i)
        if (text == undefined){
            i++;

            text =<HTMLInputElement>document.getElementById('ans'+i)
            check = <HTMLInputElement>document.getElementById('check'+i)
        }
        if (text != undefined){
            text.placeholder = 'Zadaj odpoveď číslo: '+n 
            text.id = 'ans'+n

            check.id = 'check'+n
        }
       
        i++;
        n++
       
    }
   
}
function addOption(parent:string,txt:string,is:boolean,id:number=-1){
     num++;
     let div = doc.createElement('div')
     div.classList.add("form-group")
     div.style.width='100%'
     div.style.display = 'flex'
    
     let text = doc.createElement('input')
     text.type = 'text'
     text.id = 'ans'+num
     text.classList.add('form-control')
     text.name = 'ans'+num
     text.required = true
     text.value = txt
     text.style.width = '50%'
     text.placeholder = 'Zadaj odpoveď číslo: '+num
     if (id > 0){
       
        text.setAttribute('optionId',id.toString())
     }
     

     let check = doc.createElement('input')
     check.type = 'checkbox'
     check.id = 'check'+num
     check.style.width = '20px'
     
     check.classList.add('form-control')
     check.name = 'check'+num
     check.checked = is
     

     let labelCheck:HTMLLabelElement = doc.createElement('label')
     labelCheck.htmlFor = check.id
     labelCheck.textContent = 'správne '
     labelCheck.style.color = 'white'
    
     labelCheck.style.fontSize = '20px'
   
     div.appendChild(text)

        
 newQuestions.push(num.valueOf())

 let deleteButton = document.createElement('button')
 deleteButton.textContent = texts[70]
 deleteButton.type = 'button'
 deleteButton.classList.add('btn')
 deleteButton.classList.add('btn-secondary')
 deleteButton.style.whiteSpace = 'nowrap'
 deleteButton.addEventListener('click',function(){
     newQuestions = newQuestions.filter((p) => {return p != (num+1)});
     document.getElementById(parent)?.removeChild(div)
     num--;
     renumOptions()     
     })
     div.appendChild(deleteButton)

     div.style.marginBottom = '5px'
     div.style.marginBottom = '5px'
     div.style.width = '100%'
     div.appendChild(check)
     div.appendChild(labelCheck)
     document.getElementById(parent)?.appendChild(div)
} 

function removeLastOption(parent:string){
    let div = <HTMLDivElement>document.getElementById(parent);
    let remove = div.children[div.children.length-1]
    if (remove!.id != 'questionDiv'){
        div.removeChild(remove)
        num--
    }
}
function createQuestion(id:number){
    let options = []
    let can = false
    
    for (let i = 1; i <= num;i++){
       
        if(<HTMLInputElement>document.getElementById('check'+i)!=undefined ){
            if ((<HTMLInputElement>document.getElementById('ans'+i)!).value!=''){
                let isAnswer = (<HTMLInputElement>document.getElementById('check'+i)!).checked
                if (isAnswer){
                    can = true
                }
                options.push({isAnswer:isAnswer,txt:(<HTMLInputElement>document.getElementById('ans'+i)!).value,id:(<HTMLInputElement>document.getElementById('ans'+i)!).getAttribute('optionId')})
            }
          
        }
      
    }
    if (can){
        let data = {question:'',options:options,id:localStorage.getItem('id'),questionId:id}
        data.question = (<HTMLInputElement>document.getElementById('question')!).value
        num  = 0;
      
        editorSocket.emit('upsertQuestion',data)
        Warning.show(texts[245])
    }
    else{
        Warning.show(texts[191])
    } 
}

function showAllQuestions(data:any){
    removeAllButtons()
    removeAllListenersAdded()
    spawnHeading(document,'tileEditingPlace','',texts[17])
    let bt =spawnButton(document,'tileEditingPlace','',['btn','btn-secondary'],texts[241],function(){initCreation()})
    bt.style.marginBottom = '3%;'
                                                                                        
    let questions:Map<number,HTMLDivElement> = new Map()
    data.forEach((elem:any) =>{
     
        if (questions.get(elem.questionId) === undefined){
            let list = document.createElement('div')
            list.classList.add("list-group")
            list.style.marginTop = "5%";
            questions.set(elem.questionId,list)

            let quest = document.createElement('button')
            quest.type = 'button';
            quest.classList.add("list-group-item","list-group-item-action","active","btn-info")
            quest.style.textAlign =  'center';
            quest.textContent = elem.questionText
            quest.onclick =function(){ 
                                     let allQuests:any = []
                                    
                                     data.forEach((q:any) => {
                                         if (q.questionId == elem.questionId){
                                             allQuests.push([q.optionId,q])
                                         
                                         }
                                     });
                                    editQuestionMenu(elem.questionId,elem.questionText,allQuests)}
            list.appendChild(quest)

            document.getElementById('tileEditingPlace')?.appendChild(list)
        }
        let opt = document.createElement('button')
        opt.type = 'button';
        opt.classList.add("list-group-item","list-group-item-action")
        opt.textContent = elem.optionText
        questions.get(elem.questionId)?.appendChild(opt)
       
    })
}

function pickQuestion(data:any){
    elementDeleter('listPickerContainer')

    let questions:Map<number,HTMLDivElement> = new Map()
    data.forEach((elem:any) =>{
      
        if (questions.get(elem.questionId) === undefined){
            let list = document.createElement('div')
            list.classList.add("list-group")
            list.style.marginBottom = "5%";
            questions.set(elem.questionId,list)

            let quest = document.createElement('button')
            quest.type = 'button';
            quest.classList.add("list-group-item","list-group-item-action","active","btn-info")
            quest.style.textAlign =  'center';
            quest.textContent = elem.questionText
            quest.onclick =function(){ 
                                     $('#pickQuestionModal').modal('hide')
                                     $('#editEventModal').modal('hide')
                                     $('#EventModal').modal('hide')
                                     game.setQuestionId(elem.questionId)
                                  
                                     document.getElementById('pickedEventParagraph')!.textContent = texts[71] + elem.questionText;
                                     game.setEvents('question',{num:elem.questionId,value:0})
                                     update()
                                     }
            list.appendChild(quest)

            document.getElementById('listPickerContainer')?.appendChild(list)
        }
        let opt = document.createElement('button')
        opt.type = 'button';
        opt.classList.add("list-group-item","list-group-item-action")
        opt.textContent = elem.optionText
        questions.get(elem.questionId)?.appendChild(opt)
       
    })
}
let func = function(){}
function editQuestionMenu(id:number,txt:string,elem:any){
   
    removeAllButtons()
 
    spawnHeading(document,'buttonPlace','',texts[180])
    newQuestions = []
    num = 0
    let div = doc.createElement('div')
    div.classList.add("form-group")
    div.id = 'questionDiv'


    let text = doc.createElement('input')
    text.type = 'text'
    text.id = 'question'
    text.classList.add('form-control')
    text.name = 'question'
    text.required = true
    text.value = txt
    text.style.width = '50%'
    text.style.float = 'left'

    let label = doc.createElement('label')
    label.style.color='white'
    label.textContent = texts[66]
    label.style.float='left'

    document.getElementById('questionPlace')?.appendChild(label)
    div.appendChild(text)
    div.style.marginBottom = '5px'
    document.getElementById('questionPlace')?.appendChild(div)

    elem.forEach((e:any)=>{
        addOption('questionPlace',e[1].optionText,e[1].isAnswer,e[0])
    })
    div = document.createElement('div')
    div.style.display = 'flex'
    div.id = 'addDiv'
    document.getElementById('tileEditingPlace')!.appendChild(div)

    spawnButton(document,'addDiv','',['btn','btn-secondary'],'Pridaj možnosť!',function(){addOption('questionPlace','',false)})

    div = document.createElement('div')
    div.style.display = 'flex'
    div.id = 'buttonDiv'
    document.getElementById('tileEditingPlace')!.appendChild(div)
    let button = spawnButton(document,'buttonDiv','',['btn','btn-secondary'],texts[58],function(){createQuestion(id);})
    button.style.whiteSpace = 'nowrap'
    button = spawnButton(document,'buttonDiv','',['btn','btn-secondary','buttonLeftMargin'],texts[70],function(){ 
      
        deleteQuestion(id)
        editorSocket.emit('loadQuestions',{id:localStorage.getItem('id'),pick:false})})
    button.style.whiteSpace = 'nowrap'
    button = spawnButton(document,'buttonDiv','',['btn','btn-secondary','buttonLeftMargin'],texts[242],function(){initCreation()})
    button.style.whiteSpace = 'nowrap'
}

function deleteQuestion(id:number){
    if (game.containsQuestionId(id)){
        Warning.show(texts[205])
    }
    else if ( game.containsRandomQuestionAndQuestionNumberIs1()){
        Warning.show(texts[206])
    }
    else{
        editorSocket.emit('deleteQuestion',{id:localStorage.getItem('id'),questionId:id})
    }
    
}

function askQuestion(data:any){
    let questions:Map<number,HTMLDivElement> = new Map()
    elementDeleter('answerQuestion')
   

    let i = 0
    data.forEach((elem:any) =>{
        i++;
    
        if (questions.get(elem.questionId) === undefined){
            let list = document.createElement('div')
            list.classList.add("list-group")
            list.style.marginBottom = "5%";
            questions.set(elem.questionId,list)

            let quest = document.createElement('button')
            quest.type = 'button';
            quest.classList.add("list-group-item","list-group-item-action","active",'btn-info')
            quest.style.textAlign =  'center';
            quest.textContent = elem.questionText
            

            list.appendChild(quest)

            document.getElementById('answerQuestion')?.appendChild(list)
        }
        let opt = document.createElement('button')
        opt.id = 'givenOption'+i;
        opt.type = 'button';
        opt.classList.add("list-group-item","list-group-item-action",'btn','btn-light')
        opt.setAttribute('isAnswer',elem.isAnswer)
        opt.textContent = elem.optionText
        opt.addEventListener('click',function(){
            if (opt.classList.contains('active')){
                opt.classList.remove('active')
            }
            else{
                opt.classList.add('active')
            }
        })
        questions.get(elem.questionId)?.appendChild(opt)})
    givenOptions = i
    $('#answerModal').modal('show')
    }
function evaluateQuestion(){
    document.getElementById('answerButtonRoom')!.removeEventListener('click',clickFunction)
    
    document.getElementById('answerButtonRoom')!.setAttribute('hidden','hidden')
    const params = new URLSearchParams(window.location.search);
    let right:Array<string> = []
    let wrong:Array<string> = []
    for(let i = 1; i <= givenOptions; i++){
        let button = document.getElementById('givenOption'+i)
       
        if (button?.getAttribute('isAnswer') === 'true'){
        
            button!.classList.remove('btn-light')
            button!.classList.add('btn-success')
            button!.classList.add('active')
            right.push(button!.id)
        }
        else if ((button?.getAttribute('isAnswer') === 'false' && button?.classList.contains('active'))){
            button!.classList.remove('btn-light')
            button!.classList.add('btn-danger')
            button!.classList.add('active')
            wrong.push(button!.id)
        }
    }
    
    editorSocket.emit('showAnswersToOthers',{room:params.get('id'),wrong:wrong,right:right})
    setTimeout(function(){
        $('#answerModal').modal('hide')
        let answ = (wrong.length == 0)
        editorSocket.emit('wasRightAnswer',{is:answ,room:params.get('id')})
        
    }, 5000)
}
function showResults(right:Array<string>,wrong:Array<string> ){
    right.forEach((id:string)=>{
        let button = document.getElementById(id)
        button!.classList.remove('btn-light')
        button!.classList.add('btn-success')
        button!.classList.add('active')
    })
    wrong.forEach((id:string)=>{
        let button = document.getElementById(id)
        button!.classList.remove('btn-light')
            button!.classList.add('btn-danger')
            button!.classList.add('active')
    })
  
    setTimeout(function(){
        $('#answerModal').modal('hide')
    }, 4000)
}
export {addOption,createQuestion,showAllQuestions,askQuestion,evaluateQuestion,removeLastOption,initCreation,pickQuestion,showResults}