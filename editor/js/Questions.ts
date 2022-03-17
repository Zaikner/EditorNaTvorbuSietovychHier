import {doc, editorSocket} from './canvas'

let num = 2
console.log('zapol aspon subor')

function addOption(){
    console.log('pridal option')
     num++;
     let div = doc.createElement('div')
     div.classList.add("form-group")

     let check = doc.createElement('input')
     check.type = 'checkbox'
     check.id = 'checkbox'+num
     check.style.width = '20px'
     check.classList.add('form-control')

     let text = doc.createElement('input')
     text.type = 'text'
     text.id = 'ans'+num
     text.classList.add('form-control')
     text.name = 'ans'+num

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
        options.push([(<HTMLInputElement>document.getElementById('ans'+i)!).checked,(<HTMLInputElement>document.getElementById('ans'+i)!).value])
    
    }
    let data = {question:'',options:options}
    data.question = (<HTMLInputElement>document.getElementById('question')!).value
    console.log(data)
    editorSocket.emit('newQuestion',data)
}
// <input type="checkbox" id="questionCheck" style="width: 20px;" height="20px" class="form-control">
// <label for="ans2" style="color: white;">Option2:   </label>
// <input type="text" id="ans2" class="form-control">
// </div>
export {addOption,createQuestion}