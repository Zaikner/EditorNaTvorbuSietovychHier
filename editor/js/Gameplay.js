"use strict";
exports.__esModule = true;
exports.Gameplay = void 0;
var Elements_1 = require("./Elements");
var Canvas_1 = require("./Canvas");
var ClientSocket_js_1 = require("./ClientSocket.js");
var Warning_1 = require("./Warning");
var Gameplay = /** @class */ (function () {
    function Gameplay() {
    }
    Gameplay.init = function () {
        this.dice = new Image();
        var diceImages = [];
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
        this.diceImages = diceImages;
    };
    Gameplay.initGameInfo = function (name) {
        (0, Elements_1.spawnHeading)(Canvas_1.doc, "tileEditingPlace", '', ClientSocket_js_1.texts[118] + name);
    };
    Gameplay.initDice = function (name) {
        (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', 'Hráč: ' + name);
        var diceImages = [];
        this.dice = new Image();
        this.dice.src = '../../src/Dice1.png';
        this.dice.id = 'Dice';
        var dice = this.dice;
        this.dice.onload = function () {
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
    };
    Gameplay.changeWaitingRoom = function (accs) {
        var div = document.getElementById('waitingContainer');
        var divPlaying = document.getElementById('playingContainer');
        var divending = document.getElementById('endContainer');
        (0, Canvas_1.elementDeleter)('waitingContainer');
        (0, Canvas_1.elementDeleter)('playingContainer');
        (0, Canvas_1.elementDeleter)('endContainer');
        var i = 0;
        var _loop_3 = function () {
            var quest = document.createElement('button');
            quest.type = 'button';
            quest.classList.add("list-group-item", "list-group-item-action", "active");
            quest.style.backgroundColor = Canvas_1.game.getPawnStyle().get(accs[i].token).getColor();
            quest.style.textAlign = 'center';
            quest.textContent = accs[i].name + ' ';
            div.appendChild(quest);
            var place = document.createElement('place');
            if (accs[i].place > 0) {
                if (accs[i].place == 1) {
                    quest.textContent = ClientSocket_js_1.texts[116] + quest.textContent;
                }
                else {
                    quest.textContent = accs[i].place.toString() + ClientSocket_js_1.texts[117] + ' ' + quest.textContent;
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
            i++;
        };
        while (i < accs.length) {
            _loop_3();
        }
    };
    Gameplay.throwDice = function (token) {
        Canvas_1.game.setCanThrow(false);
        Canvas_1.game.setHasThrown(true);
        var params = new URLSearchParams(window.location.search);
        var t = 0;
        var times = 0;
        var n = 0;
        var interval = setInterval(function () {
            var _a;
            if (times == 10) {
                var params_1 = new URLSearchParams(window.location.search);
                clearInterval(interval);
                var can_1 = false;
                Canvas_1.game.getPawns().forEach(function (pawn) {
                    if (pawn.player == token) {
                        if (pawn.canMove(n)) {
                            can_1 = true;
                        }
                    }
                });
                if (!can_1) {
                    Warning_1.Warning.showInGame('Nemôžeš sa pohnuť so žiadnou tvojou figúrkou, preskakuješ tvoje kolo.');
                }
                ClientSocket_js_1.editorSocket.emit('player thrown', { room: params_1.get('id'), token: token, value: n, tileId: (_a = Canvas_1.game.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.getId(), canMove: can_1 });
            }
            else {
                times++;
                n = Math.floor(Math.random() * 6) + 1;
                if (t != n) {
                    t = n;
                    ClientSocket_js_1.editorSocket.emit('show Dice', { id: params.get('id'), value: t });
                }
                var image_1 = new Image();
                image_1.src = '../../src/Dice' + t + '.png';
                image_1.id = 'Dice';
                image_1.onload = function () {
                    var _a;
                    (0, Canvas_1.elementDeleter)('dicePlace');
                    (_a = document.getElementById('dicePlace')) === null || _a === void 0 ? void 0 : _a.append(image_1);
                };
            }
        }, 200);
    };
    Gameplay.diceImages = [];
    return Gameplay;
}());
exports.Gameplay = Gameplay;
