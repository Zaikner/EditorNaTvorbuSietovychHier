"use strict";
exports.__esModule = true;
exports.resize = exports.reload = exports.editor = exports.calibreEventCoords = exports.ctx = exports.canvas = exports.clear = exports.edit = exports.elementDeleter = exports.doc = exports.mainMenu = void 0;
var TileEditor_js_1 = require("./TileEditor.js");
var BackgroundEditor_1 = require("./BackgroundEditor");
var GameEditor_js_1 = require("./GameEditor.js");
var Elements_1 = require("./Elements");
var PawnEditor_1 = require("./PawnEditor");
var Pawn_1 = require("./Pawn");
var Questions_1 = require("./Questions");
var PawnStyle_1 = require("./PawnStyle");
var clientSocket_1 = require("./clientSocket");
var Warning_1 = require("./Warning");
var editor = new GameEditor_js_1.GameEditor();
exports.editor = editor;
var params = new URLSearchParams(window.location.search);
//socket.emit('chat message', 'hi');
var canvas = document.createElement('canvas');
exports.canvas = canvas;
var ctx = canvas.getContext("2d");
exports.ctx = ctx;
function edit() {
    var _a, _b, _c, _d;
    mainMenu();
    // document.getElementById('nextTileButtonSet')?.addEventListener('click',function(){
    //   updateNextTileIds()
    // })
    (_a = document.getElementById('randomQuestionID')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        if (Array.from(editor.getGame().getQuestions().entries()).length > 0) {
            editor.setEvents('random', { num: 0, value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            document.getElementById('pickedEventParagraph').textContent = clientSocket_1.texts[201];
            (0, TileEditor_js_1.update)();
        }
        else {
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            Warning_1.Warning.show(clientSocket_1.texts[202]);
        }
    });
    document.getElementById('noneButton').addEventListener('click', function () {
        editor.setEvents('none', { num: 0, value: 0 });
        $('#editEventModal').modal('hide');
        $('#EventModal').modal('hide');
        elementDeleter('askTheQuestionEventEdit');
        document.getElementById('pickedEventParagraph').textContent = clientSocket_1.texts[197];
        (0, TileEditor_js_1.update)();
    });
    document.getElementById('forwardButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', clientSocket_1.texts[97], true);
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], clientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('forward', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            //document.getElementById('bindEvent')!.textContent = texts[98]
            document.getElementById('pickedEventParagraph').textContent = clientSocket_1.texts[99] + ' ' + nums + ' ' + clientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('backwardButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', clientSocket_1.texts[102], true);
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], clientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('backward', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            //document.getElementById('bindEvent')!.textContent = texts[98]
            document.getElementById('pickedEventParagraph').textContent = clientSocket_1.texts[103] + ' ' + nums + ' ' + clientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('skipButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', clientSocket_1.texts[104], true);
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], clientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('skip', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            //document.getElementById('bindEvent')!.textContent = texts[98]
            document.getElementById('pickedEventParagraph').textContent = clientSocket_1.texts[105] + ' ' + nums + ' ' + clientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('repeatButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', clientSocket_1.texts[106], true);
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], clientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('repeat', { num: parseInt(nums), value: 0 });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            //document.getElementById('bindEvent')!.textContent = texts[98]
            document.getElementById('pickedEventParagraph').textContent = clientSocket_1.texts[107] + ' ' + nums + ' ' + clientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    document.getElementById('stopButton').addEventListener('click', function () {
        elementDeleter('askTheQuestionEventEdit');
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', clientSocket_1.texts[108], true);
        var freeInput = (0, Elements_1.spawnNumberInput)(document, 'askTheQuestionEventEdit', 'freeInput');
        freeInput.max = '6';
        freeInput.min = '1';
        freeInput.placeholder = clientSocket_1.texts[55];
        (0, Elements_1.spawnParagraph)(document, 'askTheQuestionEventEdit', '', clientSocket_1.texts[109], true);
        (0, Elements_1.spawnButton)(document, 'askTheQuestionEventEdit', '', ['btn', 'btn-secondary'], clientSocket_1.texts[101], function () {
            var nums = document.getElementById('howManytimes').value;
            editor.setEvents('stop', { num: parseInt(nums), value: parseInt(freeInput.value) });
            $('#editEventModal').modal('hide');
            $('#EventModal').modal('hide');
            elementDeleter('askTheQuestionEventEdit');
            //document.getElementById('bindEvent')!.textContent = texts[98]
            document.getElementById('pickedEventParagraph').textContent = clientSocket_1.texts[110] + freeInput.value + clientSocket_1.texts[111] + nums + clientSocket_1.texts[100];
            (0, TileEditor_js_1.update)();
        });
    });
    //$('#rulesModal').modal('show');
    document.getElementById('editBackground').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, BackgroundEditor_1.editBackground)();
    });
    document.getElementById('insertTiles').addEventListener('click', function () {
        (0, TileEditor_js_1.unchooseEverything)();
        (0, TileEditor_js_1.startInsertingByOne)();
    });
    // document.getElementById('moveTiles')!.addEventListener('click',function(){
    //   unchooseEverything()
    //   moveTiles();} );
    // document.getElementById('editTiles')!.addEventListener('click',function(){
    //   unchooseEverything()
    //   editTiles();} );
    // document.getElementById('deleteTiles')!.addEventListener('click',function(){deleteTiles();} );
    document.getElementById('questionManager').addEventListener('click', function () {
        elementDeleter('listContainer');
        clientSocket_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: false });
    });
    // document.getElementById('questionSubmitButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )
    // document.getElementById('questionEditButton')!.addEventListener('mousedown',function(){editorSocket.emit('loadQuestions');} )
    //spawnButton(document,'containerAdd','dd',[],'Add Option',addOption)
    document.getElementById('generalInfoButton').addEventListener('click', function () {
        (0, TileEditor_js_1.removeAllButtons)();
        (0, TileEditor_js_1.removeAllListenersAdded)();
        mainMenu();
    });
    // document.getElementById('addComponent')?.addEventListener('click',function(){addComponentMenu()})
    // document.getElementById('editComponent')?.addEventListener('click',function(){editComponentMenu()})
    // document.getElementById('moveComponent')?.addEventListener('click',function(){moveComponentMenu()})
    // document.getElementById('deleteComponent')?.addEventListener('click',function(){deleteComponentMenu()})
    //document.getElementById('setAnswerButton')!.addEventListener('click',function(){editorSocket.emit('answerQuestion',{id:0})})
    document.getElementById('addButtonInsert').addEventListener('click', function () { (0, Questions_1.addOption)('questionOptions', '', false); });
    document.getElementById('addButtonEdit').addEventListener('click', function () { (0, Questions_1.addOption)('editQuestion', '', false); });
    document.getElementById('createQuestionButtonModal').addEventListener('click', function () {
        (0, Questions_1.initCreation)();
    });
    //document.getElementById('removeButtonInsert')!.addEventListener('click',function(){removeLastOption('questionOptions');})
    //document.getElementById('removeButtonEdit')!.addEventListener('click',function(){removeLastOption('editQuestion');})
    (_b = document.getElementById('nextTileButtonSet')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        var _a;
        editor.getGame().getPlayerTokens().forEach(function (token) {
            var input = document.getElementById('nextTile' + token).value;
            // if (editor.getChoosenTile()!=undefined){
            editor.getGame().getNextTilesIds().set(token, parseInt(input));
        });
        if (editor.getChoosenTile() != undefined) {
            (_a = editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setNextTilesIds((0, TileEditor_js_1.copyNextTileMap)());
        }
    });
    document.getElementById('questionSubmitButton').addEventListener('click', function () { (0, Questions_1.createQuestion)(-1); });
    document.getElementById('eventQuestionButton').addEventListener('click', function () {
        clientSocket_1.editorSocket.emit('loadQuestions', { id: localStorage.getItem('id'), pick: true });
        $('#pickQuestionModal').modal('show');
    });
    (_c = document.getElementById('loadCreatedGameModal')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
        var val = document.getElementById('gameNameInput').value;
        (0, TileEditor_js_1.removeAllButtons)();
        clientSocket_1.editorSocket.emit('load game', { id: (0, clientSocket_1.getCookie)('id'), name: val, response: true });
        mainMenu();
    });
    (_d = document.getElementById('loadGameButton')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
        clientSocket_1.editorSocket.emit('loadGameNames');
    });
    document.getElementById('editPawn').addEventListener('click', function () { (0, PawnEditor_1.pawnEditMenu)(); });
    // document.getElementById("resetQuestionID")!.addEventListener('click',function(){
    //   editor.setQuestionId(-1);
    //   (<HTMLButtonElement>document.getElementById('bindQuestion'))!.textContent = texts[114]
    // })
}
exports.edit = edit;
var doc = document;
exports.doc = doc;
document.getElementById("canvasPlace").appendChild(canvas);
var started = false;
function mainMenu() {
    started = false;
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', clientSocket_1.texts[21]);
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
    text.textContent = clientSocket_1.texts[22];
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
        //spawnParagraph(doc,"tileEditingPlace",'',texts[137],true)
        //spawnCheckerWithValueShower(doc,"tileEditingPlace",'toogleNumberingChecker',false,[texts[92],texts[93]])
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
    text.textContent = clientSocket_1.texts[23];
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
    //spawnParagraph(document,'tileEditingPlace','',texts[112],true)
    var slid = (0, Elements_1.spawnSliderWithValueShower)(document, 'tileEditingPlace', 'tileNumberSlider', clientSocket_1.texts[112], '1', '4', '1', editor.getGame().getNumberOfStartingPawns().toString());
    slid.style.width = '100%';
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
    var numbering = (0, Elements_1.spawnCheckerWithLabel)(doc, 'tileEditingPlace', 'toogleNumberingChecker', clientSocket_1.texts[137], editor.getGame().getToogleNumber(), [clientSocket_1.texts[92], clientSocket_1.texts[93]]);
    numbering.onchange = function () {
        if (numbering.checked) {
            editor.getGame().setToogleNumber(true);
        }
        else {
            editor.getGame().setToogleNumber(false);
        }
    };
    (0, Elements_1.spawnButton)(document, 'tileEditingPlace', 'savaGameButton', ["btn", "btn-dark"], clientSocket_1.texts[113], function () {
        // if (editor.checkIfAllPlayersHaveFinishTile().length > 0){
        //   Warning.show(texts[183])
        // }
        // else if (editor.checkIfAllPlayersHaveStartingTile().length >0){
        //   Warning.show(texts[184])
        // }
        // else{
        editor.getGame().saveGame();
        //}
        //window.location.replace('/')
    });
    (0, Elements_1.spawnButton)(document, 'tileEditingPlace', '', ['btn', 'btn-dark'], clientSocket_1.texts[181], function () {
        // if (editor.checkIfAllPlayersHaveFinishTile().length > 0){
        //   Warning.show(texts[183])
        // }
        // else if (editor.checkIfAllPlayersHaveStartingTile().length >0){
        //   Warning.show(texts[184])
        // }
        // else{
        //   editor.getGame().setIsPublished(true)
        //   editor.getGame().saveGame()
        // }
        editor.getGame().setIsPublished(true);
        editor.getGame().saveGame();
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
    //console.log('initSizeX:'+editor.getGame().getInitSizeX() )
    //console.log('initSizeY:'+editor.getGame().getInitSizeY() )
    context.canvas.width = window.innerWidth / 3 * 2 - 30;
    context.canvas.height = window.innerHeight;
    if (!clientSocket_1.isEditor) {
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
    //console.log({x:event.offsetX*editor.getGame().getScaleX(),y:event.offsetY*editor.getGame().getScaleY()})
    //console.log({x:event.offsetX,y:event.offsetY})
    return { x: event.offsetX, y: event.offsetY };
}
exports.calibreEventCoords = calibreEventCoords;
window.onload = function () {
    if (params.get('id') != null) {
        clientSocket_1.editorSocket.emit('reload waiting room', { room: params.get('id') });
    }
};
setInterval(function () { resize(editor, ctx); }, 500);
