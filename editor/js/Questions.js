"use strict";
exports.__esModule = true;
exports.showResults = exports.pickQuestion = exports.initCreation = exports.removeLastOption = exports.evaluateQuestion = exports.askQuestion = exports.showAllQuestions = exports.createQuestion = exports.addOption = void 0;
var canvas_1 = require("./canvas");
var num = 0;
var newQuestions = [];
var givenOptions = 0;
console.log('zapol aspon subor');
function initCreation(parent) {
    var _a;
    (0, canvas_1.elementDeleter)(parent);
    newQuestions = [];
    num = 0;
    var div = canvas_1.doc.createElement('div');
    div.classList.add("form-group");
    div.id = 'questionDiv';
    var text = canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'question';
    text.classList.add('form-control');
    text.name = 'question';
    text.required = true;
    text.style.marginLeft = '15px';
    var label = canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.textContent = 'Question:';
    div.appendChild(label);
    div.appendChild(text);
    div.style.marginBottom = '5px';
    (_a = document.getElementById(parent)) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    addOption(parent, '', false);
    addOption(parent, '', false);
}
exports.initCreation = initCreation;
function addOption(parent, txt, is, id) {
    var _a;
    if (id === void 0) { id = -1; }
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
    check.checked = is;
    var text = canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'ans' + num;
    text.classList.add('form-control');
    text.name = 'ans' + num;
    text.required = true;
    text.value = txt;
    var label = canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.textContent = 'Option' + num + ': ';
    div.appendChild(check);
    div.appendChild(label);
    div.appendChild(text);
    if (txt != '') {
        var editButton = document.createElement('button');
        editButton.textContent = 'Edit!';
        editButton.classList.add('btn');
        editButton.classList.add('btn-secondary');
        editButton.addEventListener('click', function () {
            editOption(id, check, text);
            //$('#editModal').modal('show')
        });
        div.appendChild(editButton);
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete!';
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-secondary');
        deleteButton.addEventListener('click', function () {
            var _a;
            canvas_1.editorSocket.emit('deleteQuestion', { id: id });
            (_a = document.getElementById(parent)) === null || _a === void 0 ? void 0 : _a.removeChild(div);
        });
        //deleteButton.classList.add('btn btn-secondary')
        div.appendChild(deleteButton);
        text.setAttribute('questionId', id.toString());
        console.log('priradil atribut' + id);
    }
    else {
        //deleteButton.classList.add('btn btn-secondary')
        newQuestions.push(num.valueOf());
        console.log('new quest su:');
        console.log(newQuestions);
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete!';
        deleteButton.type = 'button';
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-secondary');
        deleteButton.addEventListener('click', function () {
            var _a;
            newQuestions = newQuestions.filter(function (p) { return p != (num + 1); });
            (_a = document.getElementById(parent)) === null || _a === void 0 ? void 0 : _a.removeChild(div);
        });
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
        div.appendChild(deleteButton);
        text.setAttribute('questionId', 'none');
    }
    div.style.marginBottom = '5px';
    (_a = document.getElementById(parent)) === null || _a === void 0 ? void 0 : _a.appendChild(div);
}
exports.addOption = addOption;
function removeLastOption(parent) {
    var div = document.getElementById(parent);
    var remove = div.children[div.children.length - 1];
    if (remove.id != 'questionDiv') {
        div.removeChild(remove);
        num--;
    }
}
exports.removeLastOption = removeLastOption;
function createQuestion(id) {
    var options = [];
    console.log('CLICKOL');
    console.log(newQuestions);
    for (var a = 0; a < newQuestions.length; a++) {
        var i = newQuestions[a];
        if (document.getElementById('check' + i) != undefined && document.getElementById('ans' + i).getAttribute('questionId') === 'none') {
            options.push({ isAnswer: document.getElementById('check' + i).checked, txt: document.getElementById('ans' + i).value });
        }
        else {
            console.log('undefined bol');
            console.log(i);
        }
    }
    var data = { question: '', options: options, id: localStorage.getItem('id'), questionId: id };
    data.question = document.getElementById('question').value;
    num = 0;
    console.log('vklada otazky');
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
            quest.onclick = function () {
                $('#editModal').modal('show');
                $('#questionModal').modal('hide');
                var allQuests = [];
                data.forEach(function (q) {
                    if (q.questionId == elem.questionId) {
                        allQuests.push([q.optionId, q]);
                    }
                });
                editQuestionMenu(elem.questionId, elem.questionText, allQuests);
            };
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
function pickQuestion(data) {
    (0, canvas_1.elementDeleter)('listPickerContainer');
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
            quest.onclick = function () {
                $('#pickQuestionModal').modal('hide');
                canvas_1.editor.setQuestionId(elem.questionId);
                console.log('Question id je teraz:' + canvas_1.editor.getQuestionId());
                document.getElementById('bindQuestion').textContent = 'Choosen Question Id: ' + (elem.questionId);
            };
            list.appendChild(quest);
            (_a = document.getElementById('listPickerContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(list);
        }
        var opt = document.createElement('button');
        opt.type = 'button';
        opt.classList.add("list-group-item", "list-group-item-action");
        //quest.style.textAlign =  'center';
        opt.textContent = elem.optionText;
        (_b = questions.get(elem.questionId)) === null || _b === void 0 ? void 0 : _b.appendChild(opt);
    });
}
exports.pickQuestion = pickQuestion;
var func = function () { };
function editQuestionMenu(id, txt, elem) {
    var _a;
    (0, canvas_1.elementDeleter)('editQuestion');
    document.getElementById('questionEditButton').removeEventListener('click', func);
    func = function () { createQuestion(id); };
    document.getElementById('questionEditButton').addEventListener('click', func);
    newQuestions = [];
    num = 0;
    var div = canvas_1.doc.createElement('div');
    div.classList.add("form-group");
    div.id = 'questionDiv';
    var text = canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'question';
    text.classList.add('form-control');
    text.name = 'question';
    text.required = true;
    text.value = txt;
    text.style.marginLeft = '15px';
    var label = canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.textContent = 'Question:';
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit!';
    editButton.type = 'button';
    editButton.classList.add('btn');
    editButton.classList.add('btn-secondary');
    editButton.addEventListener('click', function () {
        editQuestion(id, text);
    });
    div.appendChild(editButton);
    div.appendChild(label);
    div.appendChild(text);
    div.style.marginBottom = '5px';
    (_a = document.getElementById('editQuestion')) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    elem.forEach(function (e) {
        addOption('editQuestion', e[1].optionText, e[1].isAnswer, e[0]);
    });
    //document.getElementById('questionEditButton')?.addEventListener('click',function(){editQuestion(id)})
}
function editOption(id, check, text) {
    console.log('emitol edit option');
    console.log({ id: id, isAnswer: check.checked, text: text.value });
    canvas_1.editorSocket.emit('editOption', { id: id, isAnswer: check.checked, text: text.value });
    //$('#editModal').modal('show')
}
function editQuestion(id, text) {
    canvas_1.editorSocket.emit('editQuestion', { id: id, text: text.value });
    //$('#editModal').modal('show')
}
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
        opt.classList.add("list-group-item", "list-group-item-action", 'btn', 'btn-light');
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
    $('#answerModal').modal('show');
}
exports.askQuestion = askQuestion;
function evaluateQuestion() {
    document.getElementById('answerButtonRoom').removeEventListener('click', canvas_1.clickFunction);
    var params = new URLSearchParams(window.location.search);
    var right = [];
    var wrong = [];
    for (var i = 1; i <= givenOptions; i++) {
        var button = document.getElementById('givenOption' + i);
        if (((button === null || button === void 0 ? void 0 : button.getAttribute('isAnswer')) === 'true' && (button === null || button === void 0 ? void 0 : button.classList.contains('active'))) || ((button === null || button === void 0 ? void 0 : button.getAttribute('isAnswer')) === 'false' && !(button === null || button === void 0 ? void 0 : button.classList.contains('active')))) {
            button.classList.remove('btn-light');
            button.classList.add('btn-success');
            button.classList.add('active');
            right.push(button.id);
        }
        else {
            button.classList.remove('btn-light');
            button.classList.add('btn-danger');
            button.classList.add('active');
            wrong.push(button.id);
        }
    }
    canvas_1.editorSocket.emit('showAnswersToOthers', { room: params.get('id'), wrong: wrong, right: right });
    setTimeout(function () {
        $('#answerModal').modal('hide');
        var answ = (wrong.length == 0);
        canvas_1.editorSocket.emit('wasRightAnswer', { is: answ, room: params.get('id') });
    }, 5000);
}
exports.evaluateQuestion = evaluateQuestion;
function showResults(right, wrong) {
    right.forEach(function (id) {
        var button = document.getElementById(id);
        button.classList.remove('btn-light');
        button.classList.add('btn-success');
        button.classList.add('active');
    });
    wrong.forEach(function (id) {
        var button = document.getElementById(id);
        button.classList.remove('btn-light');
        button.classList.add('btn-danger');
        button.classList.add('active');
    });
    setTimeout(function () {
        $('#answerModal').modal('hide');
    }, 4000);
}
exports.showResults = showResults;
