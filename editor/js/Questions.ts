import e = require('express');
import { ids } from 'webpack';
import { QuestionOption } from '../../services/db/RDG/QuestionOption';
import { QuestionOptionFinder } from '../../services/db/RDG/QuestionOptionFinder';


import {clickFunction, doc, editor, editorSocket, elementDeleter} from './canvas'
import { spawnButton } from './Elements';
import { removeAllButtons, removeAllListenersAdded } from './TileEditor';

let num = 0
let newQuestions:Array<number> = []
let givenOptions = 0
console.log('zapol aspon subor')
function initCreation(parent:string){
    elementDeleter(parent)
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
    text.style.marginLeft = '15px'


    let label = doc.createElement('label')
    label.style.color='white'
    label.textContent = 'Question:'
    
    
    div.appendChild(label)
    div.appendChild(text)
    div.style.marginBottom = '5px'
    document.getElementById(parent)?.appendChild(div)

    addOption(parent,'',false)
    addOption(parent,'',false)
}
function addOption(parent:string,txt:string,is:boolean,id:number=-1){
    console.log('pridal option')
     num++;
     let div = doc.createElement('div')
     div.classList.add("form-group")

     let check = doc.createElement('input')
     check.type = 'checkbox'
     check.id = 'check'+num
     check.style.width = '20px'
     check.classList.add('form-control')
     check.name = 'check'+num
     check.checked = is

     let text = doc.createElement('input')
     text.type = 'text'
     text.id = 'ans'+num
     text.classList.add('form-control')
     text.name = 'ans'+num
     text.required = true
     text.value = txt
     

     let label = doc.createElement('label')
     label.style.color='white'
     label.textContent = 'Option'+num+': '
     
    
     div.appendChild(check)
     div.appendChild(label)
     div.appendChild(text)

     if(txt != ''){
        let editButton = document.createElement('button')
        editButton.textContent = 'Edit!'
        editButton.classList.add('btn')
        editButton.classList.add('btn-secondary')
      
        editButton.addEventListener('click',function(){
            editOption(id,check,text)
            //$('#editModal').modal('show')
        })
        div.appendChild(editButton)
       

        let deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete!'
        deleteButton.classList.add('btn')
        deleteButton.classList.add('btn-secondary')
        deleteButton.addEventListener('click',function(){
            editorSocket.emit('deleteQuestion',{id:id})
            document.getElementById(parent)?.removeChild(div)
        })
        //deleteButton.classList.add('btn btn-secondary')
        div.appendChild(deleteButton)
        
        text.setAttribute('questionId',id.toString())
        console.log('priradil atribut'  + id)
     }
     else{
      
        //deleteButton.classList.add('btn btn-secondary')
      
        newQuestions.push(num.valueOf())
        console.log('new quest su:')
        console.log(newQuestions)
        let deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete!'
        deleteButton.type = 'button'
        deleteButton.classList.add('btn')
        deleteButton.classList.add('btn-secondary')
        deleteButton.addEventListener('click',function(){
            newQuestions = newQuestions.filter((p) => {return p != (num+1)});
            document.getElementById(parent)?.removeChild(div)
        })
        // let insertButton = document.createElement('button')
        // insertButton.type = 'button'
        // insertButton.textContent = 'Insert!'
        // insertButton.classList.add('btn')
        // insertButton.classList.add('btn-secondary')
        // insertButton.addEventListener('click',function(){
        //     //insertButton
        //     editorSocket.emit('insertQuestion',{text:text.value,isAnswer:check.checked})
        //     //document.getElementById(parent)?.removeChild(div)
        // })
        // //deleteButton.classList.add('btn btn-secondary')
        // div.appendChild(insertButton)
        div.appendChild(deleteButton)
        text.setAttribute('questionId','none')
       
     }

     div.style.marginBottom = '5px'
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
    console.log('CLICKOL')
    console.log(newQuestions)
    for (let a = 0; a < newQuestions.length;a++){
        let i = newQuestions[a]
        if(<HTMLInputElement>document.getElementById('check'+i)!=undefined && document.getElementById('ans'+i)!.getAttribute('questionId') === 'none'){
            options.push({isAnswer:(<HTMLInputElement>document.getElementById('check'+i)!).checked,txt:(<HTMLInputElement>document.getElementById('ans'+i)!).value})
        }
        else{
            console.log('undefined bol')
            console.log(i)
        }
       
    
    }
    let data = {question:'',options:options,id:localStorage.getItem('id'),questionId:id}
    data.question = (<HTMLInputElement>document.getElementById('question')!).value
    num  = 0;
    console.log('vklada otazky')
    console.log(data)
    editorSocket.emit('newQuestion',data)
}

function showAllQuestions(data:any){
    let questions:Map<number,HTMLDivElement> = new Map()
    data.forEach((elem:any) =>{
        console.log('vykonal')
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
            quest.onclick =function(){ $('#editModal').modal('show')
                                     $('#questionModal').modal('hide')
                                     let allQuests:any = []
                                    
                                     data.forEach((q:any) => {
                                         if (q.questionId == elem.questionId){
                                             allQuests.push([q.optionId,q])
                                         
                                         }
                                     });
                                    editQuestionMenu(elem.questionId,elem.questionText,allQuests)}
            list.appendChild(quest)

            document.getElementById('listContainer')?.appendChild(list)
        }
        let opt = document.createElement('button')
        opt.type = 'button';
        opt.classList.add("list-group-item","list-group-item-action")
        //quest.style.textAlign =  'center';
        opt.textContent = elem.optionText
        questions.get(elem.questionId)?.appendChild(opt)
       
    })
}
function pickQuestion(data:any){
    elementDeleter('listPickerContainer')
    let questions:Map<number,HTMLDivElement> = new Map()
    data.forEach((elem:any) =>{
        console.log('vykonal')
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
                                     editor.setQuestionId(elem.questionId)
                                     console.log('Question id je teraz:'+editor.getQuestionId());
                                     document.getElementById('pickedQuestionParagraph')!.textContent = 'Picked Question: ' + elem.questionText;
                                     (<HTMLButtonElement>document.getElementById('bindQuestion'))!.textContent = 'Pick Question!'
                                     }
            list.appendChild(quest)

            document.getElementById('listPickerContainer')?.appendChild(list)
        }
        let opt = document.createElement('button')
        opt.type = 'button';
        opt.classList.add("list-group-item","list-group-item-action")
        //quest.style.textAlign =  'center';
        opt.textContent = elem.optionText
        questions.get(elem.questionId)?.appendChild(opt)
       
    })
}
let func = function(){}
function editQuestionMenu(id:number,txt:string,elem:any){
    elementDeleter('editQuestion')
    document.getElementById('questionEditButton')!.removeEventListener('click',func)
    func = function(){createQuestion(id)}

    document.getElementById('questionEditButton')!.addEventListener('click',func)
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
    text.style.marginLeft = '15px'

    let label = doc.createElement('label')
    label.style.color='white'
    label.textContent = 'Question:'

    let editButton = document.createElement('button')
    editButton.textContent = 'Edit!'
    editButton.type = 'button'
    editButton.classList.add('btn')
    editButton.classList.add('btn-secondary')
    editButton.addEventListener('click',function(){
        editQuestion(id,text)
    })
    div.appendChild(editButton)
    
    
    div.appendChild(label)
    div.appendChild(text)
    div.style.marginBottom = '5px'
    document.getElementById('editQuestion')?.appendChild(div)

    elem.forEach((e:any)=>{

        addOption('editQuestion',e[1].optionText,e[1].isAnswer,e[0])
    })
    //document.getElementById('questionEditButton')?.addEventListener('click',function(){editQuestion(id)})
    
}
function editOption(id:number,check:HTMLInputElement,text:HTMLInputElement){  
    console.log('emitol edit option')
    console.log({id:id,isAnswer:check.checked,text:text.value})
    editorSocket.emit('editOption',{id:id,isAnswer:check.checked,text:text.value})
    //$('#editModal').modal('show')
}
function editQuestion(id:number,text:HTMLInputElement){
    editorSocket.emit('editQuestion',{id:id,text:text.value})
    //$('#editModal').modal('show')
}
function askQuestion(data:any){
    let questions:Map<number,HTMLDivElement> = new Map()
    elementDeleter('answerQuestion')
    let i = 0
    data.forEach((elem:any) =>{
        i++;
        console.log('vykonal')
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
        //quest.style.textAlign =  'center';
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
    const params = new URLSearchParams(window.location.search);
    let right:Array<string> = []
    let wrong:Array<string> = []
    for(let i = 1; i <= givenOptions; i++){
        let button = document.getElementById('givenOption'+i)
       
        if ((button?.getAttribute('isAnswer') === 'true' && button?.classList.contains('active')) || (button?.getAttribute('isAnswer') === 'false' && !button?.classList.contains('active'))){
        
            button!.classList.remove('btn-light')
            button!.classList.add('btn-success')
            button!.classList.add('active')
            right.push(button!.id)
        }
        else {
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