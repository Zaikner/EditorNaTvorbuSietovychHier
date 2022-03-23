"use strict";
exports.__esModule = true;
exports.resize = exports.editorSocket = exports.reload = exports.editor = exports.calibreEventCoords = exports.ctx = exports.canvas = exports.clear = exports.elementDeleter = exports.doc = exports.mainMenu = void 0;
var Tile_js_1 = require("./Tile.js");
var TileEditor_js_1 = require("./TileEditor.js");
var BackgroundEditor_1 = require("./BackgroundEditor");
var GameEditor_js_1 = require("./GameEditor.js");
var socket_io_client_1 = require("socket.io-client");
var Elements_1 = require("./Elements");
var Background_1 = require("./Background");
var Gameplay_1 = require("./Gameplay");
var PawnEditor_1 = require("./PawnEditor");
var Questions_1 = require("./Questions");
var PawnStyle_1 = require("./PawnStyle");
var editor = new GameEditor_js_1.GameEditor();
exports.editor = editor;
var editorSocket = (0, socket_io_client_1.io)(); //'https://sietove-hry.herokuapp.com/'
exports.editorSocket = editorSocket;
//socket.emit('chat message', 'hi');
editorSocket.on('connected', function (msg) {
    console.log('Editor client connected');
    console.log(msg);
    msg.tiles.forEach(function (tile) {
        var addedTile = new Tile_js_1.Tile(tile.type, tile.centerX, tile.centerY, tile.x1, tile.x2, tile.y1, tile.y2, tile.radius, tile.color, tile.tileNumber);
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
        editor.getGame().addTile(addedTile);
        reload(editor, ctx);
    });
    var background = new Background_1.Background();
    console.log('background je je chyba');
    console.log(msg.background);
    console.log(msg);
    background.setColor(msg.background.color);
    console.log('background nie je chyba');
    if (msg.background.image != 'none') {
        var backImage_1 = new Image();
        backImage_1.src = msg.background.image;
        backImage_1.onload = function () {
            background.setBackgroundImage(backImage_1);
            editor.getGame().setBackground(background);
            console.log('obrazok ready');
            reload(editor, ctx);
        };
        background.setBackgroundImage(backImage_1);
    }
    console.log(background);
    console.log('sprava je pod');
    console.log(msg.background);
    console.log('farba je: ' + msg.background.color);
    editor.getGame().setBackground(background);
    //editor.getGame().setBackground(msg.background)
    editor.getGame().setAuthor(msg.game.author);
    editor.getGame().setName(msg.game.name);
    editor.getGame().setNumOfPlayers(msg.game.numOfPlayers);
    (0, Gameplay_1.initGameInfo)(msg.game.name);
    //reload(editor,ctx)
    //edit()
});
//editorSocket.on('connected',()=>{console.log('pripojil Client Editor!')})
console.log(window.location.href.split('/'));
var isEditor = false;
var zoz = window.location.href.split('/');
if (zoz[zoz.length - 2] === 'editor') {
    edit();
    isEditor = true;
    //editor.getGame().setInitSizeX(window.innerWidth)
    //editor.getGame().setInitSizeY(window.innerHeight)
}
else {
    var params = new URLSearchParams(window.location.search);
    console.log(params.get('name'));
    console.log('room je :');
    console.log(params.get('room'));
    console.log(params.get('room') == null);
    editorSocket.emit('load game', { id: getCookie('id'), name: params.get('name') });
    if (params.get('room') == null) {
        //editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
    }
    else {
        editorSocket.emit('load room-info', { room: params.get('room') });
        //editorSocket.emit('load room-game',{room:params.get('room')})
        //editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
    }
    (0, Gameplay_1.initDice)();
}
editorSocket.on('loaded game', function () {
    console.log('Editor client connected');
    //edit()
});
editorSocket.on('loadedQuestions', function (data) { (0, Questions_1.showAllQuestions)(data); });
editorSocket.on('loadedAnswerQuestions', function (data) { (0, Questions_1.askQuestion)(data); });
function edit() {
    mainMenu();
    console.log('vykonal edit');
    document.getElementById('editBackground').addEventListener('click', function () { (0, BackgroundEditor_1.editBackground)(); });
    document.getElementById('insertTiles').addEventListener('click', function () { (0, TileEditor_js_1.insertTilesMenu)(); });
    document.getElementById('moveTiles').addEventListener('click', function () { (0, TileEditor_js_1.moveTiles)(); });
    document.getElementById('editTiles').addEventListener('click', function () { (0, TileEditor_js_1.editTiles)(); });
    document.getElementById('deleteTiles').addEventListener('click', function () { (0, TileEditor_js_1.deleteTiles)(); });
    document.getElementById('questionManager').addEventListener('click', function () { editorSocket.emit('loadQuestions'); });
    //spawnButton(document,'containerAdd','dd',[],'Add Option',addOption)
    document.getElementById('generalInfoButton').addEventListener('click', function () {
        (0, TileEditor_js_1.removeAllButtons)();
        (0, TileEditor_js_1.removeAllListenersAdded)();
        mainMenu();
    });
    document.getElementById('answerButton').addEventListener('click', function () { (0, Questions_1.evaluateQuestion)(); });
    document.getElementById('setAnswerButton').addEventListener('click', function () { editorSocket.emit('answerQuestion', { id: 7 }); });
    document.getElementById('addButton').addEventListener('click', function () { (0, Questions_1.addOption)(); });
    document.getElementById('questionSubmitButton').addEventListener('click', function () { (0, Questions_1.createQuestion)(); });
    document.getElementById('insertPawn').addEventListener('click', function () { (0, PawnEditor_1.pawnInsertMenu)(); });
    document.getElementById('editPawn').addEventListener('click', function () { (0, PawnEditor_1.pawnEditMenu)(); });
    document.getElementById('deletePawn').addEventListener('click', function () { (0, PawnEditor_1.pawnDeleteMenu)(); });
}
var doc = document;
exports.doc = doc;
var canvas = document.createElement('canvas');
exports.canvas = canvas;
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
    numOfPlayersSlider.oninput = function () {
        document.getElementById("numShower").textContent = numOfPlayersSlider.value;
        editor.getGame().setNumOfPlayers(parseInt(numOfPlayersSlider.value));
        var number = parseInt(numOfPlayersSlider.value);
        var playerTokens = editor.getGame().getPlayerTokens();
        if (number < playerTokens.length) {
            for (var i = 0; i < playerTokens.length - number; i++) {
                playerTokens.pop();
                editor.getGame().getPawnStyle()["delete"]('Player ' + (playerTokens.length));
                console.log(editor.getGame().getPawnStyle());
                console.log('odobral');
            }
        }
        if (number > playerTokens.length) {
            for (var i = 0; i < number - playerTokens.length; i++) {
                playerTokens.push('Player ' + (playerTokens.length + 1));
                console.log('pridal');
                editor.getGame().getPawnStyle().set('Player ' + (playerTokens.length), new PawnStyle_1.PawnStyle('Player ' + (playerTokens.length), '#000000', 'type1'));
                console.log(editor.getGame().getPawnStyle());
                //editor.getGame().getPawnStyle().Player
            }
        }
        editor.getGame().setPlayerTokens(playerTokens);
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
    (0, Elements_1.spawnButton)(document, 'tileEditingPlace', 'savaGameButton', ["btn", "btn-dark"], 'Save game to database!', function () {
        editor.getGame().saveGame();
        //window.location.replace('/')
    });
}
exports.mainMenu = mainMenu;
var length = 0;
var ctx = canvas.getContext("2d");
exports.ctx = ctx;
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
        console.log(window.innerWidth / 3 * 2 - 30);
        console.log(editor.getGame().getInitSizeX());
        editor.getGame().setScaleY(window.innerHeight / editor.getGame().getInitSizeY());
        console.log('x je: ' + editor.getGame().getScaleX());
        console.log('y je: ' + editor.getGame().getScaleY());
    }
    reload(editor, context);
    //if (started) startDrawingPath();
    // }
}
exports.resize = resize;
function reload(editor, ctx) {
    console.log(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(editor.getGame().getBackground());
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
        //console.log(from);
        //console.log(to);
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
$('#addButton').on('load', function () {
    console.log('tototottoott');
}
//document.getElementById('addButton')!.addEventListener('click',addOption)}
);
