"use strict";
var _a;
exports.__esModule = true;
exports.texts = exports.getCookie = exports.clickFunction = exports.isEditor = exports.canMovePawnFunc = exports.editorSocket = void 0;
var socket_io_client_1 = require("socket.io-client");
var Background_1 = require("./Background");
var canvas_1 = require("./canvas");
var Elements_1 = require("./Elements");
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
setInterval(function () { editorSocket.emit('ping', { id: localStorage.getItem('id') }); }, 5000);
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
    (0, canvas_1.initNewGame)();
    (0, canvas_1.clear)();
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
        if (tile.backgroundFile != 'none') {
            var image_1 = new Image();
            image_1.src = tile.backgroundFile;
            image_1.onload = function () {
                addedTile.setImage(image_1);
                (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
            };
        }
        //addedTile.setBackgroundFile(tile.backgroundFile)
        //addedTile.setPatternFile(tile.patternFile)
        addedTile.setIsEndingFor(tile.isEndingFor);
        addedTile.setIsStartingFor(tile.isStartingFor);
        addedTile.setCantBeEliminatedOnTile(tile.cantBeEliminatedOnTile);
        addedTile.setSkip(tile.skip);
        addedTile.setRepeat(tile.repeat);
        addedTile.setForward(tile.forward);
        addedTile.setBackward(tile.backward);
        addedTile.setMustThrown(tile.mustThrown);
        addedTile.setTurnsToSetFree(tile.turnToSetFree);
        addedTile.setQuestionId(tile.questionId);
        addedTile.setRandomQuestion(tile.randomQuestion);
        var t = tile.nextTilesIds;
        var add = new Map();
        for (var i_1 = 0; i_1 * 2 < t.length; i_1++) {
            add.set(t[2 * i_1], t[2 * i_1 + 1]);
        }
        addedTile.setNextTilesIds(add);
        canvas_1.game.addTile(addedTile);
        // let num = msg.game.numOfPawnsPerTile
        // tile.isStartingFor.forEach((token:string)=>{
        //   for(let i = 0; i < num;i++){
        //     let p = new Pawn(token,addedTile)
        //     game.getPawns().push(p)
        //     //addedTile.getPawns().push(p)
        //   }
        // })
        (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
    });
    canvas_1.game.setNextTileId(newId + 1);
    var background = new Background_1.Background();
    background.setColor(msg.background.color);
    if (msg.background.image != 'none') {
        var backImage_1 = new Image();
        backImage_1.src = msg.background.image;
        backImage_1.onload = function () {
            background.setBackgroundImage(backImage_1);
            canvas_1.game.setBackground(background);
            (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
        };
        background.setBackgroundImage(backImage_1);
    }
    // msg.components.forEach((component:any)=>{
    //   let newComponent = new BackgroundComponent()
    //   if(component.image != 'none' || component.image != undefined){
    //     let image = new Image()
    //     image.src = component.image
    //     image.onload = function(){
    //      newComponent.setImage(image)
    //      background.getComponents().push(newComponent)
    //      reload(game,ctx)
    //     }
    //    }
    //   newComponent.setType(component.type)
    //   newComponent.setColor(component.color)
    //   newComponent.setImage(component.image)
    //   newComponent.setImageHeight(component.imageHeigth)
    //   newComponent.setImageWidth(component.imageWidth)
    //   newComponent.setCenterX(component.centerX)
    //   newComponent.setCenterY(component.centerY)
    //   newComponent.setRadius(component.radius)
    //   newComponent.setStroke(component.stroke)
    //   newComponent.setStrokeColor(component.strokeColor)
    //   newComponent.setX1(component.x1)
    //   newComponent.setY1(component.y1)
    //   newComponent.setX2(component.x2)
    //   newComponent.setY2(component.y2)
    // })
    canvas_1.game.setBackground(background);
    //game.setBackground(msg.background)
    canvas_1.game.setAuthor(msg.author);
    canvas_1.game.setName(msg.game.name);
    canvas_1.game.setNumOfPlayers(msg.game.numOfPlayers);
    canvas_1.game.setNumberOfStartingPawns(msg.game.numOfPawnsPerTile);
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
    canvas_1.game.setRules(msg.rules);
    canvas_1.game.setInitSizeX(msg.game.initSizeX);
    canvas_1.game.setInitSizeY(msg.game.initSizeY);
    canvas_1.game.setIsPublished(msg.game.isPublished);
    canvas_1.game.setToogleNumber(msg.game.toogleNumber);
    canvas_1.game.setId(msg.game.id);
    var gameNextTiles = msg.game.nextTilesIds;
    var add = new Map();
    for (var i_2 = 0; i_2 * 2 < gameNextTiles.length; i_2++) {
        add.set(gameNextTiles[2 * i_2], gameNextTiles[2 * i_2 + 1]);
    }
    canvas_1.game.setNextTilesIds(add);
    var tokens = [];
    for (var i_3 = 1; i_3 <= canvas_1.game.getnumOfPlayers(); i_3++) {
        tokens.push('Player ' + i_3);
    }
    canvas_1.game.setPlayerTokens(tokens);
    Gameplay_1.Gameplay.initGameInfo(msg.game.name);
    var i = 0;
    msg.pawns.forEach(function (pawn) {
        i++;
        var tile = canvas_1.game.findTileById(newIds.get(pawn.tileId));
        var p = new Pawn_1.Pawn(pawn.token, tile);
        p.id = pawn.id;
        canvas_1.game.getPawns().push(p);
        //tile.getPawns().push(p)
    });
    msg.styles.forEach(function (style) {
        var p = new PawnStyle_1.PawnStyle(style.player, style.color, style.type);
        if (style.image != 'none') {
            p.setImage(style.image);
            var backImage_2 = new Image();
            backImage_2.src = style.image;
            backImage_2.onload = function () {
                p.setImage(backImage_2);
                //game.setBackground(background)
                canvas_1.game.getPawnStyle().set(style.player, p);
                (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
            };
        }
        else {
            canvas_1.game.getPawnStyle().set(style.player, p);
        }
    });
    console.log('loaded game:');
    console.log(canvas_1.game);
    var gm = document.getElementById('gameName');
    if (gm != undefined) {
        gm.value = canvas_1.game.getName();
    }
});
editorSocket.on('react to event: forward', function (msg) {
    canvas_1.game.setIsOnTurn(true);
    var ret = canvas_1.game.howManyCanMove(msg.pawnId, msg.value);
    Warning_1.Warning.showInGame('Event occured: Go forward!');
    editorSocket.emit('move pawns', { pawn: msg.pawnId, value: ret, room: params.get('id') });
});
editorSocket.on('react to event: backward', function (msg) {
    canvas_1.game.setIsOnTurn(true);
    var ret = canvas_1.game.howManyCanMoveBack(msg.pawnId, msg.value);
    Warning_1.Warning.showInGame('Event occured: Go backward!');
    editorSocket.emit('move pawns back', { pawn: msg.pawnId, value: ret, room: params.get('id') });
});
editorSocket.on('not author', function () {
    Warning_1.Warning.show(texts[185]);
});
editorSocket.on('game saved', function (msg) {
    canvas_1.game.setId(msg.newId);
});
editorSocket.on('react to event: skip', function (msg) {
    Warning_1.Warning.showInGame('Event occured: Player ' + msg.token + ' ' + 'skipped his turn! Turns left to skip: ' + msg.left);
});
editorSocket.on('react to event:must Thrown', function (msg) {
    Warning_1.Warning.showInGame('Event occured: Player ' + msg.token + ' ' + 'must wait ' + msg.turnsLeft + '! turns or throw ' + msg.value + ' to set pawn free ');
});
editorSocket.on('return pawns to starting tile', function (msg) {
    msg.ids.forEach(function (id) {
        canvas_1.game.findPawnById(id).returnToStart();
    });
    (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
});
editorSocket.on('join Room', function (msg) {
    editorSocket.emit('join player to Room', { id: getCookie('id'), roomId: msg.id });
    if (!msg.started) {
        $('#waitingModal').modal('show');
    }
    (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
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
        (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
    });
});
editorSocket.on('player left', function (msg) {
    console.log(msg.msg);
    console.log(msg);
    var rem = [];
    canvas_1.game.getPawns().forEach(function (pawn) {
        if (pawn.player == msg.token) {
            rem.push(pawn);
            console.log('odstranil:');
            console.log(pawn);
        }
    });
    rem.forEach(function (pawn) {
        canvas_1.game.removePawn(pawn);
        pawn.tile.removePawn(pawn);
    });
    (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
    var chat = document.getElementById('chat');
    var chatPlaying = document.getElementById("chatPlaying");
    if (chat.value == '') {
        chat.value = 'Player ' + msg.msg + ' has left the room.';
    }
    else {
        chat.value = chat.value + '\n' + 'Player ' + msg.msg + ' has left the room.';
    }
    if (chatPlaying.value == '') {
        chatPlaying.value = 'Player ' + msg.msg + ' has left the room.';
    }
    else {
        chatPlaying.value = chatPlaying.value + '\n' + 'Player ' + msg.msg + ' has left the room.';
    }
    editorSocket.emit('reload waiting room', { room: params.get('id') });
    (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
});
editorSocket.on('game started', function (msg) {
    // game.setHasStarted(true)
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
    canvas_1.game.getPawns().forEach(function (pawn) {
        if (!msg.tokens.includes(pawn.player)) {
            rem.push(pawn);
        }
    });
    rem.forEach(function (pawn) {
        canvas_1.game.removePawn(pawn);
        pawn.tile.removePawn(pawn);
    });
    (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
});
//editorSocket.emit('set Socket',{id:getCookie('id'),room:params.get('id')})
editorSocket.on('move Pawn', function (msg) {
    //msg.pawn.move(msg.value)
    var pawn = (canvas_1.game.movePawnById(msg.pawn, msg.value));
    canvas_1.game.setChoosenTile(undefined);
});
editorSocket.on('move Pawn back', function (msg) {
    var pawn = (canvas_1.game.movePawnBack(msg.pawn, msg.value, true));
    canvas_1.game.setChoosenTile(undefined);
});
editorSocket.on('return Pawn to place', function (msg) {
    canvas_1.game.movePawnBack(msg.pawnId, msg.value, false);
});
editorSocket.on('loadAnswersToOthers', function (msg) {
    (0, Questions_1.showResults)(msg.right, msg.wrong);
});
editorSocket.on('evaluate End', function (msg) {
    var is = canvas_1.game.playerEnded(msg.token);
    editorSocket.emit('evaluated end', { token: msg.token, is: is, room: params.get('id') });
});
editorSocket.on('is online?', function () {
    editorSocket.emit('is online', { id: localStorage.getItem('id') });
});
editorSocket.on('exit to main menu', function () {
    window.location.replace('/gamelobby');
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
    if (zoz[zoz.length - 2] === 'editor') {
        (0, canvas_1.edit)();
        var butt = (0, Elements_1.spawnButton)(document, 'rulesButtons', "questionRuleButton", ["btn", "btn-secondary"], texts[35], function () {
            $('#rulesModal').modal('hide');
        });
        butt.onclick = function () {
            canvas_1.game.setRules(document.getElementById("ruleInput").value);
        };
        //document.getElementById('rulesButtons')!
        // <button type="button" class="btn btn-secondary" id="questionRuleButton" onclick="$('#rulesModal').modal('hide');">Edit Changes!</button>
        exports.isEditor = isEditor = true;
        //game.setInitSizeX(window.innerWidth)
        //game.setInitSizeY(window.innerHeight)
    }
    else {
        //
        Gameplay_1.Gameplay.init();
        if (params.get('id') != null) {
            document.getElementById('leaveEndRoom').addEventListener('click', function () { window.location.replace('/gamelobby'); });
            editorSocket.emit('set Socket', { id: getCookie('id'), room: params.get('id') });
            editorSocket.emit('load game', { id: getCookie('id'), name: params.get('name'), room: params.get('id') });
            Gameplay_1.Gameplay.initDice();
        }
        else {
            editorSocket.emit('load game', { id: getCookie('id'), name: params.get('name') });
        }
        (0, canvas_1.reload)(canvas_1.game, canvas_1.ctx);
        (_a = document.getElementById("leaveWaitinRoom")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            window.location.replace('/gameLobby');
        });
        (_b = document.getElementById('startGameRoom')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
            Warning_1.Warning.show(texts[186]);
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
    Warning_1.Warning.show(texts[187]);
});
editorSocket.on('turn', function (msg) {
    console.log('recieved: turn');
    console.log(canvas_1.game.getIsOnturn());
    //canvas.removeEventListener('click',pickTile)
    (0, canvas_1.elementDeleter)('onTurnPlace');
    (0, Elements_1.spawnParagraph)(document, 'onTurnPlace', '', texts[96] + msg.player, true);
});
editorSocket.on('turnMove', function (msg) {
    var _a;
    console.log('recieved: turn move');
    canvas_1.game.setIsOnTurn(true);
    canvas_1.game.setCanThrow(true);
    (_a = document.getElementById('Dice')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        // if (game.getChoosenTile()!=undefined && pawn!= undefined){
        // canvas.removeEventListener('click',pickTile)
        if (canvas_1.game.getCanThrow()) {
            Gameplay_1.Gameplay.throwDice(msg.token);
        }
    }
    //}
    );
});
var canMovePawnFunc;
exports.canMovePawnFunc = canMovePawnFunc;
editorSocket.on('canMovePawn', function (msg) {
    var can = false;
    canvas_1.game.getPawns().forEach(function (pawn) {
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
editorSocket.on('end turn', function () {
    canvas_1.game.setIsOnTurn(false);
    canvas_1.game.setCanThrow(false);
    canvas_1.canvas.removeEventListener('click', canMovePawnFunc);
    console.log('recived end turn');
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
    var newQuestions = new Map();
    data.forEach(function (elem) {
        newQuestions.set(elem.questionId, elem.questionText);
        //elem.questionId
    });
    canvas_1.game.setQuestions(newQuestions);
    //pickQuestion(data)
});
editorSocket.on('loadedQuestions - pick', function (data) {
    (0, Questions_1.pickQuestion)(data);
    var newQuestions = new Map();
    data.forEach(function (elem) {
        newQuestions.set(elem.questionId, elem.questionText);
        //elem.questionId
    });
    canvas_1.game.setQuestions(newQuestions);
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
    Gameplay_1.Gameplay.changeWaitingRoom(msg.names);
});
editorSocket.on('question is used', function () {
    Warning_1.Warning.show(texts[203]);
});
editorSocket.on('random and 0', function () {
    Warning_1.Warning.show(texts[204]);
});
editorSocket.on('player ended', function (msg) {
    editorSocket.emit('reload waiting room', { room: params.get('id') });
    Warning_1.Warning.showInGame(msg.player + texts[190] + msg.place + texts[189]);
    canvas_1.game.getPawns().forEach(function (pawn) {
        if (pawn.player == msg.token) {
            pawn.hasEnded = true;
        }
    });
});
(_a = document.getElementById("showRulesButton")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    //$('#rulesModal').modal('show');
    (0, Rules_1.rulesMenu)();
    document.getElementById("ruleInput").value = canvas_1.game.getRules();
});
editorSocket.on('loadedGameNames', function (msg) {
    (0, gameLoader_1.loadGameMenu)(msg.names);
});
editorSocket.on('room is full', function () {
    Warning_1.Warning.showInGame(texts[188]);
    setTimeout(function () { window.location.replace('/gameLobby'); }, 1000);
});
