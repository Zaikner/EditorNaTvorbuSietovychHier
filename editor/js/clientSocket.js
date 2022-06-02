"use strict";
exports.__esModule = true;
exports.texts = exports.getCookie = exports.clickFunction = exports.isEditor = exports.canMovePawnFunc = exports.editorSocket = void 0;
var socket_io_client_1 = require("socket.io-client");
var Background_1 = require("./Background");
var Canvas_1 = require("./Canvas");
var Elements_1 = require("./Elements");
var GameLoader_1 = require("./GameLoader");
var Gameplay_1 = require("./Gameplay");
var Pawn_1 = require("./Pawn");
var PawnStyle_1 = require("./PawnStyle");
var Questions_1 = require("./Questions");
var Rules_1 = require("./Rules");
var Tile_1 = require("./Tile");
var TileEditor_1 = require("./TileEditor");
var UtilityFunctions_1 = require("./UtilityFunctions");
exports.getCookie = UtilityFunctions_1.getCookie;
var Warning_1 = require("./Warning");
var texts = [];
exports.texts = texts;
var isEditor = false;
exports.isEditor = isEditor;
var zoz = window.location.href.split('/');
var params = new URLSearchParams(window.location.search);
var editorSocket = (0, socket_io_client_1.io)();
exports.editorSocket = editorSocket;
setInterval(function () { editorSocket.emit('ping', { id: localStorage.getItem('id') }); }, 5000);
var canMovePawnFunc;
exports.canMovePawnFunc = canMovePawnFunc;
var clickFunction = function () { (0, Questions_1.evaluateQuestion)(); };
exports.clickFunction = clickFunction;
var ClientSocket = /** @class */ (function () {
    function ClientSocket(s) {
        var _a;
        s.emit('get texts', {});
        s.on('connected', function (msg) {
            (0, Canvas_1.initNewGame)();
            (0, Canvas_1.clear)();
            var newIds = new Map();
            var newId = 0;
            msg.tiles.forEach(function (tile) {
                newId++;
                var addedTile = new Tile_1.Tile(tile.centerX, tile.centerY, tile.x1, tile.x2, tile.y1, tile.y2, tile.radius, tile.color, tile.tileNumber);
                addedTile.setId(newId);
                newIds.set(tile.id, newId);
                addedTile.setStroke(tile.stroke);
                addedTile.setStrokeColor(tile.strokeColor);
                addedTile.setShape(tile.shape);
                addedTile.setIsChoosen(tile.isChoosen);
                if (tile.image != 'none') {
                    var image_1 = new Image();
                    image_1.src = tile.image;
                    image_1.onload = function () {
                        addedTile.setImage(image_1);
                        (0, Canvas_1.reload)(Canvas_1.ctx);
                    };
                }
                addedTile.setIsEndingFor(tile.isEndingFor);
                addedTile.setIsStartingFor(tile.isStartingFor);
                addedTile.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile);
                addedTile.setSkip(tile.skip);
                addedTile.setRepeat(tile.repeat);
                addedTile.setForward(tile.forward);
                addedTile.setBackward(tile.backward);
                addedTile.setMustThrown(tile.mustThrown);
                addedTile.setQuestionId(tile.questionId);
                addedTile.setRandomQuestion(tile.randomQuestion);
                var t = tile.nextTilesIds;
                var add = new Map();
                for (var i_1 = 0; i_1 * 2 < t.length; i_1++) {
                    add.set(t[2 * i_1], parseInt(t[2 * i_1 + 1]));
                }
                addedTile.setNextTilesIds(add);
                Canvas_1.game.addTile(addedTile);
                (0, Canvas_1.reload)(Canvas_1.ctx);
            });
            Canvas_1.game.setNextTileId(newId + 1);
            var background = new Background_1.Background();
            background.setColor(msg.background.color);
            if (msg.background.image != 'none') {
                var backImage_1 = new Image();
                backImage_1.src = msg.background.image;
                backImage_1.onload = function () {
                    background.setBackgroundImage(backImage_1);
                    Canvas_1.game.setBackground(background);
                    (0, Canvas_1.reload)(Canvas_1.ctx);
                };
                background.setBackgroundImage(backImage_1);
            }
            Canvas_1.game.setBackground(background);
            Canvas_1.game.setAuthor(msg.author);
            Canvas_1.game.setName(msg.game.name);
            Canvas_1.game.setNumOfPlayers(msg.game.numOfPlayers);
            Canvas_1.game.setNumberOfStartingPawns(msg.game.numOfPawnsPerTile);
            var numOfPlayer = document.getElementById('numOfPlayers');
            var numOfPlayerShower = document.getElementById('numShower');
            var numberOfStartingPawns = document.getElementById('pawnNumberSlider');
            var numberOfStartingPawnsShower = document.getElementById('pawnNumberSliderShower');
            if (numOfPlayer != undefined) {
                numOfPlayer.value = msg.game.numOfPlayers;
                numOfPlayerShower.textContent = msg.game.numOfPlayers;
            }
            if (numberOfStartingPawns != undefined) {
                numberOfStartingPawns.value = msg.game.numOfPawnsPerTile;
                numberOfStartingPawnsShower.textContent = msg.game.numOfPawnsPerTile;
            }
            Canvas_1.game.setRules(msg.rules);
            Canvas_1.game.setInitSizeX(msg.game.initSizeX);
            Canvas_1.game.setInitSizeY(msg.game.initSizeY);
            Canvas_1.game.setIsPublished(msg.game.isPublished);
            Canvas_1.game.setToogleNumber(msg.game.toogleNumber);
            Canvas_1.game.setId(msg.game.id);
            if (isEditor) {
                document.getElementById('toogleNumberingChecker').checked = Canvas_1.game.getToogleNumber();
                if (Canvas_1.game.getIsPublished()) {
                    document.getElementById('publishGame').textContent = texts[258];
                }
            }
            var gameNextTiles = msg.game.nextTilesIds;
            var add = new Map();
            for (var i_2 = 0; i_2 * 2 < gameNextTiles.length; i_2++) {
                add.set(gameNextTiles[2 * i_2], parseInt(gameNextTiles[2 * i_2 + 1]));
            }
            Canvas_1.game.setNextTilesIds(add);
            var tokens = [];
            for (var i_3 = 1; i_3 <= Canvas_1.game.getnumOfPlayers(); i_3++) {
                tokens.push('Player ' + i_3);
            }
            Canvas_1.game.setPlayerTokens(tokens);
            if (params.get('id') == undefined && params.get('name') != undefined) {
                Gameplay_1.Gameplay.initGameInfo(msg.game.name);
            }
            var i = 0;
            msg.pawns.forEach(function (pawn) {
                i++;
                var tile = Canvas_1.game.findTileById(newIds.get(pawn.tileId));
                var p = new Pawn_1.Pawn(pawn.token, tile);
                p.id = pawn.id;
                Canvas_1.game.getPawns().push(p);
            });
            msg.styles.forEach(function (style) {
                var p = new PawnStyle_1.PawnStyle(style.player, style.color, style.type);
                if (style.image != 'none') {
                    p.setImage(style.image);
                    var backImage_2 = new Image();
                    backImage_2.src = style.image;
                    backImage_2.onload = function () {
                        p.setImage(backImage_2);
                        Canvas_1.game.getPawnStyle().set(style.player, p);
                        (0, Canvas_1.reload)(Canvas_1.ctx);
                    };
                }
                else {
                    Canvas_1.game.getPawnStyle().set(style.player, p);
                }
            });
            console.log('loaded game:');
            console.log(Canvas_1.game);
            var gm = document.getElementById('gameName');
            if (gm != undefined) {
                gm.value = Canvas_1.game.getName();
            }
            (0, Canvas_1.resize)(Canvas_1.game, Canvas_1.ctx);
        });
        s.on('react to event: forward', function (msg) {
            Canvas_1.game.setIsOnTurn(true);
            var ret = Canvas_1.game.howManyCanMove(msg.pawnId, msg.value);
            s.emit('move pawns', { pawn: msg.pawnId, value: ret, room: params.get('id'), eval: eval });
        });
        s.on('react to event: backward', function (msg) {
            Canvas_1.game.setIsOnTurn(true);
            var ret = Canvas_1.game.howManyCanMoveBack(msg.pawnId, msg.value);
            s.emit('move pawns back', { pawn: msg.pawnId, value: ret, room: params.get('id') });
        });
        s.on('not author', function () {
            Warning_1.Warning.show(texts[185]);
        });
        s.on('game saved', function (msg) {
            Canvas_1.game.setId(msg.newId);
        });
        s.on('react to event: skip', function (msg) {
            Warning_1.Warning.showInGame(texts[262] + ' ' + msg.token + ' ' + texts[263] + msg.left);
        });
        s.on('react to event:must Thrown', function (msg) {
            Warning_1.Warning.showInGame(texts[262] + ' ' + msg.token + texts[264] + ' ' + msg.value);
        });
        s.on('return pawns to starting tile', function (msg) {
            msg.ids.forEach(function (id) {
                Canvas_1.game.findPawnById(id).returnToStart();
            });
            (0, Canvas_1.reload)(Canvas_1.ctx);
        });
        s.on('join Room', function (msg) {
            Gameplay_1.Gameplay.initDice(msg.name);
            s.emit('join player to Room', { id: (0, UtilityFunctions_1.getCookie)('id'), roomId: msg.id });
            if (!msg.started) {
                $('#waitingModal').modal('show');
            }
            (0, Canvas_1.reload)(Canvas_1.ctx);
            s.on('player joined', function (msg) {
                s.emit('reload waiting room', { room: params.get('id') });
                var chat = document.getElementById('chat');
                var chatPlaying = document.getElementById("chatPlaying");
                if (chat.value == '') {
                    chat.value = texts[227] + ' ' + msg.msg + ' ' + texts[229];
                }
                else {
                    chat.value = chat.value + '\n' + texts[227] + ' ' + msg.msg + ' ' + texts[229];
                }
                if (chatPlaying.value == '') {
                    chatPlaying.value = texts[227] + ' ' + msg.msg + ' ' + texts[229];
                }
                else {
                    chatPlaying.value = chatPlaying.value + '\n' + texts[227] + ' ' + msg.msg + ' ' + texts[229];
                }
                (0, Canvas_1.reload)(Canvas_1.ctx);
            });
        });
        s.on('player left', function (msg) {
            var rem = [];
            Canvas_1.game.getPawns().forEach(function (pawn) {
                if (pawn.player == msg.token) {
                    rem.push(pawn);
                }
            });
            rem.forEach(function (pawn) {
                Canvas_1.game.removePawn(pawn);
                pawn.tile.removePawn(pawn);
            });
            (0, Canvas_1.reload)(Canvas_1.ctx);
            var chat = document.getElementById('chat');
            var chatPlaying = document.getElementById("chatPlaying");
            if (chat.value == '') {
                chat.value = texts[227] + ' ' + msg.msg + ' ' + texts[228];
            }
            else {
                chat.value = chat.value + '\n' + texts[227] + ' ' + msg.msg + ' ' + texts[228];
            }
            if (chatPlaying.value == '') {
                chatPlaying.value = texts[227] + ' ' + msg.msg + ' ' + texts[228];
            }
            else {
                chatPlaying.value = chatPlaying.value + '\n' + texts[227] + ' ' + msg.msg + ' ' + texts[228];
            }
            s.emit('reload waiting room', { room: params.get('id') });
            (0, Canvas_1.reload)(Canvas_1.ctx);
        });
        s.on('game started', function (msg) {
            $('#waitingModal').modal('hide');
            var chat = document.getElementById('chat');
            var chatPlaying = document.getElementById("chatPlaying");
            if (chat.value == '') {
                chat.value = texts[231];
            }
            else {
                chat.value = chat.value + '\n' + texts[231];
            }
            if (chatPlaying.value == '') {
                chatPlaying.value = texts[231];
            }
            else {
                chatPlaying.value = chatPlaying.value + '\n' + texts[231];
            }
            var rem = [];
            Canvas_1.game.getPawns().forEach(function (pawn) {
                if (!msg.tokens.includes(pawn.player)) {
                    rem.push(pawn);
                }
            });
            rem.forEach(function (pawn) {
                Canvas_1.game.removePawn(pawn);
                pawn.tile.removePawn(pawn);
            });
            (0, Canvas_1.reload)(Canvas_1.ctx);
        });
        s.on('move Pawn', function (msg) {
            var pawn = (Canvas_1.game.movePawnById(msg.pawn, msg.value));
            Canvas_1.game.setChoosenTile(undefined);
        });
        s.on('move Pawn back', function (msg) {
            var pawn = (Canvas_1.game.movePawnBack(msg.pawn, msg.value, true));
            Canvas_1.game.setChoosenTile(undefined);
        });
        s.on('return Pawn to place', function (msg) {
            Canvas_1.game.movePawnBack(msg.pawnId, msg.value, false);
        });
        s.on('loadAnswersToOthers', function (msg) {
            (0, Questions_1.showResults)(msg.right, msg.wrong);
        });
        s.on('evaluate End', function (msg) {
            var is = Canvas_1.game.playerEnded(msg.token);
            if (!Canvas_1.game.getCanThrow()) {
                s.emit('evaluated end', { token: msg.token, is: is, room: params.get('id') });
            }
        });
        s.on('is online?', function () {
            s.emit('is online', { id: localStorage.getItem('id') });
        });
        s.on('exit to main menu', function () {
            window.location.replace('/gamelobby');
        });
        s.on('game has ended', function (msg) {
            $('#endModal').modal('show');
        });
        s.on('show Dice value', function (msg) {
            var image = new Image();
            image.src = '../../src/Dice' + msg.value + '.png';
            image.id = 'Dice';
            image.onload = function () {
                var _a;
                (0, Canvas_1.elementDeleter)('dicePlace');
                (_a = document.getElementById('dicePlace')) === null || _a === void 0 ? void 0 : _a.append(image);
            };
        });
        s.on('got texts', function (msg) {
            var _a, _b, _c, _d, _e;
            exports.texts = texts = msg.text;
            if (zoz[zoz.length - 2] === 'editor') {
                (0, Canvas_1.edit)();
                var butt = (0, Elements_1.spawnButton)(document, 'rulesButtons', "questionRuleButton", ["btn", "btn-secondary"], texts[35], function () {
                    $('#rulesModal').modal('hide');
                });
                butt.onclick = function () {
                    Canvas_1.game.setRules(document.getElementById("ruleInput").value);
                };
                exports.isEditor = isEditor = true;
            }
            else {
                Gameplay_1.Gameplay.init();
                if (params.get('id') != null) {
                    document.getElementById('leaveEndRoom').addEventListener('click', function () { window.location.replace('/gamelobby'); });
                    s.emit('set Socket', { id: (0, UtilityFunctions_1.getCookie)('id'), room: params.get('id') });
                    s.emit('load game', { id: (0, UtilityFunctions_1.getCookie)('id'), name: params.get('name'), room: params.get('id') });
                }
                else {
                    s.emit('load game', { id: (0, UtilityFunctions_1.getCookie)('id'), name: params.get('name') });
                }
                (0, Canvas_1.reload)(Canvas_1.ctx);
                (_a = document.getElementById("leaveWaitinRoom")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                    window.location.replace('/gameLobby');
                });
                (_b = document.getElementById('startGameRoom')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
                    Warning_1.Warning.show(texts[186]);
                });
                (_c = document.getElementById("confirmStart")) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
                    s.emit('game has started', { room: params.get('id') });
                });
                (_d = document.getElementById('messageSubmitButton')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
                    s.emit('chat-waitingRoom', { roomId: params.get('id'), id: (0, UtilityFunctions_1.getCookie)('id'), msg: document.getElementById('messagePlace').value });
                    document.getElementById('messagePlace').value = '';
                });
                (_e = document.getElementById('messagePlayingSubmitButton')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
                    s.emit('chat-waitingRoom', { roomId: params.get('id'), id: (0, UtilityFunctions_1.getCookie)('id'), msg: document.getElementById('messagePlayingPlace').value });
                    document.getElementById('messagePlayingPlace').value = '';
                });
            }
        });
        s.on('wrong game name', function () {
            Warning_1.Warning.show(texts[187]);
        });
        s.on('turn', function (msg) {
            $('#pickQuestionModal').modal('hide');
            $('#answerModal').modal('hide');
            $('#WarningModal').modal('hide');
            Canvas_1.game.setHasThrown(false);
            (0, Canvas_1.elementDeleter)('onTurnPlace');
            var p = (0, Elements_1.spawnParagraph)(document, 'onTurnPlace', '', texts[96] + ' ' + msg.player, false);
            p.style.textAlign = 'center';
        });
        s.on('turnMove', function (msg) {
            var _a;
            Canvas_1.game.setIsOnTurn(true);
            Canvas_1.game.setCanThrow(true);
            Canvas_1.game.setHasThrown(false);
            (_a = document.getElementById('Dice')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                if (Canvas_1.game.getCanThrow()) {
                    Gameplay_1.Gameplay.throwDice(msg.token);
                }
            });
        });
        s.on('canMovePawn', function (msg) {
            exports.canMovePawnFunc = canMovePawnFunc = function (event) { (0, TileEditor_1.pickTile)(event, msg.token, msg.value); };
            Canvas_1.canvas.addEventListener('click', canMovePawnFunc);
        });
        s.on('end turn', function () {
            Canvas_1.game.setIsOnTurn(false);
            Canvas_1.game.setCanThrow(false);
            Canvas_1.canvas.removeEventListener('click', canMovePawnFunc);
        });
        s.on('add chat message', function (data) {
            var chat = document.getElementById('chat');
            var chatPlaying = document.getElementById("chatPlaying");
            if (chat.value == '') {
                chat.value = data.name + ':' + data.msg;
            }
            else {
                chat.value = chat.value + '\n' + data.name + ':' + data.msg;
            }
            if (chatPlaying.value == '') {
                chatPlaying.value = data.name + ':' + data.msg;
            }
            else {
                chatPlaying.value = chatPlaying.value + '\n' + data.name + ':' + data.msg;
            }
        });
        s.on('loadedQuestions', function (data) {
            (0, Questions_1.showAllQuestions)(data);
            var newQuestions = new Map();
            data.forEach(function (elem) {
                newQuestions.set(elem.questionId, elem.questionText);
            });
            Canvas_1.game.setQuestions(newQuestions);
        });
        s.on('loadedQuestions - pick', function (data) {
            (0, Questions_1.pickQuestion)(data);
            var newQuestions = new Map();
            data.forEach(function (elem) {
                newQuestions.set(elem.questionId, elem.questionText);
            });
            Canvas_1.game.setQuestions(newQuestions);
        });
        s.on('loadedAnswerQuestions', function (data) {
            (0, Questions_1.askQuestion)(data);
        });
        s.on('canReactToAnswer', function () {
            document.getElementById('answerButtonRoom').removeAttribute('hidden');
            document.getElementById('answerButtonRoom').addEventListener('click', clickFunction);
        });
        s.on('add Opt', function (data) {
            (0, Questions_1.addOption)('editQuestion', data.text, data.isAnswer, data.id);
        });
        s.on('reloaded waiting room', function (msg) {
            Gameplay_1.Gameplay.changeWaitingRoom(msg.names);
        });
        s.on('question is used', function () {
            Warning_1.Warning.show(texts[203]);
        });
        s.on('random and 0', function () {
            Warning_1.Warning.show(texts[204]);
        });
        s.on('player ended', function (msg) {
            s.emit('reload waiting room', { room: params.get('id') });
            Warning_1.Warning.showInGame(msg.player + ' ' + texts[190] + ' ' + msg.place + texts[189]);
            Canvas_1.game.getPawns().forEach(function (pawn) {
                if (pawn.player == msg.token) {
                    pawn.hasEnded = true;
                }
            });
        });
        (_a = document.getElementById("showRulesButton")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            (0, Rules_1.rulesMenu)();
            document.getElementById("ruleInput").value = Canvas_1.game.getRules();
        });
        editorSocket.on('loadedGameNames', function (msg) {
            (0, GameLoader_1.loadGameMenu)(msg.names, msg.authored);
        });
        editorSocket.on('room is full', function () {
            Warning_1.Warning.showInGame(texts[188]);
            setTimeout(function () { window.location.replace('/gameLobby'); }, 1000);
        });
    }
    return ClientSocket;
}());
var clientSocket = new ClientSocket(editorSocket);
