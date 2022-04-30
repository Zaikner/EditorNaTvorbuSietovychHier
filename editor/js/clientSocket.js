"use strict";
var _a;
exports.__esModule = true;
exports.texts = exports.getCookie = exports.clickFunction = exports.isEditor = exports.canMovePawnFunc = exports.editorSocket = void 0;
var socket_io_client_1 = require("socket.io-client");
var Background_1 = require("./Background");
var BackgroundComponent_1 = require("./BackgroundComponent");
var canvas_1 = require("./canvas");
var Elements_1 = require("./Elements");
var Game_1 = require("./Game");
var gameLoader_1 = require("./gameLoader");
var Gameplay_1 = require("./Gameplay");
var Pawn_1 = require("./Pawn");
var PawnStyle_1 = require("./PawnStyle");
var Questions_1 = require("./Questions");
var Rules_1 = require("./Rules");
var Tile_1 = require("./Tile");
var TileEditor_1 = require("./TileEditor");
var Warning_1 = require("./Warning");
var texts = [];
exports.texts = texts;
var isEditor = false;
exports.isEditor = isEditor;
var params = new URLSearchParams(window.location.search);
var editorSocket = (0, socket_io_client_1.io)(); //'https://sietove-hry.herokuapp.com/'
exports.editorSocket = editorSocket;
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
editorSocket.emit('get texts', { language: getCookie('language') });
editorSocket.on('connected', function (msg) {
    console.log('obdržal:');
    console.log(msg);
    canvas_1.editor.setGame(new Game_1.Game());
    (0, canvas_1.clear)();
    var newIds = new Map();
    var newId = 0;
    msg.tiles.forEach(function (tile) {
        newId++;
        var addedTile = new Tile_1.Tile(tile.type, tile.centerX, tile.centerY, tile.x1, tile.x2, tile.y1, tile.y2, tile.radius, tile.color, tile.tileNumber);
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
                (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
            };
        }
        if (tile.patternFile != 'none') {
            var image_2 = new Image();
            image_2.src = tile.patternFile;
            image_2.onload = function () {
                addedTile.setPatternFile(image_2);
                (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
            };
        }
        //addedTile.setBackgroundFile(tile.backgroundFile)
        //addedTile.setPatternFile(tile.patternFile)
        addedTile.setIsEndingFor(tile.isEndingFor);
        addedTile.setIsStartingFor(tile.isStartingFor);
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
        canvas_1.editor.getGame().addTile(addedTile);
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
    });
    canvas_1.editor.setNextTileId(newId + 1);
    var background = new Background_1.Background();
    background.setColor(msg.background.color);
    if (msg.background.image != 'none') {
        var backImage_1 = new Image();
        backImage_1.src = msg.background.image;
        backImage_1.onload = function () {
            background.setBackgroundImage(backImage_1);
            canvas_1.editor.getGame().setBackground(background);
            (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
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
                (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
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
    canvas_1.editor.getGame().setBackground(background);
    //editor.getGame().setBackground(msg.background)
    canvas_1.editor.getGame().setAuthor(msg.game.author);
    canvas_1.editor.getGame().setName(msg.game.name);
    canvas_1.editor.getGame().setNumOfPlayers(msg.game.numOfPlayers);
    canvas_1.editor.getGame().setRules(msg.rules);
    canvas_1.editor.getGame().setInitSizeX(msg.game.initSizeX);
    canvas_1.editor.getGame().setInitSizeY(msg.game.initSizeY);
    var gameNextTiles = msg.game.nextTilesIds;
    var add = new Map();
    for (var i_2 = 0; i_2 * 2 < gameNextTiles.length; i_2++) {
        add.set(gameNextTiles[2 * i_2], gameNextTiles[2 * i_2 + 1]);
    }
    canvas_1.editor.getGame().setNextTilesIds(add);
    var tokens = [];
    for (var i_3 = 1; i_3 <= canvas_1.editor.getGame().getnumOfPlayers(); i_3++) {
        tokens.push('Player ' + i_3);
    }
    canvas_1.editor.getGame().setPlayerTokens(tokens);
    (0, Gameplay_1.initGameInfo)(msg.game.name);
    var i = 0;
    msg.pawns.forEach(function (pawn) {
        i++;
        var tile = canvas_1.editor.findTileById(newIds.get(pawn.tileId));
        var p = new Pawn_1.Pawn(pawn.player, tile);
        p.id = pawn.id;
        canvas_1.editor.getGame().getPawns().push(p);
        //tile.getPawns().push(p)
    });
    msg.styles.forEach(function (style) {
        var p = new PawnStyle_1.PawnStyle(style.player, style.color, style.type);
        //p.setImage(image)
        canvas_1.editor.getGame().getPawnStyle().set(style.player, p);
    });
    console.log('loaded game:');
    console.log(canvas_1.editor);
});
editorSocket.on('react to event: forward', function (msg) {
    canvas_1.editor.getGame().setIsOnTurn(true);
    var ret = canvas_1.editor.getGame().howManyCanMove(msg.pawnId, msg.value);
    Warning_1.Warning.showInGame('Event occured: Go forward!');
    editorSocket.emit('move pawns', { pawn: msg.pawnId, value: ret, room: params.get('id') });
});
editorSocket.on('react to event: backward', function (msg) {
    console.log('recieved react to event: backward');
    canvas_1.editor.getGame().setIsOnTurn(true);
    var ret = canvas_1.editor.getGame().howManyCanMoveBack(msg.pawnId, msg.value);
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
        canvas_1.editor.findPawnById(id).returnToStart();
    });
    (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
});
editorSocket.on('join Room', function (msg) {
    editorSocket.emit('join player to Room', { id: getCookie('id'), roomId: msg.id });
    if (!msg.started) {
        $('#waitingModal').modal('show');
    }
    (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
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
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
    });
});
editorSocket.on('player left', function (msg) {
    editorSocket.emit('reload waiting room', { room: params.get('id') });
    (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
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
    var rem = [];
    canvas_1.editor.getGame().getPawns().forEach(function (pawn) {
        if (!msg.tokens.includes(pawn.player)) {
            rem.push(pawn);
        }
    });
    console.log('removol');
    console.log(rem);
    rem.forEach(function (pawn) {
        canvas_1.editor.getGame().removePawn(pawn);
        pawn.tile.removePawn(pawn);
    });
    (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
});
//editorSocket.emit('set Socket',{id:getCookie('id'),room:params.get('id')})
editorSocket.on('move Pawn', function (msg) {
    //msg.pawn.move(msg.value)
    console.log('recieved move Pawn');
    var pawn = (canvas_1.editor.getGame().movePawnById(msg.pawn, msg.value));
    canvas_1.editor.setChoosenTile(undefined);
});
editorSocket.on('move Pawn back', function (msg) {
    //msg.pawn.move(msg.value)
    console.log('recieved move Pawn back');
    var pawn = (canvas_1.editor.movePawnBack(msg.pawn, msg.value, true));
    canvas_1.editor.setChoosenTile(undefined);
});
editorSocket.on('return Pawn to place', function (msg) {
    canvas_1.editor.movePawnBack(msg.pawnId, msg.tileId, false);
});
editorSocket.on('loadAnswersToOthers', function (msg) {
    (0, Questions_1.showResults)(msg.right, msg.wrong);
});
editorSocket.on('evaluate End', function (msg) {
    console.log('emitol evalued end');
    var is = canvas_1.editor.playerEnded(msg.token);
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
        (0, canvas_1.elementDeleter)('dicePlace');
        (_a = document.getElementById('dicePlace')) === null || _a === void 0 ? void 0 : _a.append(image);
    };
});
editorSocket.on('got texts', function (msg) {
    var _a, _b, _c, _d, _e;
    var zoz = window.location.href.split('/');
    exports.texts = texts = msg.text;
    console.log(texts);
    if (zoz[zoz.length - 2] === 'editor') {
        (0, canvas_1.edit)();
        var butt = (0, Elements_1.spawnButton)(document, 'rulesButtons', "questionRuleButton", ["btn", "btn-secondary"], texts[35], function () {
            $('#rulesModal').modal('hide');
        });
        butt.onclick = function () {
            canvas_1.editor.getGame().setRules(document.getElementById("ruleInput").value);
        };
        //document.getElementById('rulesButtons')!
        // <button type="button" class="btn btn-secondary" id="questionRuleButton" onclick="$('#rulesModal').modal('hide');">Edit Changes!</button>
        exports.isEditor = isEditor = true;
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
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
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
});
editorSocket.on('wrong game name', function () {
    Warning_1.Warning.show('Game with this name does not exist');
});
editorSocket.on('turn', function (msg) {
    console.log('recieved: turn');
    console.log(canvas_1.editor.getGame().getIsOnturn());
    //canvas.removeEventListener('click',pickTile)
    (0, canvas_1.elementDeleter)('onTurnPlace');
    (0, Elements_1.spawnParagraph)(document, 'onTurnPlace', '', texts[96] + msg.player, true);
});
editorSocket.on('turnMove', function (msg) {
    var _a;
    console.log('recieved: turn move');
    canvas_1.editor.getGame().setIsOnTurn(true);
    canvas_1.editor.getGame().setCanThrow(true);
    (_a = document.getElementById('Dice')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        // if (editor.getChoosenTile()!=undefined && pawn!= undefined){
        // canvas.removeEventListener('click',pickTile)
        if (canvas_1.editor.getGame().getCanThrow()) {
            (0, Gameplay_1.throwDice)(msg.token);
        }
    }
    //}
    );
});
var canMovePawnFunc;
exports.canMovePawnFunc = canMovePawnFunc;
editorSocket.on('canMovePawn', function (msg) {
    console.log('canMovePawn emitol token:' + msg.token);
    var can = false;
    canvas_1.editor.getGame().getPawns().forEach(function (pawn) {
        if (pawn.player == msg.token) {
            if (pawn.canMove(msg.value)) {
                can = true;
            }
        }
    });
    if (can) {
        exports.canMovePawnFunc = canMovePawnFunc = function (event) { (0, TileEditor_1.pickTile)(event, msg.token, msg.value); };
        canvas_1.canvas.addEventListener('click', canMovePawnFunc);
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
    //pickQuestion(data)
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
    canvas_1.editor.getGame().getPawns().forEach(function (pawn) {
        if (pawn.player == msg.token) {
            pawn.hasEnded = true;
        }
    });
});
(_a = document.getElementById("showRulesButton")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    //$('#rulesModal').modal('show');
    (0, Rules_1.rulesMenu)();
    document.getElementById("ruleInput").value = canvas_1.editor.getGame().getRules();
});
editorSocket.on('loadedGameNames', function (msg) {
    console.log('socket odchytil loadedGameNames');
    (0, gameLoader_1.loadGameMenu)(msg.names);
});
editorSocket.on('room is full', function () {
    Warning_1.Warning.showInGame('This game room is full, you become spectator');
});
