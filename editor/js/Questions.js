"use strict";
exports.__esModule = true;
exports.evaluateQuestion = exports.askQuestion = exports.showAllQuestions = exports.createQuestion = exports.addOption = void 0;
var canvas_1 = require("./canvas");
var num = 2;
var givenOptions = 0;
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
            quest.classList.add("list-group-item", "list-group-item-action", "active", "btn-info");
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
}
exports.showAllQuestions = showAllQuestions;
function askQuestion(data) {
    var questions = new Map();
    (0, canvas_1.elementDeleter)('answerQuestion');
    var i = 0;
    data.forEach(function (elem) {
        var _a, _b;
        i++;
        console.log('vykonal');
        if (questions.get(elem.questionId) === undefined) {
            var list = document.createElement('div');
            list.classList.add("list-group");
            list.style.marginBottom = "5%";
            questions.set(elem.questionId, list);
            var quest = document.createElement('button');
            quest.type = 'button';
            quest.classList.add("list-group-item", "list-group-item-action", "active", 'btn-info');
            quest.style.textAlign = 'center';
            quest.textContent = 'Question ID ' + elem.questionId + ' : ' + elem.questionText;
            list.appendChild(quest);
            (_a = document.getElementById('answerQuestion')) === null || _a === void 0 ? void 0 : _a.appendChild(list);
        }
        var opt = document.createElement('button');
        opt.id = 'givenOption' + i;
        opt.type = 'button';
        opt.classList.add("list-group-item", "list-group-item-action", 'btn', 'btn-info');
        opt.setAttribute('isAnswer', elem.isAnswer);
        //quest.style.textAlign =  'center';
        opt.textContent = elem.optionText;
        opt.addEventListener('click', function () {
            if (opt.classList.contains('active')) {
                opt.classList.remove('active');
            }
            else {
                opt.classList.add('active');
            }
        });
        (_b = questions.get(elem.questionId)) === null || _b === void 0 ? void 0 : _b.appendChild(opt);
    });
    givenOptions = i;
}
exports.askQuestion = askQuestion;
function evaluateQuestion() {
    for (var i = 1; i <= givenOptions; i++) {
        var button = document.getElementById('givenOption' + i);
        if (((button === null || button === void 0 ? void 0 : button.getAttribute('isAnswer')) === 'true' && (button === null || button === void 0 ? void 0 : button.classList.contains('active'))) || ((button === null || button === void 0 ? void 0 : button.getAttribute('isAnswer')) === 'false' && !(button === null || button === void 0 ? void 0 : button.classList.contains('active')))) {
            button.classList.remove('btn-info');
            button.classList.add('btn-success');
            button.classList.add('active');
        }
        else {
            button.classList.remove('btn-info');
            button.classList.add('btn-danger');
            button.classList.add('active');
        }
    }
    setTimeout(function () {
        $('#answerModal').modal('hide');
    }, 5000);
}
exports.evaluateQuestion = evaluateQuestion;
