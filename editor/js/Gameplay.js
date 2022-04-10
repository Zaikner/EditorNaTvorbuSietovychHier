"use strict";
exports.__esModule = true;
exports.throwDice = exports.changeWaitingRoom = exports.initDice = exports.initGameInfo = void 0;
var Elements_1 = require("./Elements");
var canvas_1 = require("./canvas");
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
    (0, Elements_1.spawnParagraph)(canvas_1.doc, "tileEditingPlace", '', 'Game: ' + name);
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
    var params = new URLSearchParams(window.location.search);
    var t = 0;
    var times = 0;
    var n = 0;
    var interval = setInterval(function () {
        var _a, _b;
        if (times == 10) {
            var params_1 = new URLSearchParams(window.location.search);
            clearInterval(interval);
            console.log('player emitol takyto hod:');
            console.log({ room: params_1.get('id'), value: n, tileId: (_a = canvas_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.getId() });
            canvas_1.editorSocket.emit('player thrown', { room: params_1.get('id'), token: token, value: n, tileId: (_b = canvas_1.editor.getChoosenTile()) === null || _b === void 0 ? void 0 : _b.getId() });
            //document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
        }
        else {
            times++;
            n = Math.floor(Math.random() * 6) + 1;
            if (t != n) {
                t = n;
                canvas_1.editorSocket.emit('show Dice', { id: params.get('id'), value: t });
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
    (0, canvas_1.elementDeleter)('waitingContainer');
    (0, canvas_1.elementDeleter)('playingContainer');
    var i = 0;
    var _loop_3 = function () {
        var quest = document.createElement('button');
        quest.type = 'button';
        quest.classList.add("list-group-item", "list-group-item-action", "active", "btn-danger");
        quest.style.textAlign = 'center';
        quest.textContent = accs[i].name;
        div.appendChild(quest);
        var questClone = quest.cloneNode();
        questClone.textContent = accs[i].name;
        divPlaying.appendChild(questClone);
        var image = document.createElement("IMG");
        image.src = accs[i].avatar;
        image.style.width = '50px';
        image.style.height = '50px';
        image.style.textAlign = 'right';
        image.onload = function () {
            quest.appendChild(image);
            questClone.appendChild(image.cloneNode());
        };
        i++;
    };
    while (i < accs.length) {
        _loop_3();
    }
}
exports.changeWaitingRoom = changeWaitingRoom;
