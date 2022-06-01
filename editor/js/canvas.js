"use strict";
exports.__esModule = true;
exports.changeNextTileText = exports.initNewGame = exports.resize = exports.reload = exports.game = exports.calibreEventCoords = exports.ctx = exports.canvas = exports.clear = exports.edit = exports.elementDeleter = exports.doc = exports.mainMenu = void 0;
var TileEditor_js_1 = require("./TileEditor.js");
var BackgroundEditor_1 = require("./BackgroundEditor");
var Elements_1 = require("./Elements");
var PawnEditor_1 = require("./PawnEditor");
var Pawn_1 = require("./Pawn");
var Questions_1 = require("./Questions");
var PawnStyle_1 = require("./PawnStyle");
var ClientSocket_1 = require("./ClientSocket");
var Warning_1 = require("./Warning");
var Game_1 = require("./Game");
var game = new Game_1.Game();
exports.game = game;
initNewGame();
var params = new URLSearchParams(window.location.search);
var canvas = document.createElement('canvas');
exports.canvas = canvas;
var ctx = canvas.getContext("2d");
exports.ctx = ctx;
function initNewGame() {
    exports.game = game = new Game_1.Game();
    game.getPlayerTokens().forEach(function (token) {
        game.getNextTilesIds().set(token, 2);
    });
}
exports.initNewGame = initNewGame;
function edit() {
    var _a, _b, _c, _d;
    mainMenu();
    (_a = document.getElementById('randomQuestionID')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        if (Array.from(game.getQuestions().entries()).length > 0) {
            game.setEvents('random', { num: 0, value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_1.texts[201];
            (0, TileEditor_js_1.update)();
        }
        else {
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            Warning_1.Warning.show(ClientSocket_1.texts[202]);
        }
    });
    document.getElementById('noneButton').addEventListener('click', function () {
        game.setEvents('none', { num: 0, value: 0 });
        $('#editEventModal').modal('hide');
        $('#EventModal').modal('hide');
        elementDeleter('askTheQuestionEventEdit');
        document.getElementById('pickedEventParagraph').textContent = ClientSocket_1.texts[197];
        (0, TileEditor_js_1.update)();
    });
    document.getElementById('forwardButton').addEventListener('click', function () {
        var _a, _b;
        (_a = document.getElementById('howManytimes')) === null || _a === void 0 ? void 0 : _a.removeAttribute('hidden');
        (_b = document.getElementById('diceValue')) === null || _b === void 0 ? void 0 : _b.setAttribute('hidden', 'hidden');
        elementDeleter('askTheQuestionEventEdit');
        elementDeleter('confirmEvent');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', ClientSocket_1.texts[97], false);
        (0, Elements_1.spawnButton)(document, 'confirmEvent', '', ['btn', 'btn-secondary'], ClientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            game.setEvents('forward', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_1.texts[99] + ' ' + nums + ' ' + ClientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('backwardButton').addEventListener('click', function () {
        var _a, _b;
        (_a = document.getElementById('howManytimes')) === null || _a === void 0 ? void 0 : _a.removeAttribute('hidden');
        (_b = document.getElementById('diceValue')) === null || _b === void 0 ? void 0 : _b.setAttribute('hidden', 'hidden');
        elementDeleter('askTheQuestionEventEdit');
        elementDeleter('confirmEvent');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', ClientSocket_1.texts[102], false);
        (0, Elements_1.spawnButton)(document, 'confirmEvent', '', ['btn', 'btn-secondary'], ClientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            game.setEvents('backward', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_1.texts[103] + ' ' + nums + ' ' + ClientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('skipButton').addEventListener('click', function () {
        var _a, _b;
        (_a = document.getElementById('howManytimes')) === null || _a === void 0 ? void 0 : _a.removeAttribute('hidden');
        (_b = document.getElementById('diceValue')) === null || _b === void 0 ? void 0 : _b.setAttribute('hidden', 'hidden');
        elementDeleter('confirmEvent');
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', ClientSocket_1.texts[104], false);
        (0, Elements_1.spawnButton)(document, 'confirmEvent', '', ['btn', 'btn-secondary'], ClientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            game.setEvents('skip', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_1.texts[105] + ' ' + nums + ' ' + ClientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('repeatButton').addEventListener('click', function () {
        var _a, _b;
        (_a = document.getElementById('howManytimes')) === null || _a === void 0 ? void 0 : _a.removeAttribute('hidden');
        (_b = document.getElementById('diceValue')) === null || _b === void 0 ? void 0 : _b.setAttribute('hidden', 'hidden');
        elementDeleter('askTheQuestionEventEdit');
        elementDeleter('confirmEvent');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', ClientSocket_1.texts[106], false);
        (0, Elements_1.spawnButton)(document, 'confirmEvent', '', ['btn', 'btn-secondary'], ClientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            game.setEvents('repeat', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_1.texts[107] + ' ' + nums + ' ' + ClientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('stopButton').addEventListener('click', function () {
        var _a, _b;
        (_a = document.getElementById('howManytimes')) === null || _a === void 0 ? void 0 : _a.setAttribute('hidden', 'hidden');
        (_b = document.getElementById('diceValue')) === null || _b === void 0 ? void 0 : _b.removeAttribute('hidden');
        elementDeleter('askTheQuestionEventEdit');
        elementDeleter('confirmEvent');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', ClientSocket_1.texts[109], false);
        (0, Elements_1.spawnButton)(document, 'confirmEvent', '', ['btn', 'btn-secondary'], ClientSocket_1.texts[101], function () {
            var nums = document.getElementById('diceValue').value;
            game.setEvents('stop', { num: parseInt(nums), value: parseInt(nums) });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_1.texts[110] + ' ' + nums + ' ' + ClientSocket_1.texts[111];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('editBackground').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, BackgroundEditor_1.editBackground)();
    });
    document.getElementById('insertTiles').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, TileEditor_js_1.startInsertingByOne)();
    });
    document.getElementById('questionManager').addEventListener('click', function () {
        elementDeleter('listContainer');
        ClientSocket_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: false });
    });
    document.getElementById('generalInfoButton').addEventListener('click', function () {
        (0, TileEditor_js_1.removeAllButtons)();
        (0, TileEditor_js_1.removeAllListenersAdded)();
        mainMenu();
    });
    document.getElementById('addButtonInsert').addEventListener('click', function () { (0, Questions_1.addOption)('questionOptions', '', false); });
    document.getElementById('addButtonEdit').addEventListener('click', function () { (0, Questions_1.addOption)('editQuestion', '', false); });
    document.getElementById('createQuestionButtonModal').addEventListener('click', function () {
        (0, Questions_1.initCreation)();
    });
    document.getElementById('deleteGameButton').addEventListener('click', function () {
        ClientSocket_1.editorSocket.emit('deleteGame', { id: localStorage.getItem('id'), name: game.getName() });
        window.location.replace('/editor');
    });
    (_b = document.getElementById('nextTileButtonSet')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        var _a;
        game.getPlayerTokens().forEach(function (token) {
            var input = document.getElementById('nextTile' + token).value;
            game.getNextTilesIds().set(token, parseInt(input));
        });
        if (game.getChoosenTile() != undefined) {
            (_a = game.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setNextTilesIds((0, TileEditor_js_1.copyNextTileMap)());
        }
        changeNextTileText();
    });
    document.getElementById('questionSubmitButton').addEventListener('click', function () { (0, Questions_1.createQuestion)(-1); });
    document.getElementById('eventQuestionButton').addEventListener('click', function () {
        ClientSocket_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: true });
        $('#pickQuestionModal').modal('show');
    });
    (_c = document.getElementById('loadCreatedGameModal')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
        var val = document.getElementById('gameNameInput').value;
        (0, TileEditor_js_1.removeAllButtons)();
        ClientSocket_1.editorSocket.emit('load game', { id: (0, ClientSocket_1.getCookie)('id'), name: val, response: true });
        mainMenu();
    });
    (_d = document.getElementById('loadGameButton')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
        ClientSocket_1.editorSocket.emit('loadGameNames', { id: localStorage.getItem('id') });
    });
    document.getElementById('editPawn').addEventListener('click', function () { (0, PawnEditor_1.pawnEditMenu)(); });
}
exports.edit = edit;
var doc = document;
exports.doc = doc;
document.getElementById("canvasPlace").appendChild(canvas);
var started = false;
function changeNextTileText() {
    var nextTile = document.getElementById('setNextTileButtonlabel');
    nextTile.textContent = ClientSocket_1.texts[141] + ' (';
    var arr = Array.from(game.getNextTilesIds().values());
    arr.forEach(function (num) {
        nextTile.textContent += ' ' + num + ',';
    });
    nextTile.textContent = nextTile.textContent.slice(0, nextTile.textContent.length - 1);
    nextTile.textContent += ')';
    var set = new Set(arr);
    if (set.size == 1) {
        nextTile.textContent = ClientSocket_1.texts[141] + ' (' + arr[0] + ')';
    }
}
exports.changeNextTileText = changeNextTileText;
function mainMenu() {
    started = false;
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', ClientSocket_1.texts[21]);
    var numOfPlayersSlider = document.createElement('input');
    numOfPlayersSlider.type = 'range';
    numOfPlayersSlider.id = 'numOfPlayers';
    numOfPlayersSlider.value = game.getnumOfPlayers().toString();
    numOfPlayersSlider.min = '1';
    numOfPlayersSlider.max = '6';
    numOfPlayersSlider.step = '1';
    var numShower = document.createElement('paragraph');
    numShower.id = 'numShower';
    numShower.textContent = game.getnumOfPlayers().toString();
    var text = document.createElement('p');
    text.textContent = ClientSocket_1.texts[22];
    document.getElementById("numOfPlayersPlace").appendChild(text);
    document.getElementById("numOfPlayersPlace").appendChild(numShower);
    numOfPlayersSlider.onclick = function () {
        document.getElementById("numShower").textContent = numOfPlayersSlider.value;
        game.setNumOfPlayers(parseInt(numOfPlayersSlider.value));
        var number = parseInt(numOfPlayersSlider.value);
        var playerTokens = game.getPlayerTokens();
        if (number < playerTokens.length) {
            var _loop_1 = function (i) {
                playerTokens.pop();
                game.getPawnStyle()["delete"]('Player ' + i);
                game.getNextTilesIds()["delete"]('Player ' + i);
                var rem = [];
                game.getPawns().forEach(function (pawn) {
                    if (pawn.player == ('Player ' + i)) {
                        rem.push(pawn);
                    }
                });
                rem.forEach(function (pawn) {
                    game.removePawn(pawn);
                    pawn.tile.removePawn(pawn);
                });
            };
            for (var i = number; i <= 6; i++) {
                _loop_1(i);
            }
        }
        if (number > playerTokens.length) {
            for (var i = 1; i <= number; i++) {
                if (!playerTokens.includes('Player ' + i)) {
                    playerTokens.push('Player ' + (playerTokens.length + 1));
                    game.getNextTilesIds().set('Player ' + i, game.getTiles().length + 2);
                    game.getPawnStyle().set('Player ' + i, new PawnStyle_1.PawnStyle('Player ' + i, '#000000', 'type1'));
                }
            }
        }
        game.setPlayerTokens(playerTokens);
        reload(ctx);
    };
    document.getElementById("numOfPlayersPlace").appendChild(numOfPlayersSlider);
    var gameName = document.createElement('input');
    gameName.id = 'gameName';
    gameName.value = game.getName();
    text = document.createElement('p');
    text.textContent = ClientSocket_1.texts[23];
    document.getElementById("gameNamePlace").appendChild(text);
    gameName.oninput = function () {
        game.setName(gameName.value.trim());
    };
    document.getElementById("gameNamePlace").appendChild(gameName);
    var gameType = document.createElement('select');
    gameType.id = 'gameType';
    var slid = (0, Elements_1.spawnSliderWithValueShower)(document, 'tileEditingPlace', 'pawnNumberSlider', ClientSocket_1.texts[112], '1', '4', '1', game.getNumberOfStartingPawns().toString());
    slid.style.width = '100%';
    slid.onchange = function () {
        var max = parseInt(slid.value);
        if (max > game.getNumberOfStartingPawns()) {
            game.getPlayerTokens().forEach(function (player) {
                for (var i = 0; i < (max - game.getNumberOfStartingPawns()); i++) {
                    game.getTiles().forEach(function (tile) {
                        if (tile.getIsStartingFor().includes(player)) {
                            var newPawn = new Pawn_1.Pawn(player, tile);
                            game.getPawns().push(newPawn);
                        }
                    });
                }
            });
        }
        else {
            game.getPlayerTokens().forEach(function (player) {
                var num = 0;
                var rem = [];
                game.getTiles().forEach(function (tile) {
                    num = 0;
                    tile.getPawns().forEach(function (pawn) {
                        if (pawn.player == player) {
                            num++;
                            if (num > max) {
                                rem.push(pawn);
                            }
                        }
                        rem.forEach(function (pawn) {
                            game.removePawn(pawn);
                            pawn.tile.removePawn(pawn);
                        });
                    });
                });
            });
        }
        game.setNumberOfStartingPawns(max);
        reload(ctx);
    };
    var numbering = (0, Elements_1.spawnCheckerWithLabel)(doc, 'tileEditingPlace', 'toogleNumberingChecker', ClientSocket_1.texts[137], game.getToogleNumber(), [ClientSocket_1.texts[92], ClientSocket_1.texts[93]]);
    numbering.onchange = function () {
        if (numbering.checked) {
            game.setToogleNumber(true);
        }
        else {
            game.setToogleNumber(false);
        }
    };
    (0, Elements_1.spawnButton)(document, 'tileEditingPlace', 'savaGameButton', ["btn", "btn-dark"], ClientSocket_1.texts[113], function () {
        var numOfFinishTiles = game.numberOfFinishingTilesPerToken();
        var numOfPawnsPerPlayers = game.numberOfPawnsPerPlayer();
        var ret = false;
        game.getPlayerTokens().forEach(function (token) {
            if (numOfFinishTiles.get(token) > numOfPawnsPerPlayers.get(token)) {
                ret = true;
            }
        });
        if (game.checkIfAllPlayersHaveFinishTile().length > 0) {
            Warning_1.Warning.show(ClientSocket_1.texts[183]);
        }
        else if (game.checkIfAllPlayersHaveStartingTile().length > 0) {
            Warning_1.Warning.show(ClientSocket_1.texts[184]);
        }
        else if (ret) {
            Warning_1.Warning.show(ClientSocket_1.texts[209]);
        }
        else {
            game.saveGame();
            Warning_1.Warning.show(ClientSocket_1.texts[249]);
        }
    });
    var button = (0, Elements_1.spawnButton)(document, 'tileEditingPlace', 'publishGame', ['btn', 'btn-dark'], ClientSocket_1.texts[181], function () {
        if (!game.getIsPublished()) {
            var numOfFinishTiles_1 = game.numberOfFinishingTilesPerToken();
            var numOfPawnsPerPlayers_1 = game.numberOfPawnsPerPlayer();
            var ret_1 = false;
            game.getPlayerTokens().forEach(function (token) {
                if (numOfFinishTiles_1.get(token) > numOfPawnsPerPlayers_1.get(token)) {
                    ret_1 = true;
                }
            });
            if (game.checkIfAllPlayersHaveFinishTile().length > 0) {
                Warning_1.Warning.show(ClientSocket_1.texts[183]);
            }
            else if (game.checkIfAllPlayersHaveStartingTile().length > 0) {
                Warning_1.Warning.show(ClientSocket_1.texts[184]);
            }
            else if (ret_1) {
                Warning_1.Warning.show(ClientSocket_1.texts[209]);
            }
            else {
                button.textContent = ClientSocket_1.texts[258];
                game.setIsPublished(true);
                game.saveGame();
                Warning_1.Warning.show(ClientSocket_1.texts[250]);
            }
        }
        else {
            game.setIsPublished(false);
            ClientSocket_1.editorSocket.emit('make game not published', { id: localStorage.getItem('id'), name: game.getName() });
            button.textContent = ClientSocket_1.texts[181];
            Warning_1.Warning.show(ClientSocket_1.texts[259]);
        }
    });
    if (game.getIsPublished()) {
        button.textContent = ClientSocket_1.texts[258];
    }
    else {
        button.textContent = ClientSocket_1.texts[181];
    }
}
exports.mainMenu = mainMenu;
resize(game, ctx);
window.addEventListener('resize', function () { resize(game, ctx); });
function resize(editor, context) {
    context.canvas.width = window.innerWidth / 3 * 2 - 30;
    context.canvas.height = window.innerHeight;
    if (game.getInitSizeX() == 0) {
        game.setInitSizeX(canvas.width);
    }
    if (game.getInitSizeY() == 0) {
        game.setInitSizeY(canvas.height);
    }
    game.setScaleX(canvas.width / game.getInitSizeX());
    game.setScaleY((canvas.height - 20) / game.getInitSizeY());
    reload(context);
}
exports.resize = resize;
function reload(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (game.getBackground() != undefined) {
        game.getBackground().draw();
    }
    ctx.closePath();
    var tiles = game.getTiles();
    tiles.forEach(function (tile) {
        tile.drawTile(canvas, ctx, false);
        tile.drawPawns(ctx);
    });
    ctx.closePath();
    ctx.restore();
}
exports.reload = reload;
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
exports.clear = clear;
function elementDeleter(parent) {
    var _a, _b;
    while (((_a = document.getElementById(parent)) === null || _a === void 0 ? void 0 : _a.lastChild) != null) {
        (_b = document.getElementById(parent)) === null || _b === void 0 ? void 0 : _b.removeChild(document.getElementById(parent).lastChild);
    }
}
exports.elementDeleter = elementDeleter;
function calibreEventCoords(event) {
    return { x: event.offsetX, y: event.offsetY };
}
exports.calibreEventCoords = calibreEventCoords;
window.onload = function () {
    if (params.get('id') != null) {
        ClientSocket_1.editorSocket.emit('reload waiting room', { room: params.get('id') });
    }
};
