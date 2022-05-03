"use strict";
exports.__esModule = true;
exports.showResults = exports.pickQuestion = exports.initCreation = exports.removeLastOption = exports.evaluateQuestion = exports.askQuestion = exports.showAllQuestions = exports.createQuestion = exports.addOption = void 0;
var canvas_1 = require("./canvas");
var clientSocket_js_1 = require("./clientSocket.js");
var Elements_1 = require("./Elements");
var TileEditor_1 = require("./TileEditor");
var Warning_1 = require("./Warning");
var num = 0;
var newQuestions = [];
var givenOptions = 0;
console.log('zapol aspon subor');
function initCreation() {
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', clientSocket_js_1.texts[58]);
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
    text.style.width = '50%';
    text.placeholder = 'Sem napíš otázku';
    //text.style.marginLeft = '15px'
    var label = canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.htmlFor = text.id;
    label.textContent = clientSocket_js_1.texts[66];
    console.log('preslo uz');
    console.log(div);
    div.appendChild(label);
    div.appendChild(text);
    console.log('preslo uz');
    div.style.marginBottom = '5px';
    div.style.width = '100%';
    document.getElementById('questionPlace').appendChild(div);
    addOption('questionPlace', '', false);
    addOption('questionPlace', '', false);
    console.log('preslo uz');
    div = (0, Elements_1.spawnDiv)(document, 'tileEditingPlace', 'buttonDiv', []);
    var but = (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[67], function () { addOption('questionPlace', '', false); });
    //but.style.float = 'left'
    (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary', 'buttonLeftMargin'], clientSocket_js_1.texts[58], function () { createQuestion(-1); });
    (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary', 'buttonLeftMargin'], clientSocket_js_1.texts[70], function () { clientSocket_js_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: false }); });
}
exports.initCreation = initCreation;
function renumOptions() {
    var i = 1;
    var n = 1;
    while (n <= num) {
        var text = document.getElementById('ans' + i);
        var check = document.getElementById('check' + i);
        if (text == undefined) {
            i++;
            text = document.getElementById('ans' + i);
            check = document.getElementById('check' + i);
        }
        if (text != undefined) {
            text.placeholder = 'Zadaj odpoveď číslo: ' + n;
            text.id = 'ans' + n;
            check.id = 'check' + n;
        }
        i++;
        n++;
        console.log(text);
        console.log(n);
    }
}
function addOption(parent, txt, is, id) {
    var _a;
    if (id === void 0) { id = -1; }
    console.log('pridal option');
    num++;
    var div = canvas_1.doc.createElement('div');
    div.classList.add("form-group", 'inline');
    div.style.width = '120%';
    var text = canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'ans' + num;
    text.classList.add('form-control');
    text.name = 'ans' + num;
    text.required = true;
    text.value = txt;
    text.style.width = '50%';
    text.style.float = 'left';
    text.placeholder = 'Zadaj odpoveď číslo: ' + num;
    if (id > 0) {
        console.log('nastavil v add option id:' + id);
        text.setAttribute('optionId', id.toString());
    }
    var check = canvas_1.doc.createElement('input');
    check.type = 'checkbox';
    check.id = 'check' + num;
    check.style.width = '20px';
    check.classList.add('form-control');
    check.name = 'check' + num;
    check.checked = is;
    check.style.float = 'left';
    var labelCheck = canvas_1.doc.createElement('label');
    labelCheck.htmlFor = check.id;
    labelCheck.textContent = 'správne ';
    labelCheck.style.color = 'white';
    labelCheck.style.float = 'left';
    labelCheck.style.fontSize = '20px';
    div.appendChild(text);
    newQuestions.push(num.valueOf());
    console.log('new quest su:');
    console.log(newQuestions);
    var deleteButton = document.createElement('button');
    deleteButton.textContent = clientSocket_js_1.texts[70];
    deleteButton.type = 'button';
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-secondary');
    deleteButton.style.float = 'left';
    deleteButton.addEventListener('click', function () {
        var _a;
        newQuestions = newQuestions.filter(function (p) { return p != (num + 1); });
        (_a = document.getElementById(parent)) === null || _a === void 0 ? void 0 : _a.removeChild(div);
        num--;
        renumOptions();
    });
    div.appendChild(deleteButton);
    //text.setAttribute('questionId','none')
    div.style.marginBottom = '5px';
    div.style.marginBottom = '5px';
    div.style.width = '100%';
    div.appendChild(check);
    div.appendChild(labelCheck);
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
    var can = false;
    console.log('CLICKOL');
    console.log(newQuestions);
    for (var i = 1; i <= num; i++) {
        if (document.getElementById('check' + i) != undefined) {
            console.log('pridal pri create question');
            console.log({ isAnswer: document.getElementById('check' + i).checked, txt: document.getElementById('ans' + i).value, id: document.getElementById('ans' + i).getAttribute('optionId') });
            if (document.getElementById('ans' + i).value != '') {
                var isAnswer = document.getElementById('check' + i).checked;
                if (isAnswer) {
                    can = true;
                }
                options.push({ isAnswer: isAnswer, txt: document.getElementById('ans' + i).value, id: document.getElementById('ans' + i).getAttribute('optionId') });
            }
        }
        else {
            console.log('undefined bol');
            console.log(document.getElementById('check' + i));
            console.log(document.getElementById('ans' + i));
            console.log(i);
        }
    }
    if (can) {
        var data = { question: '', options: options, id: localStorage.getItem('id'), questionId: id };
        data.question = document.getElementById('question').value;
        num = 0;
        console.log('vklada otazky');
        console.log(data);
        clientSocket_js_1.editorSocket.emit('newQuestion', data);
    }
    else {
        Warning_1.Warning.show(clientSocket_js_1.texts[191]);
    }
}
exports.createQuestion = createQuestion;
function showAllQuestions(data) {
    (0, TileEditor_1.removeAllButtons)();
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, Elements_1.spawnHeading)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[17]);
    var bt = (0, Elements_1.spawnButton)(document, 'tileEditingPlace', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[58], function () { initCreation(); });
    bt.style.marginBottom = '3%;';
    var questions = new Map();
    data.forEach(function (elem) {
        var _a, _b;
        console.log('vykonal');
        if (questions.get(elem.questionId) === undefined) {
            var list = document.createElement('div');
            list.classList.add("list-group");
            list.style.marginTop = "5%";
            questions.set(elem.questionId, list);
            var quest = document.createElement('button');
            quest.type = 'button';
            quest.classList.add("list-group-item", "list-group-item-action", "active", "btn-info");
            quest.style.textAlign = 'center';
            quest.textContent = elem.questionText;
            quest.onclick = function () {
                //$('#questionModal').modal('hide')
                var allQuests = [];
                data.forEach(function (q) {
                    if (q.questionId == elem.questionId) {
                        allQuests.push([q.optionId, q]);
                    }
                });
                editQuestionMenu(elem.questionId, elem.questionText, allQuests);
            };
            list.appendChild(quest);
            (_a = document.getElementById('tileEditingPlace')) === null || _a === void 0 ? void 0 : _a.appendChild(list);
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
    //removeAllButtons()
    (0, canvas_1.elementDeleter)('listPickerContainer');
    //spawnHeading(document,'buttonPlace','',texts[198])
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
            quest.textContent = elem.questionText;
            quest.onclick = function () {
                $('#pickQuestionModal').modal('hide');
                canvas_1.editor.setQuestionId(elem.questionId);
                console.log('Question id je teraz:' + canvas_1.editor.getQuestionId());
                document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[71] + elem.questionText;
                canvas_1.editor.setEvents('question', { num: elem.questionId, value: 0 });
                (0, TileEditor_1.update)();
                //(<HTMLButtonElement>document.getElementById('bindQuestion'))!.textContent = texts[72]
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
    var _a, _b;
    //elementDeleter('editQuestion')
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', clientSocket_js_1.texts[180]);
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
    text.style.width = '50%';
    text.style.float = 'left';
    var label = canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.textContent = clientSocket_js_1.texts[66];
    label.style.float = 'left';
    // let editButton = document.createElement('button')
    // editButton.textContent = texts[64]
    // editButton.type = 'button'
    // editButton.style.float = 'left'
    // editButton.classList.add('btn')
    // editButton.classList.add('btn-secondary')
    // editButton.addEventListener('click',function(){
    //     editQuestion(id,text)
    // })
    (_a = document.getElementById('questionPlace')) === null || _a === void 0 ? void 0 : _a.appendChild(label);
    div.appendChild(text);
    //div.appendChild(editButton)
    div.style.marginBottom = '5px';
    (_b = document.getElementById('questionPlace')) === null || _b === void 0 ? void 0 : _b.appendChild(div);
    elem.forEach(function (e) {
        console.log('pred pridanim');
        console.log(e);
        addOption('questionPlace', e[1].optionText, e[1].isAnswer, e[0]);
    });
    (0, Elements_1.spawnButton)(document, 'tileEditingPlace', '', ['btn', 'btn-secondary'], 'Add option', function () { addOption('questionPlace', '', false); });
    div = (0, Elements_1.spawnDiv)(document, 'tileEditingPlace', 'buttonDiv', []);
    (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[58], function () { createQuestion(id); });
    (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary', 'buttonLeftMargin'], clientSocket_js_1.texts[70], function () {
        clientSocket_js_1.editorSocket.emit('deleteQuestion', { id: id });
        clientSocket_js_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: false });
    });
    //document.getElementById('questionEditButton')?.addEventListener('click',function(){editQuestion(id)})
}
function editOption(id, check, text) {
    console.log('emitol edit option');
    console.log({ id: id, isAnswer: check.checked, text: text.value });
    clientSocket_js_1.editorSocket.emit('editOption', { id: id, isAnswer: check.checked, text: text.value });
    //$('#editModal').modal('show')
}
function editQuestion(id, text) {
    clientSocket_js_1.editorSocket.emit('editQuestion', { id: id, text: text.value });
    //$('#editModal').modal('show')
}
function askQuestion(data) {
    var questions = new Map();
    (0, canvas_1.elementDeleter)('answerQuestion');
    (0, TileEditor_1.removeAllButtons)();
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
            quest.textContent = elem.questionText;
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
    document.getElementById('answerButtonRoom').removeEventListener('click', clientSocket_js_1.clickFunction);
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
    clientSocket_js_1.editorSocket.emit('showAnswersToOthers', { room: params.get('id'), wrong: wrong, right: right });
    setTimeout(function () {
        $('#answerModal').modal('hide');
        var answ = (wrong.length == 0);
        clientSocket_js_1.editorSocket.emit('wasRightAnswer', { is: answ, room: params.get('id') });
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
