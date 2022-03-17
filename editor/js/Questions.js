"use strict";
exports.__esModule = true;
exports.createQuestion = exports.addOption = void 0;
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
    check.id = 'checkbox' + num;
    check.style.width = '20px';
    check.classList.add('form-control');
    var text = canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'ans' + num;
    text.classList.add('form-control');
    text.name = 'ans' + num;
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
        options.push([document.getElementById('ans' + i).checked, document.getElementById('ans' + i).value]);
    }
    var data = { question: '', options: options };
    data.question = document.getElementById('question').value;
    console.log(data);
    canvas_1.editorSocket.emit('newQuestion', data);
}
exports.createQuestion = createQuestion;
