"use strict";
exports.__esModule = true;
exports.throwDice = exports.changeWaitingRoom = exports.initDice = exports.initGameInfo = void 0;
var Elements_1 = require("./Elements");
var canvas_1 = require("./canvas");
var clientSocket_js_1 = require("./clientSocket.js");
var diceImages = [];
var dice;
var _loop_1 = function (i) {
    var image = new Image();
    image.src = '../../src/Dice1.png';
    image.onload = function () {
        diceImages.push(image);
    };
};
for (var i = 1; i <= 6; i++) {
    _loop_1(i);
}
function initGameInfo(name) {
    (0, Elements_1.spawnParagraph)(canvas_1.doc, "tileEditingPlace", '', clientSocket_js_1.texts[118] + name, true);
}
exports.initGameInfo = initGameInfo;
function initDice() {
    var dice = new Image();
    dice.src = '../../src/Dice1.png';
    dice.id = 'Dice';
    dice.onload = function () {
        var _a;
        (_a = document.getElementById('dicePlace')) === null || _a === void 0 ? void 0 : _a.append(dice);
    };
    var _loop_2 = function (i) {
        var image = new Image();
        image.src = '../../src/Dice' + i + '.png';
        image.onload = function () {
            diceImages.push(image);
        };
    };
    for (var i = 1; i <= 6; i++) {
        _loop_2(i);
    }
}
exports.initDice = initDice;
function throwDice(token) {
    canvas_1.game.setCanThrow(false);
    var params = new URLSearchParams(window.location.search);
    var t = 0;
    var times = 0;
    var n = 0;
    var interval = setInterval(function () {
        var _a;
        if (times == 10) {
            var params_1 = new URLSearchParams(window.location.search);
            clearInterval(interval);
            clientSocket_js_1.editorSocket.emit('player thrown', { room: params_1.get('id'), token: token, value: n, tileId: (_a = canvas_1.game.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.getId() });
            //document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
        }
        else {
            times++;
            n = Math.floor(Math.random() * 6) + 1;
            if (t != n) {
                t = n;
                clientSocket_js_1.editorSocket.emit('show Dice', { id: params.get('id'), value: t });
            }
            var image_1 = new Image();
            image_1.src = '../../src/Dice' + t + '.png';
            image_1.id = 'Dice';
            image_1.onload = function () {
                var _a;
                var rem = document.getElementById('Dice');
                (0, canvas_1.elementDeleter)('dicePlace');
                (_a = document.getElementById('dicePlace')) === null || _a === void 0 ? void 0 : _a.append(image_1);
            };
        }
        //.getElementById('dicePlace')?.append(dice)
    }, 200);
}
exports.throwDice = throwDice;
function changeWaitingRoom(accs) {
    var div = document.getElementById('waitingContainer');
    var divPlaying = document.getElementById('playingContainer');
    var divending = document.getElementById('endContainer');
    (0, canvas_1.elementDeleter)('waitingContainer');
    (0, canvas_1.elementDeleter)('playingContainer');
    (0, canvas_1.elementDeleter)('endContainer');
    var i = 0;
    var _loop_3 = function () {
        var quest = document.createElement('button');
        quest.type = 'button';
        quest.classList.add("list-group-item", "list-group-item-action", "active");
        quest.style.backgroundColor = canvas_1.game.getPawnStyle().get(accs[i].token).getColor();
        quest.style.textAlign = 'center';
        quest.textContent = accs[i].name;
        div.appendChild(quest);
        var place = document.createElement('place');
        if (accs[i].place > 0) {
            if (accs[i].place == 1) {
                quest.textContent = clientSocket_js_1.texts[116] + quest.textContent;
            }
            else {
                quest.textContent = accs[i].place.toString() + clientSocket_js_1.texts[117] + quest.textContent;
            }
        }
        var questClone = quest.cloneNode();
        questClone.textContent = quest.textContent;
        var questClone1 = quest.cloneNode();
        questClone1.textContent = quest.textContent;
        divPlaying.appendChild(questClone);
        divending.appendChild(questClone1);
        var image = document.createElement("IMG");
        image.src = accs[i].avatar;
        image.style.width = '50px';
        image.style.height = '50px';
        image.style.textAlign = 'right';
        image.onload = function () {
            quest.appendChild(image);
            questClone.appendChild(image.cloneNode());
            questClone1.appendChild(image.cloneNode());
        };
        //if(accs[i].place != 0){
        // let place = document.createElement('place')
        // if (accs[i].place == 1){
        //     place.textContent = 'Winner !!'
        // }
        // else{
        //     place.textContent = accs[i].place.toString()+'. Place'
        // }
        // quest.appendChild(place)
        // questClone.appendChild(place.cloneNode())
        //}
        i++;
    };
    while (i < accs.length) {
        _loop_3();
    }
}
exports.changeWaitingRoom = changeWaitingRoom;
