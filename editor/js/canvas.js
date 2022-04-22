"use strict";
var _a, _b, _c, _d, _e, _f;
exports.__esModule = true;
exports.texts = exports.clickFunction = exports.canMovePawnFunc = exports.getCookie = exports.resize = exports.editorSocket = exports.reload = exports.editor = exports.calibreEventCoords = exports.ctx = exports.canvas = exports.clear = exports.elementDeleter = exports.doc = exports.mainMenu = void 0;
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
var BackgroundComponent_1 = require("./BackgroundComponent");
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
        addedTile.setQuestionId(tile.questionId);
        var t = tile.nextTilesIds;
        var add = new Map();
        for (var i_1 = 0; i_1 * 2 < t.length; i_1++) {
            add.set(t[2 * i_1], t[2 * i_1 + 1]);
        }
        addedTile.setNextTilesIds(add);
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
    msg.components.forEach(function (component) {
        var newComponent = new BackgroundComponent_1.BackgroundComponent();
        if (component.image != 'none' || component.image != undefined) {
            var image_3 = new Image();
            image_3.src = component.image;
            image_3.onload = function () {
                newComponent.setImage(image_3);
                background.getComponents().push(newComponent);
                reload(editor, ctx);
            };
        }
        newComponent.setType(component.type);
        newComponent.setColor(component.color);
        newComponent.setImage(component.image);
        newComponent.setImageHeight(component.imageHeigth);
        newComponent.setImageWidth(component.imageWidth);
        newComponent.setCenterX(component.centerX);
        newComponent.setCenterY(component.centerY);
        newComponent.setRadius(component.radius);
        newComponent.setStroke(component.stroke);
        newComponent.setStrokeColor(component.strokeColor);
        newComponent.setX1(component.x1);
        newComponent.setY1(component.y1);
        newComponent.setX2(component.x2);
        newComponent.setY2(component.y2);
    });
    editor.getGame().setBackground(background);
    //editor.getGame().setBackground(msg.background)
    editor.getGame().setAuthor(msg.game.author);
    editor.getGame().setName(msg.game.name);
    editor.getGame().setNumOfPlayers(msg.game.numOfPlayers);
    editor.getGame().setRules(msg.rules);
    var gameNextTiles = msg.game.nextTilesIds;
    var add = new Map();
    for (var i_2 = 0; i_2 * 2 < gameNextTiles.length; i_2++) {
        add.set(gameNextTiles[2 * i_2], gameNextTiles[2 * i_2 + 1]);
    }
    editor.getGame().setNextTilesIds(add);
    var tokens = [];
    for (var i_3 = 1; i_3 <= editor.getGame().getnumOfPlayers(); i_3++) {
        tokens.push('Player ' + i_3);
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
    console.log('loaded game:');
    console.log(editor);
});
editorSocket.on('react to event: forward', function (msg) {
    editor.getGame().setIsOnTurn(true);
    var ret = editor.getGame().howManyCanMove(msg.pawnId, msg.value);
    Warning_1.Warning.showInGame('Event occured: Go forward!');
    editorSocket.emit('move pawns', { pawn: msg.pawnId, value: ret, room: params.get('id') });
});
editorSocket.on('react to event: backward', function (msg) {
    console.log('recieved react to event: backward');
    editor.getGame().setIsOnTurn(true);
    var ret = editor.getGame().howManyCanMoveBack(msg.pawnId, msg.value);
    Warning_1.Warning.showInGame('Event occured: Go backward!');
    editorSocket.emit('move pawns back', { pawn: msg.pawnId, value: ret, room: params.get('id') });
});
editorSocket.on('not author', function () {
    Warning_1.Warning.show('You can not create game with this name. Game with this name already exists, and you are not author of it.');
    console.log('not author');
});
editorSocket.on('game saved', function () {
    window.location.replace('/');
});
editorSocket.on('react to event: skip', function (msg) {
    Warning_1.Warning.showInGame('Event occured: Player ' + msg.token + ' ' + 'skipped his turn! Turns left to skip: ' + msg.left);
});
editorSocket.on('react to event:must Thrown', function (msg) {
    Warning_1.Warning.showInGame('Event occured: Player ' + msg.token + ' ' + 'must wait ' + msg.turnsLeft + '! turns or throw ' + msg.value + ' to set pawn free ');
});
editorSocket.on('return pawns to starting tile', function (msg) {
    msg.ids.forEach(function (id) {
        editor.findPawnById(id).returnToStart();
    });
    reload(editor, ctx);
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
    console.log('recieved move Pawn');
    var pawn = (editor.getGame().movePawnById(msg.pawn, msg.value));
    editor.setChoosenTile(undefined);
});
editorSocket.on('move Pawn back', function (msg) {
    //msg.pawn.move(msg.value)
    console.log('recieved move Pawn back');
    var pawn = (editor.movePawnBack(msg.pawn, msg.value, true));
    editor.setChoosenTile(undefined);
});
editorSocket.on('return Pawn to place', function (msg) {
    editor.movePawnBack(msg.pawnId, msg.tileId, false);
});
editorSocket.on('loadAnswersToOthers', function (msg) {
    (0, Questions_1.showResults)(msg.right, msg.wrong);
});
editorSocket.on('evaluate End', function (msg) {
    console.log('emitol evalued end');
    var is = editor.playerEnded(msg.token);
    if (is) {
        console.log('TENTO SKONCIL');
        console.log('player');
    }
    editorSocket.emit('evaluated end', { token: msg.token, is: is, room: params.get('id') });
});
editorSocket.on('game has ended', function (msg) {
    $('#endModal').modal('show');
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
    //
    if (params.get('id') != null) {
        document.getElementById('leaveEndRoom').addEventListener('click', function () { window.location.replace('/gamelobby'); });
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
var canMovePawnFunc;
exports.canMovePawnFunc = canMovePawnFunc;
editorSocket.on('canMovePawn', function (msg) {
    console.log('canMovePawn emitol token:' + msg.token);
    var can = false;
    editor.getGame().getPawns().forEach(function (pawn) {
        if (pawn.player == msg.token) {
            if (pawn.canMove(msg.value)) {
                can = true;
            }
        }
    });
    if (can) {
        exports.canMovePawnFunc = canMovePawnFunc = function (event) { (0, TileEditor_js_1.pickTile)(event, msg.token, msg.value); };
        canvas.addEventListener('click', canMovePawnFunc);
    }
    else {
        Warning_1.Warning.showInGame('You cant move with any of your remaining pawns. You skip your turn');
        editorSocket.emit('evaluated end', { is: false, room: params.get('id') });
    }
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
editorSocket.on('loadedAnswerQuestions', function (data) {
    (0, Questions_1.askQuestion)(data);
});
var clickFunction = function () { (0, Questions_1.evaluateQuestion)(); };
exports.clickFunction = clickFunction;
editorSocket.on('canReactToAnswer', function () {
    document.getElementById('answerButtonRoom').addEventListener('click', clickFunction);
});
editorSocket.on('add Opt', function (data) {
    (0, Questions_1.addOption)('editQuestion', data.text, data.isAnswer, data.id);
});
editorSocket.on('reloaded waiting room', function (msg) {
    (0, Gameplay_1.changeWaitingRoom)(msg.names);
});
editorSocket.on('player ended', function (msg) {
    editorSocket.emit('reload waiting room', { room: params.get('id') });
    Warning_1.Warning.showInGame(msg.player + ' finished on ' + msg.place + ' place.');
    console.log('zapol');
});
(_f = document.getElementById("showRulesButton")) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function () {
    $('#rulesModal').modal('show');
    document.getElementById("ruleInput").value = editor.getGame().getRules();
});
function edit() {
    var _a, _b, _c, _d, _e;
    mainMenu();
    // document.getElementById('nextTileButtonSet')?.addEventListener('click',function(){
    //   updateNextTileIds()
    // })
    document.getElementById('forwardButton').addEventListener('click', function () {
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', 'How many tiles should pawn go ahead?');
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], 'Confirm!', function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('forward', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('bindEvent').textContent = 'Pick event!';
            document.getElementById('pickedEventParagraph').textContent = ' Picked Event: Go forward: ' + nums + ' times.';
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
            document.getElementById('bindEvent').textContent = 'Pick event!';
            document.getElementById('pickedEventParagraph').textContent = ' Picked Event: Go backward: ' + nums + ' times.';
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
            document.getElementById('bindEvent').textContent = 'Pick event!';
            document.getElementById('pickedEventParagraph').textContent = ' Picked Event:' + 'Skip: ' + nums + ' times.';
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
            document.getElementById('bindEvent').textContent = 'Pick event!';
            document.getElementById('pickedEventParagraph').textContent = ' Picked Event:' + 'Repeat turn: ' + nums + ' times.';
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
            document.getElementById('bindEvent').textContent = 'Pick event!';
            document.getElementById('pickedEventParagraph').textContent = ' Picked Event:' + 'Thrown: ' + freeInput.value + ' . Or wait ' + nums + ' turns';
        });
    });
    //$('#rulesModal').modal('show');
    document.getElementById('editBackground').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, BackgroundEditor_1.editBackground)();
    });
    document.getElementById('insertTiles').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, TileEditor_js_1.insertTilesMenu)();
    });
    document.getElementById('moveTiles').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, TileEditor_js_1.moveTiles)();
    });
    document.getElementById('editTiles').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, TileEditor_js_1.editTiles)();
    });
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
    (_a = document.getElementById('addComponent')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { (0, BackgroundEditor_1.addComponentMenu)(); });
    (_b = document.getElementById('editComponent')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { (0, BackgroundEditor_1.editComponentMenu)(); });
    (_c = document.getElementById('moveComponent')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { (0, BackgroundEditor_1.moveComponentMenu)(); });
    (_d = document.getElementById('deleteComponent')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () { (0, BackgroundEditor_1.deleteComponentMenu)(); });
    document.getElementById('setAnswerButton').addEventListener('click', function () { editorSocket.emit('answerQuestion', { id: 0 }); });
    document.getElementById('addButtonInsert').addEventListener('click', function () { (0, Questions_1.addOption)('questionOptions', '', false); });
    document.getElementById('addButtonEdit').addEventListener('click', function () { (0, Questions_1.addOption)('editQuestion', '', false); });
    document.getElementById('createQuestionButtonModal').addEventListener('click', function () { (0, Questions_1.initCreation)('questionOptions'); });
    document.getElementById('removeButtonInsert').addEventListener('click', function () { (0, Questions_1.removeLastOption)('questionOptions'); });
    document.getElementById('removeButtonEdit').addEventListener('click', function () { (0, Questions_1.removeLastOption)('editQuestion'); });
    document.getElementById('questionSubmitButton').addEventListener('click', function () { (0, Questions_1.createQuestion)(-1); });
    (_e = document.getElementById('loadCreatedGameModal')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
        var val = document.getElementById('gameNameInput').value;
        (0, TileEditor_js_1.removeAllButtons)();
        editorSocket.emit('load game', { id: getCookie('id'), name: val });
        mainMenu();
    });
    document.getElementById('editPawn').addEventListener('click', function () { (0, PawnEditor_1.pawnEditMenu)(); });
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
                editor.getGame().getPawnStyle()["delete"]('Player ' + i);
                editor.getGame().getNextTilesIds()["delete"]('Player ' + i);
                var rem = [];
                editor.getGame().getPawns().forEach(function (pawn) {
                    if (pawn.player == ('Player ' + i)) {
                        rem.push(pawn);
                    }
                });
                rem.forEach(function (pawn) {
                    editor.getGame().removePawn(pawn);
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
                    editor.getGame().getNextTilesIds().set('Player ' + i, editor.getGame().getTiles().length + 1);
                    editor.getGame().getPawnStyle().set('Player ' + i, new PawnStyle_1.PawnStyle('Player ' + i, '#000000', 'type1'));
                }
                //editor.getGame().getPawnStyle().Player
            }
        }
        editor.getGame().setPlayerTokens(playerTokens);
        console.log(playerTokens);
        console.log(editor.getGame().getNextTilesIds());
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
            editor.getGame().setInitSizeX(canvas.width);
        }
        if (editor.getGame().getInitSizeY() == 0) {
            editor.getGame().setInitSizeY(canvas.height);
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
window.onload = function () {
    if (params.get('id') != null) {
        editorSocket.emit('reload waiting room', { room: params.get('id') });
    }
    editorSocket.emit('get texts', { language: getCookie('language') });
};
var texts = [];
exports.texts = texts;
editorSocket.on('got texts', function (msg) {
    exports.texts = texts = msg.text;
    console.log(texts);
});
setInterval(function () { resize(editor, ctx); }, 500);
