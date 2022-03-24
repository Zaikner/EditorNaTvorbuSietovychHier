import {doc, editorSocket, elementDeleter} from './canvas'
import { removeAllButtons } from './TileEditor';

let num = 2
let givenOptions = 0
console.log('zapol aspon subor')

function addOption(){
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

     let text = doc.createElement('input')
     text.type = 'text'
     text.id = 'ans'+num
     text.classList.add('form-control')
     text.name = 'ans'+num
     text.required = true

     let label = doc.createElement('label')
     label.style.color='white'
     label.textContent = 'Option'+num+': '
     
     div.appendChild(check)
     div.appendChild(label)
     div.appendChild(text)
     div.style.marginBottom = '5px'
     document.getElementById('questionOptions')?.appendChild(div)

    

} 
function createQuestion(){
    let options = []
    console.log('CLICKOL')
    for (let i = 1; i <=num; i++){
        options.push({isAnswer:(<HTMLInputElement>document.getElementById('check'+i)!).checked,txt:(<HTMLInputElement>document.getElementById('ans'+i)!).value})
    
    }
    let data = {question:'',options:options,id:localStorage.getItem('id')}
    data.question = (<HTMLInputElement>document.getElementById('question')!).value
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
            quest.textContent = 'Question ID '+ elem.questionId +' : ' +elem.questionText

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
            quest.textContent = 'Question ID '+ elem.questionId +' : ' +elem.questionText

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
    }
function evaluateQuestion(){
    for(let i = 1; i <= givenOptions; i++){
        let button = document.getElementById('givenOption'+i)
       
        if ((button?.getAttribute('isAnswer') === 'true' && button?.classList.contains('active')) || (button?.getAttribute('isAnswer') === 'false' && !button?.classList.contains('active'))){
        
            button!.classList.remove('btn-light')
            button!.classList.add('btn-success')
            button!.classList.add('active')
        
        }
        else {
            button!.classList.remove('btn-light')
            button!.classList.add('btn-danger')
            button!.classList.add('active')
        }
    }
    setTimeout(function(){
        $('#answerModal').modal('hide')
    }, 5000)
}
export {addOption,createQuestion,showAllQuestions,askQuestion,evaluateQuestion}