"use strict";
exports.__esModule = true;
exports.showAllQuestions = exports.createQuestion = exports.addOption = void 0;
var canvas_1 = require("./canvas");
var num = 2;
console.log('zapol aspon subor');
function addOption() {
    var _a;
    console.log('pridal option');
    num++;
    var div = canvas_1.doc.createElement('div');
    div.classList.add("form-group");
    var check = canvas_1.doc.createElement('input');
    check.type = 'checkbox';
    check.id = 'check' + num;
    check.style.width = '20px';
    check.classList.add('form-control');
    check.name = 'check' + num;
    var text = canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'ans' + num;
    text.classList.add('form-control');
    text.name = 'ans' + num;
    text.required = true;
    var label = canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.textContent = 'Option' + num + ': ';
    div.appendChild(check);
    div.appendChild(label);
    div.appendChild(text);
    div.style.marginBottom = '5px';
    (_a = document.getElementById('questionOptions')) === null || _a === void 0 ? void 0 : _a.appendChild(div);
}
exports.addOption = addOption;
function createQuestion() {
    var options = [];
    console.log('CLICKOL');
    for (var i = 1; i <= num; i++) {
        options.push({ isAnswer: document.getElementById('check' + i).checked, txt: document.getElementById('ans' + i).value });
    }
    var data = { question: '', options: options, id: localStorage.getItem('id') };
    data.question = document.getElementById('question').value;
    console.log(data);
    canvas_1.editorSocket.emit('newQuestion', data);
}
exports.createQuestion = createQuestion;
function showAllQuestions(data) {
    var questions = new Map();
    data.forEach(function (elem) {
        var _a, _b;
        console.log('vykonal');
        if (questions.get(elem.questionId) === undefined) {
            var list = document.createElement('div');
            list.classList.add("list-group");
            list.style.marginBottom = "5%";
            questions.set(elem.questionId, list);
            var quest = document.createElement('button');
            quest.type = 'button';
            quest.classList.add("list-group-item", "list-group-item-action", "active");
            quest.style.textAlign = 'center';
            quest.textContent = 'Question ID ' + elem.questionId + ' : ' + elem.questionText;
            list.appendChild(quest);
            (_a = document.getElementById('listContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(list);
        }
        var opt = document.createElement('button');
        opt.type = 'button';
        opt.classList.add("list-group-item", "list-group-item-action");
        //quest.style.textAlign =  'center';
        opt.textContent = elem.optionText;
        (_b = questions.get(elem.questionId)) === null || _b === void 0 ? void 0 : _b.appendChild(opt);
    });
    //console.log(data)
    //console.log( typeof data)
    //for (int i)
    //let questions = da
    // data.forEach((elem) =>{
    //     list.appendChild(quest) 
    //     document.getElementById('listContainer')?.appendChild(list)
    // })
    //       <button type="button" class="list-group-item list-group-item-action">Ano</button>
    //       <button type="button" class="list-group-item list-group-item-action">Asi ano</button>
    //       <button type="button" class="list-group-item list-group-item-action">Mozno</button>
    //       <button type="button" class="list-group-item list-group-item-action" disabled>Urco</button>
    //     </div>
    //   </div>
}
exports.showAllQuestions = showAllQuestions;
