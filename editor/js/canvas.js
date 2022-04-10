"use strict";
var _a, _b, _c, _d, _e, _f;
exports.__esModule = true;
exports.getCookie = exports.resize = exports.editorSocket = exports.reload = exports.editor = exports.calibreEventCoords = exports.ctx = exports.canvas = exports.clear = exports.elementDeleter = exports.doc = exports.mainMenu = void 0;
var Tile_js_1 = require("./Tile.js");
var TileEditor_js_1 = require("./TileEditor.js");
var BackgroundEditor_1 = require("./BackgroundEditor");
var GameEditor_js_1 = require("./GameEditor.js");
var socket_io_client_1 = require("socket.io-client");
var Elements_1 = require("./Elements");
var Background_1 = require("./Background");
var Gameplay_1 = require("./Gameplay");
var PawnEditor_1 = require("./PawnEditor");
var Pawn_1 = require("./Pawn");
var Questions_1 = require("./Questions");
var PawnStyle_1 = require("./PawnStyle");
var Warning_1 = require("./Warning");
var TextLoader_1 = require("./TextLoader");
var editor = new GameEditor_js_1.GameEditor();
exports.editor = editor;
var editorSocket = (0, socket_io_client_1.io)(); //'https://sietove-hry.herokuapp.com/'
exports.editorSocket = editorSocket;
//socket.emit('chat message', 'hi');
var canvas = document.createElement('canvas');
exports.canvas = canvas;
var ctx = canvas.getContext("2d");
exports.ctx = ctx;
editorSocket.on('connected', function (msg) {
    var newIds = new Map();
    var newId = 0;
    msg.tiles.forEach(function (tile) {
        newId++;
        var addedTile = new Tile_js_1.Tile(tile.type, tile.centerX, tile.centerY, tile.x1, tile.x2, tile.y1, tile.y2, tile.radius, tile.color, tile.tileNumber);
        addedTile.setId(newId);
        newIds.set(tile.id, newId);
        addedTile.setStroke(tile.stroke);
        addedTile.setStrokeColor(tile.strokeColor);
        addedTile.setShape(tile.shape);
        addedTile.setIsChoosen(tile.isChoosen);
        if (tile.backgroundFile != 'none') {
            var image_1 = new Image();
            image_1.src = tile.backgroundFile;
            image_1.onload = function () {
                addedTile.setBackgroundFile(image_1);
                reload(editor, ctx);
            };
        }
        if (tile.patternFile != 'none') {
            var image_2 = new Image();
            image_2.src = tile.patternFile;
            image_2.onload = function () {
                addedTile.setPatternFile(image_2);
                reload(editor, ctx);
            };
        }
        //addedTile.setBackgroundFile(tile.backgroundFile)
        //addedTile.setPatternFile(tile.patternFile)
        addedTile.setIsEnding(tile.isEnding);
        addedTile.setIsEndingFor(tile.isEndingFor);
        addedTile.setIsStarting(tile.isStarting);
        addedTile.setIsStartingFor(tile.isStartingFor);
        addedTile.setBelongTo(tile.belongTo);
        addedTile.setCanOccupy(tile.canOccupy);
        addedTile.setToogleNumber(tile.toggleNumber);
        addedTile.setNumberingColor(tile.numberingColor);
        addedTile.setFollowingTileNumber(tile.numberOfFollowingTile);
        addedTile.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile);
        addedTile.setSkip(tile.skip);
        addedTile.setRepeat(tile.repeat);
        addedTile.setForward(tile.forward);
        addedTile.setBackward(tile.backward);
        addedTile.setMustThrown(tile.mustThrown);
        addedTile.setTurnsToSetFree(tile.turnToSetFree);
        editor.getGame().addTile(addedTile);
        reload(editor, ctx);
    });
    editor.setNextTileId(newId + 1);
    var background = new Background_1.Background();
    background.setColor(msg.background.color);
    if (msg.background.image != 'none') {
        var backImage_1 = new Image();
        backImage_1.src = msg.background.image;
        backImage_1.onload = function () {
            background.setBackgroundImage(backImage_1);
            editor.getGame().setBackground(background);
            reload(editor, ctx);
        };
        background.setBackgroundImage(backImage_1);
    }
    editor.getGame().setBackground(background);
    //editor.getGame().setBackground(msg.background)
    editor.getGame().setAuthor(msg.game.author);
    editor.getGame().setName(msg.game.name);
    editor.getGame().setNumOfPlayers(msg.game.numOfPlayers);
    editor.getGame().setRules(msg.rules);
    var tokens = [];
    for (var i_1 = 1; i_1 <= 6; i_1++) {
        tokens.push('Player ' + i_1);
    }
    editor.getGame().setPlayerTokens(tokens);
    (0, Gameplay_1.initGameInfo)(msg.game.name);
    var i = 0;
    msg.pawns.forEach(function (pawn) {
        i++;
        var tile = editor.findTileById(newIds.get(pawn.tileId));
        var p = new Pawn_1.Pawn(pawn.player, tile);
        p.id = pawn.id;
        editor.getGame().getPawns().push(p);
        //tile.getPawns().push(p)
    });
    msg.styles.forEach(function (style) {
        var p = new PawnStyle_1.PawnStyle(style.player, style.color, style.type);
        //p.setImage(image)
        editor.getGame().getPawnStyle().set(style.player, p);
    });
});
editorSocket.on('join Room', function (msg) {
    editorSocket.emit('join player to Room', { id: getCookie('id'), roomId: msg.id });
    if (!msg.started) {
        $('#waitingModal').modal('show');
    }
    reload(editor, ctx);
    editorSocket.on('player joined', function (msg) {
        editorSocket.emit('reload waiting room', { room: params.get('id') });
        var chat = document.getElementById('chat');
        var chatPlaying = document.getElementById("chatPlaying");
        if (chat.value == '') {
            chat.value = msg.msg;
        }
        else {
            chat.value = chat.value + '\n' + msg.msg;
        }
        if (chatPlaying.value == '') {
            chatPlaying.value = msg.msg;
        }
        else {
            chatPlaying.value = chatPlaying.value + '\n' + msg.msg;
        }
        reload(editor, ctx);
    });
});
editorSocket.on('player left', function (msg) {
    editorSocket.emit('reload waiting room', { room: params.get('id') });
    reload(editor, ctx);
});
editorSocket.on('game started', function (msg) {
    // editor.getGame().setHasStarted(true)
    $('#waitingModal').modal('hide');
    var chat = document.getElementById('chat');
    var chatPlaying = document.getElementById("chatPlaying");
    if (chat.value == '') {
        chat.value = msg.msg;
    }
    else {
        chat.value = chat.value + '\n' + msg.msg;
    }
    if (chatPlaying.value == '') {
        chatPlaying.value = msg.msg;
    }
    else {
        chatPlaying.value = chatPlaying.value + '\n' + msg.msg;
    }
});
var params = new URLSearchParams(window.location.search);
//editorSocket.emit('set Socket',{id:getCookie('id'),room:params.get('id')})
editorSocket.on('move Pawn', function (msg) {
    //msg.pawn.move(msg.value)
    var pawn = (editor.getGame().movePawnById(msg.pawn, msg.value));
    editor.setChoosenTile(undefined);
});
editorSocket.on('show Dice value', function (msg) {
    var image = new Image();
    image.src = '../../src/Dice' + msg.value + '.png';
    image.id = 'Dice';
    image.onload = function () {
        var _a;
        elementDeleter('dicePlace');
        (_a = document.getElementById('dicePlace')) === null || _a === void 0 ? void 0 : _a.append(image);
    };
});
var isEditor = false;
var zoz = window.location.href.split('/');
if (zoz[zoz.length - 2] === 'editor') {
    edit();
    var butt = (0, Elements_1.spawnButton)(document, 'rulesButtons', "questionRuleButton", ["btn", "btn-secondary"], "Edit Changes!", function () {
        $('#rulesModal').modal('hide');
    });
    butt.onclick = function () {
        editor.getGame().setRules(document.getElementById("ruleInput").value);
    };
    //document.getElementById('rulesButtons')!
    // <button type="button" class="btn btn-secondary" id="questionRuleButton" onclick="$('#rulesModal').modal('hide');">Edit Changes!</button>
    isEditor = true;
    //editor.getGame().setInitSizeX(window.innerWidth)
    //editor.getGame().setInitSizeY(window.innerHeight)
}
else {
    if (params.get('id') != null) {
        editorSocket.emit('set Socket', { id: getCookie('id'), room: params.get('id') });
        editorSocket.emit('load game', { id: getCookie('id'), name: params.get('name'), room: params.get('id') });
        (0, Gameplay_1.initDice)();
    }
    else {
        editorSocket.emit('load game', { id: getCookie('id'), name: params.get('name') });
    }
    reload(editor, ctx);
    (_a = document.getElementById("leaveWaitinRoom")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        window.location.replace('/gameLobby');
    });
    (_b = document.getElementById('startGameRoom')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        Warning_1.Warning.show('Are you sure to start the Game ? After start no one will be able to join!');
    });
    (_c = document.getElementById("confirmStart")) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
        editorSocket.emit('game has started', { room: params.get('id') });
    });
    (_d = document.getElementById('messageSubmitButton')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
        editorSocket.emit('chat-waitingRoom', { roomId: params.get('id'), id: getCookie('id'), msg: document.getElementById('messagePlace').value });
        document.getElementById('messagePlace').value = '';
    });
    (_e = document.getElementById('messagePlayingSubmitButton')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
        editorSocket.emit('chat-waitingRoom', { roomId: params.get('id'), id: getCookie('id'), msg: document.getElementById('messagePlayingPlace').value });
        document.getElementById('messagePlayingPlace').value = '';
    });
}
editorSocket.on('turn', function (msg) {
    console.log('recieved: turn');
    console.log(editor.getGame().getIsOnturn());
    //canvas.removeEventListener('click',pickTile)
    elementDeleter('onTurnPlace');
    (0, Elements_1.spawnParagraph)(document, 'onTurnPlace', '', "Player on turn: " + msg.player);
});
editorSocket.on('turnMove', function (msg) {
    var _a;
    console.log('recieved: turn move');
    editor.getGame().setIsOnTurn(true);
    (_a = document.getElementById('Dice')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        // if (editor.getChoosenTile()!=undefined && pawn!= undefined){
        // canvas.removeEventListener('click',pickTile)
        (0, Gameplay_1.throwDice)(msg.token);
    }
    //}
    );
});
editorSocket.on('canMovePawn', function (msg) {
    console.log('canMovePawn emitol token:' + msg.token);
    canvas.addEventListener('click', function (event) { (0, TileEditor_js_1.pickTile)(event, msg.token, msg.value); });
});
// editorSocket.on('can throw',()=>{
//   document.getElementById('Dice')?.addEventListener('click',function(){throwDice()})
// })
editorSocket.on('add chat message', function (data) {
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
editorSocket.on('loadedQuestions', function (data) {
    (0, Questions_1.showAllQuestions)(data);
    (0, Questions_1.pickQuestion)(data);
});
//editorSocket.on('pickQuestions',(data)=>{pickQuestion(data)})
editorSocket.on('loadedAnswerQuestions', function (data) { (0, Questions_1.askQuestion)(data); });
editorSocket.on('add Opt', function (data) {
    (0, Questions_1.addOption)('editQuestion', data.text, data.isAnswer, data.id);
});
editorSocket.on('reloaded waiting room', function (msg) {
    (0, Gameplay_1.changeWaitingRoom)(msg.names);
});
(_f = document.getElementById("showRulesButton")) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function () {
    $('#rulesModal').modal('show');
    document.getElementById("ruleInput").value = editor.getGame().getRules();
});
function edit() {
    var _a;
    mainMenu();
    document.getElementById('forwardButton').addEventListener('click', function () {
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', 'How many tiles should pawn go ahead?');
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], 'Confirm!', function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('forward', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('bindEvent').textContent = 'Go forward: ' + nums + ' times.';
        });
    });
    document.getElementById('backwardButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', 'How many tiles should pawn go backwards?');
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], 'Confirm!', function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('backward', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('bindEvent').textContent = 'Go backward: ' + nums + ' times.';
        });
    });
    document.getElementById('skipButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', 'How many turns should player skip?');
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], 'Confirm!', function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('skip', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('bindEvent').textContent = 'Skip: ' + nums + ' times.';
        });
    });
    document.getElementById('repeatButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', 'How many times can player repeat his turn?');
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], 'Confirm!', function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('repeat', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('bindEvent').textContent = 'Repeat turn: ' + nums + ' times.';
        });
    });
    document.getElementById('stopButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', 'How many turns should player skip his turn if value was not thrown');
        var freeInput = (0, Elements_1.spawnNumberInput)(document, 'askTheQuestionEventEdit', 'freeInput');
        freeInput.max = '6';
        freeInput.min = '1';
        freeInput.placeholder = 'Enter the number!';
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', 'Which value can set pawn free');
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], 'Confirm!', function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('stop', { num: parseInt(nums), value: parseInt(freeInput.value) });
            $('#editEventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('bindEvent').textContent = 'Thrown: ' + freeInput.value + ' . Or wait ' + nums + ' turns';
        });
    });
    //$('#rulesModal').modal('show');
    document.getElementById('editBackground').addEventListener('click', function () { (0, BackgroundEditor_1.editBackground)(); });
    document.getElementById('insertTiles').addEventListener('click', function () { (0, TileEditor_js_1.insertTilesMenu)(); });
    document.getElementById('moveTiles').addEventListener('click', function () { (0, TileEditor_js_1.moveTiles)(); });
    document.getElementById('editTiles').addEventListener('click', function () { (0, TileEditor_js_1.editTiles)(); });
    document.getElementById('deleteTiles').addEventListener('click', function () { (0, TileEditor_js_1.deleteTiles)(); });
    document.getElementById('questionManager').addEventListener('click', function () {
        elementDeleter('listContainer');
        editorSocket.emit('loadQuestions');
    });
    // document.getElementById('questionSubmitButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )
    // document.getElementById('questionEditButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )
    //spawnButton(document,'containerAdd','dd',[],'Add Option',addOption)
    document.getElementById('generalInfoButton').addEventListener('click', function () {
        (0, TileEditor_js_1.removeAllButtons)();
        (0, TileEditor_js_1.removeAllListenersAdded)();
        mainMenu();
    });
    document.getElementById('answerButton').addEventListener('click', function () { (0, Questions_1.evaluateQuestion)(); });
    document.getElementById('setAnswerButton').addEventListener('click', function () { editorSocket.emit('answerQuestion', { id: 0 }); });
    document.getElementById('addButtonInsert').addEventListener('click', function () { (0, Questions_1.addOption)('questionOptions', '', false); });
    document.getElementById('addButtonEdit').addEventListener('click', function () { (0, Questions_1.addOption)('editQuestion', '', false); });
    document.getElementById('createQuestionButtonModal').addEventListener('click', function () { (0, Questions_1.initCreation)('questionOptions'); });
    document.getElementById('removeButtonInsert').addEventListener('click', function () { (0, Questions_1.removeLastOption)('questionOptions'); });
    document.getElementById('removeButtonEdit').addEventListener('click', function () { (0, Questions_1.removeLastOption)('editQuestion'); });
    document.getElementById('questionSubmitButton').addEventListener('click', function () { (0, Questions_1.createQuestion)(-1); });
    (_a = document.getElementById('loadCreatedGameModal')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        var val = document.getElementById('gameNameInput').value;
        (0, TileEditor_js_1.removeAllButtons)();
        editorSocket.emit('load game', { id: getCookie('id'), name: val });
        mainMenu();
    });
    document.getElementById('insertPawn').addEventListener('click', function () { (0, PawnEditor_1.pawnInsertMenu)(); });
    document.getElementById('editPawn').addEventListener('click', function () { (0, PawnEditor_1.pawnEditMenu)(); });
    document.getElementById('deletePawn').addEventListener('click', function () { (0, PawnEditor_1.pawnDeleteMenu)(); });
    document.getElementById("resetQuestionID").addEventListener('click', function () {
        editor.setQuestionId(-1);
        document.getElementById('bindQuestion').textContent = 'Not picked!';
    });
}
var doc = document;
exports.doc = doc;
document.getElementById("canvasPlace").appendChild(canvas);
var started = false;
function mainMenu() {
    started = false;
    var numOfPlayersSlider = document.createElement('input');
    numOfPlayersSlider.type = 'range';
    numOfPlayersSlider.id = 'numOfPlayers';
    numOfPlayersSlider.value = editor.getGame().getnumOfPlayers().toString();
    numOfPlayersSlider.min = '1';
    numOfPlayersSlider.max = '6';
    numOfPlayersSlider.step = '1';
    var numShower = document.createElement('paragraph');
    numShower.id = 'numShower';
    numShower.textContent = editor.getGame().getnumOfPlayers().toString();
    var text = document.createElement('p');
    text.textContent = 'Počet hráčov:';
    document.getElementById("numOfPlayersPlace").appendChild(text);
    document.getElementById("numOfPlayersPlace").appendChild(numShower);
    numOfPlayersSlider.onclick = function () {
        document.getElementById("numShower").textContent = numOfPlayersSlider.value;
        editor.getGame().setNumOfPlayers(parseInt(numOfPlayersSlider.value));
        var number = parseInt(numOfPlayersSlider.value);
        var playerTokens = editor.getGame().getPlayerTokens();
        if (number < playerTokens.length) {
            var _loop_1 = function (i) {
                playerTokens.pop();
                editor.getGame().getPawnStyle()["delete"]('Player ' + (playerTokens.length + 1));
                var rem = [];
                editor.getGame().getPawns().forEach(function (pawn) {
                    if (pawn.player == ('Player ' + (playerTokens.length + 1))) {
                        rem.push(pawn);
                    }
                });
                rem.forEach(function (pawn) {
                    editor.getGame().removePawn(pawn);
                    pawn.tile.removePawn(pawn);
                });
            };
            for (var i = 0; i < playerTokens.length - number; i++) {
                _loop_1(i);
            }
        }
        if (number > playerTokens.length) {
            for (var i = 0; i < number - playerTokens.length; i++) {
                playerTokens.push('Player ' + (playerTokens.length + 1));
                editor.getGame().getPawnStyle().set('Player ' + (playerTokens.length), new PawnStyle_1.PawnStyle('Player ' + (playerTokens.length), '#000000', 'type1'));
                //editor.getGame().getPawnStyle().Player
            }
        }
        editor.getGame().setPlayerTokens(playerTokens);
        reload(editor, ctx);
    };
    document.getElementById("numOfPlayersPlace").appendChild(numOfPlayersSlider);
    var gameName = document.createElement('input');
    gameName.id = 'gameName';
    gameName.value = editor.getGame().getName();
    text = document.createElement('p');
    text.textContent = 'Názov hry:';
    document.getElementById("gameNamePlace").appendChild(text);
    gameName.oninput = function () {
        editor.getGame().setName(gameName.value);
    };
    document.getElementById("gameNamePlace").appendChild(gameName);
    var gameType = document.createElement('select');
    gameType.id = 'gameType';
    text = document.createElement('p');
    text.textContent = 'Typ hry:';
    document.getElementById("gameTypePlace").appendChild(text);
    document.getElementById("gameTypePlace").appendChild(gameType);
    (0, Elements_1.spawnParagraph)(document, 'tileEditingPlace', '', 'Set number of pawns per starting tile');
    var slid = (0, Elements_1.spawnSliderWithValueShower)(document, 'tileEditingPlace', 'tileNumberSlider', '0', '4', '1', editor.getGame().getNumberOfStartingPawns().toString());
    slid.onchange = function () {
        var max = parseInt(slid.value);
        if (max > editor.getGame().getNumberOfStartingPawns()) {
            editor.getGame().getPlayerTokens().forEach(function (player) {
                for (var i = 0; i < (max - editor.getGame().getNumberOfStartingPawns()); i++) {
                    editor.getGame().getTiles().forEach(function (tile) {
                        if (tile.getIsStartingFor().includes(player)) {
                            var newPawn = new Pawn_1.Pawn(player, tile);
                            editor.getGame().getPawns().push(newPawn);
                        }
                    });
                }
            });
        }
        else {
            editor.getGame().getPlayerTokens().forEach(function (player) {
                var num = 0;
                var rem = [];
                //EDITOR PRECHADZAT CEZ TILES A NIE CEZ PAWN BOA
                editor.getGame().getTiles().forEach(function (tile) {
                    num = 0;
                    tile.getPawns().forEach(function (pawn) {
                        if (pawn.player == player) {
                            num++;
                            if (num > max) {
                                rem.push(pawn);
                            }
                        }
                        rem.forEach(function (pawn) {
                            editor.getGame().removePawn(pawn);
                            pawn.tile.removePawn(pawn);
                        });
                    });
                });
                //     editor.getGame().getPawns().forEach((pawn:Pawn)=>{
                //       if (pawn.player == player){
                //         num++;
                //         if (num > max){
                //           rem.push(pawn)
                //         }
                //       }
                //     })
                //     rem.forEach((pawn:Pawn)=>{
                //       editor.getGame().removePawn(pawn)
                //       pawn.tile.removePawn(pawn)
                //     })
            });
        }
        editor.getGame().setNumberOfStartingPawns(max);
        reload(editor, ctx);
    };
    (0, Elements_1.spawnButton)(document, 'tileEditingPlace', 'savaGameButton', ["btn", "btn-dark"], 'Save game to database!', function () {
        editor.getGame().saveGame();
        //window.location.replace('/')
    });
}
exports.mainMenu = mainMenu;
var length = 0;
ctx.scale(2, -2);
resize(editor, ctx);
window.addEventListener('resize', function () { resize(editor, ctx); });
// // resize canvas
function resize(editor, context) {
    //endDrawingPath()
    context.canvas.width = window.innerWidth / 3 * 2 - 30;
    context.canvas.height = window.innerHeight;
    if (!isEditor) {
        if (editor.getGame().getInitSizeX() == 0) {
            editor.getGame().setInitSizeX(window.innerWidth / 3 * 2 - 30);
        }
        if (editor.getGame().getInitSizeY() == 0) {
            editor.getGame().setInitSizeY(window.innerHeight);
        }
        editor.getGame().setScaleX((window.innerWidth / 3 * 2 - 30) / editor.getGame().getInitSizeX());
        editor.getGame().setScaleY(window.innerHeight / editor.getGame().getInitSizeY());
    }
    reload(editor, context);
    //if (started) startDrawingPath();
    // }
}
exports.resize = resize;
function reload(editor, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (editor.getGame().getBackground() != undefined) {
        editor.getGame().getBackground().draw();
    }
    var num = 0;
    var size = editor.getGame().getPath().getPath().length;
    while (num < size - 1) {
        var from = editor.getGame().getPath().getPath()[num];
        var to = editor.getGame().getPath().getPath()[num + 1];
        if (from.getEnd()) {
            num++;
            continue;
        }
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#c0392b';
        ctx.moveTo(from.getX(), from.getY()); // from
        ctx.lineTo(to.getX(), to.getY()); // to
        length += Math.sqrt(Math.pow((from.getX() - to.getX()), 2) + Math.pow((from.getY() - to.getY()), 2));
        ctx.stroke(); // draw it!
        num++;
    }
    ctx.closePath();
    var tiles = editor.getGame().getTiles();
    tiles.forEach(function (tile) {
        tile.drawTile(canvas, ctx, false);
        tile.drawPawns(ctx);
    });
    ctx.closePath();
    ctx.restore();
    // let pawns = editor.getGame().getPawns()
    // pawns.forEach((pawn:Pawn) =>{
    //     pawn.draw(ctx)
    // })
}
exports.reload = reload;
function clear() {
    editor.getGame().getPath().setPath([]);
    //sessionStorage.points = null;
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
function getCookie(name) {
    var cookie = new Map();
    document.cookie.split(';').forEach(function (el) {
        var _a = el.split('='), k = _a[0], v = _a[1];
        var key = k.trim();
        cookie.set(key, v);
    });
    return cookie.get(name);
}
exports.getCookie = getCookie;
(0, TextLoader_1.loadTexts)();
window.onload = function () {
    if (params.get('id') != null) {
        editorSocket.emit('reload waiting room', { room: params.get('id') });
    }
};
