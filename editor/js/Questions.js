"use strict";
exports.__esModule = true;
exports.showResults = exports.pickQuestion = exports.initCreation = exports.removeLastOption = exports.evaluateQuestion = exports.askQuestion = exports.showAllQuestions = exports.createQuestion = exports.addOption = void 0;
var Canvas_1 = require("./Canvas");
var ClientSocket_js_1 = require("./ClientSocket.js");
var Elements_1 = require("./Elements");
var TileEditor_1 = require("./TileEditor");
var Warning_1 = require("./Warning");
var num = 0;
var newQuestions = [];
var givenOptions = 0;
function initCreation() {
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', ClientSocket_js_1.texts[243]);
    newQuestions = [];
    num = 0;
    var div = Canvas_1.doc.createElement('div');
    div.classList.add("form-group");
    div.id = 'questionDiv';
    var text = Canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'question';
    text.classList.add('form-control');
    text.name = 'question';
    text.required = true;
    text.style.width = '50%';
    text.placeholder = 'Sem napíš otázku';
    text.style.marginBottom = '3%';
    var label = Canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.htmlFor = text.id;
    label.textContent = ClientSocket_js_1.texts[66];
    div.appendChild(label);
    div.appendChild(text);
    div.style.marginBottom = '5px';
    div.style.width = '100%';
    document.getElementById('questionPlace').appendChild(div);
    addOption('questionPlace', '', false);
    addOption('questionPlace', '', false);
    //div = spawnDiv(document,'tileEditingPlace','buttonDiv',[])
    div = document.createElement('div');
    div.style.display = 'flex';
    div.id = 'addDiv';
    document.getElementById('tileEditingPlace').appendChild(div);
    var but = (0, Elements_1.spawnButton)(document, 'addDiv', '', ['btn', 'btn-secondary'], ClientSocket_js_1.texts[67], function () { addOption('questionPlace', '', false); });
    div = document.createElement('div');
    div.style.display = 'flex';
    div.id = 'buttonDiv';
    div.style.marginTop = '3%';
    document.getElementById('tileEditingPlace').appendChild(div);
    but = (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary'], ClientSocket_js_1.texts[58], function () { createQuestion(-1); });
    but.style.whiteSpace = 'nowrap';
    but = (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary', 'buttonLeftMargin'], ClientSocket_js_1.texts[70], function () { ClientSocket_js_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: false }); });
    but.style.whiteSpace = 'nowrap';
    but = (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary', 'buttonLeftMargin'], ClientSocket_js_1.texts[242], function () { initCreation(); });
    but.style.whiteSpace = 'nowrap';
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
    }
}
function addOption(parent, txt, is, id) {
    var _a;
    if (id === void 0) { id = -1; }
    num++;
    var div = Canvas_1.doc.createElement('div');
    div.classList.add("form-group");
    div.style.width = '100%';
    div.style.display = 'flex';
    var text = Canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'ans' + num;
    text.classList.add('form-control');
    text.name = 'ans' + num;
    text.required = true;
    text.value = txt;
    text.style.width = '50%';
    text.placeholder = 'Zadaj odpoveď číslo: ' + num;
    if (id > 0) {
        text.setAttribute('optionId', id.toString());
    }
    var check = Canvas_1.doc.createElement('input');
    check.type = 'checkbox';
    check.id = 'check' + num;
    check.style.width = '20px';
    check.classList.add('form-control');
    check.name = 'check' + num;
    check.checked = is;
    var labelCheck = Canvas_1.doc.createElement('label');
    labelCheck.htmlFor = check.id;
    labelCheck.textContent = 'správne ';
    labelCheck.style.color = 'white';
    labelCheck.style.fontSize = '20px';
    div.appendChild(text);
    newQuestions.push(num.valueOf());
    var deleteButton = document.createElement('button');
    deleteButton.textContent = ClientSocket_js_1.texts[70];
    deleteButton.type = 'button';
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-secondary');
    deleteButton.style.whiteSpace = 'nowrap';
    deleteButton.addEventListener('click', function () {
        var _a;
        newQuestions = newQuestions.filter(function (p) { return p != (num + 1); });
        (_a = document.getElementById(parent)) === null || _a === void 0 ? void 0 : _a.removeChild(div);
        num--;
        renumOptions();
    });
    div.appendChild(deleteButton);
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
    for (var i = 1; i <= num; i++) {
        if (document.getElementById('check' + i) != undefined) {
            if (document.getElementById('ans' + i).value != '') {
                var isAnswer = document.getElementById('check' + i).checked;
                if (isAnswer) {
                    can = true;
                }
                options.push({ isAnswer: isAnswer, txt: document.getElementById('ans' + i).value, id: document.getElementById('ans' + i).getAttribute('optionId') });
            }
        }
    }
    if (can) {
        var data = { question: '', options: options, id: localStorage.getItem('id'), questionId: id };
        data.question = document.getElementById('question').value;
        num = 0;
        ClientSocket_js_1.editorSocket.emit('upsertQuestion', data);
        Warning_1.Warning.show(ClientSocket_js_1.texts[245]);
    }
    else {
        Warning_1.Warning.show(ClientSocket_js_1.texts[191]);
    }
}
exports.createQuestion = createQuestion;
function showAllQuestions(data) {
    (0, TileEditor_1.removeAllButtons)();
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, Elements_1.spawnHeading)(document, 'tileEditingPlace', '', ClientSocket_js_1.texts[17]);
    var bt = (0, Elements_1.spawnButton)(document, 'tileEditingPlace', '', ['btn', 'btn-secondary'], ClientSocket_js_1.texts[241], function () { initCreation(); });
    bt.style.marginBottom = '3%;';
    var questions = new Map();
    data.forEach(function (elem) {
        var _a, _b;
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
        opt.textContent = elem.optionText;
        (_b = questions.get(elem.questionId)) === null || _b === void 0 ? void 0 : _b.appendChild(opt);
    });
}
exports.showAllQuestions = showAllQuestions;
function pickQuestion(data) {
    (0, Canvas_1.elementDeleter)('listPickerContainer');
    var questions = new Map();
    data.forEach(function (elem) {
        var _a, _b;
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
                $('#editEventModal').modal('hide');
                $('#EventModal').modal('hide');
                Canvas_1.game.setQuestionId(elem.questionId);
                document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[71] + elem.questionText;
                Canvas_1.game.setEvents('question', { num: elem.questionId, value: 0 });
                (0, TileEditor_1.update)();
            };
            list.appendChild(quest);
            (_a = document.getElementById('listPickerContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(list);
        }
        var opt = document.createElement('button');
        opt.type = 'button';
        opt.classList.add("list-group-item", "list-group-item-action");
        opt.textContent = elem.optionText;
        (_b = questions.get(elem.questionId)) === null || _b === void 0 ? void 0 : _b.appendChild(opt);
    });
}
exports.pickQuestion = pickQuestion;
var func = function () { };
function editQuestionMenu(id, txt, elem) {
    var _a, _b;
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', ClientSocket_js_1.texts[180]);
    newQuestions = [];
    num = 0;
    var div = Canvas_1.doc.createElement('div');
    div.classList.add("form-group");
    div.id = 'questionDiv';
    var text = Canvas_1.doc.createElement('input');
    text.type = 'text';
    text.id = 'question';
    text.classList.add('form-control');
    text.name = 'question';
    text.required = true;
    text.value = txt;
    text.style.width = '50%';
    text.style.float = 'left';
    var label = Canvas_1.doc.createElement('label');
    label.style.color = 'white';
    label.textContent = ClientSocket_js_1.texts[66];
    label.style.float = 'left';
    (_a = document.getElementById('questionPlace')) === null || _a === void 0 ? void 0 : _a.appendChild(label);
    div.appendChild(text);
    div.style.marginBottom = '5px';
    (_b = document.getElementById('questionPlace')) === null || _b === void 0 ? void 0 : _b.appendChild(div);
    elem.forEach(function (e) {
        addOption('questionPlace', e[1].optionText, e[1].isAnswer, e[0]);
    });
    div = document.createElement('div');
    div.style.display = 'flex';
    div.id = 'addDiv';
    document.getElementById('tileEditingPlace').appendChild(div);
    (0, Elements_1.spawnButton)(document, 'addDiv', '', ['btn', 'btn-secondary'], 'Pridaj možnosť!', function () { addOption('questionPlace', '', false); });
    div = document.createElement('div');
    div.style.display = 'flex';
    div.id = 'buttonDiv';
    document.getElementById('tileEditingPlace').appendChild(div);
    var button = (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary'], ClientSocket_js_1.texts[58], function () { createQuestion(id); });
    button.style.whiteSpace = 'nowrap';
    button = (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary', 'buttonLeftMargin'], ClientSocket_js_1.texts[70], function () {
        deleteQuestion(id);
        ClientSocket_js_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: false });
    });
    button.style.whiteSpace = 'nowrap';
    button = (0, Elements_1.spawnButton)(document, 'buttonDiv', '', ['btn', 'btn-secondary', 'buttonLeftMargin'], ClientSocket_js_1.texts[242], function () { initCreation(); });
    button.style.whiteSpace = 'nowrap';
}
function deleteQuestion(id) {
    if (Canvas_1.game.containsQuestionId(id)) {
        Warning_1.Warning.show(ClientSocket_js_1.texts[205]);
    }
    else if (Canvas_1.game.containsRandomQuestionAndQuestionNumberIs1()) {
        Warning_1.Warning.show(ClientSocket_js_1.texts[206]);
    }
    else {
        ClientSocket_js_1.editorSocket.emit('deleteQuestion', { id: localStorage.getItem('id'), questionId: id });
    }
}
function askQuestion(data) {
    var questions = new Map();
    (0, Canvas_1.elementDeleter)('answerQuestion');
    var i = 0;
    data.forEach(function (elem) {
        var _a, _b;
        i++;
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
    document.getElementById('answerButtonRoom').removeEventListener('click', ClientSocket_js_1.clickFunction);
    document.getElementById('answerButtonRoom').setAttribute('hidden', 'hidden');
    var params = new URLSearchParams(window.location.search);
    var right = [];
    var wrong = [];
    for (var i = 1; i <= givenOptions; i++) {
        var button = document.getElementById('givenOption' + i);
        if ((button === null || button === void 0 ? void 0 : button.getAttribute('isAnswer')) === 'true') {
            button.classList.remove('btn-light');
            button.classList.add('btn-success');
            button.classList.add('active');
            right.push(button.id);
        }
        else if (((button === null || button === void 0 ? void 0 : button.getAttribute('isAnswer')) === 'false' && (button === null || button === void 0 ? void 0 : button.classList.contains('active')))) {
            button.classList.remove('btn-light');
            button.classList.add('btn-danger');
            button.classList.add('active');
            wrong.push(button.id);
        }
    }
    ClientSocket_js_1.editorSocket.emit('showAnswersToOthers', { room: params.get('id'), wrong: wrong, right: right });
    setTimeout(function () {
        $('#answerModal').modal('hide');
        var answ = (wrong.length == 0);
        ClientSocket_js_1.editorSocket.emit('wasRightAnswer', { is: answ, room: params.get('id') });
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
