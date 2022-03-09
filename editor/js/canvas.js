"use strict";
exports.__esModule = true;
exports.resize = exports.editorSocket = exports.reload = exports.editor = exports.calibreEventCoords = exports.ctx = exports.canvas = exports.clear = exports.elementDeleter = exports.doc = exports.mainMenu = void 0;
var TileEditor_js_1 = require("./TileEditor.js");
var BackgroundEditor_1 = require("./BackgroundEditor");
var GameEditor_js_1 = require("./GameEditor.js");
var Elements_1 = require("./Elements");
var editorSocket = 'undefined';
exports.editorSocket = editorSocket;
// const editorSocket = io('http://sietove-hry.herokuapp.com/');//http://sietove-hry.herokuapp.com/
// //socket.emit('chat message', 'hi');
// import { io } from "socket.io-client";
// editorSocket.on('connected',(msg)=>{
//   console.log('Editor client connected')
//   console.log(msg)
//   msg.tiles.forEach((tile:any) =>{
//     let addedTile = new Tile(tile.type,tile.centerX,tile.centerY,tile.x1,tile.x2,tile.y1,tile.y2,tile.radius,tile.color,tile.tileNumber)
//      addedTile.setStroke(tile.stroke)
//      addedTile.setStrokeColor(tile.strokeColor)
//      addedTile.setShape(tile.shape)
//      addedTile.setIsChoosen(tile.isChoosen)
//      let image = new Image()
//      image.src = msg.background.image
//      image.onload = function(){
//       addedTile.setBackgroundFile(image)
//       reload(editor,ctx)
//      }
//       //addedTile.setBackgroundFile(tile.backgroundFile)
//       //addedTile.setPatternFile(tile.patternFile)
//      addedTile.setIsEnding(tile.isEnding)
//      addedTile.setIsEndingFor(tile.isEndingFor)
//      addedTile.setIsStarting(tile.isStarting)
//      addedTile.setIsStartingFor(tile.isStartingFor)
//      addedTile.setBelongTo(tile.belongTo)
//      addedTile.setCanOccupy(tile.canOccupy)
//      addedTile.setToogleNumber(tile.toggleNumber)
//      addedTile.setNumberingColor(tile.numberingColor)
//      addedTile.setFollowingTileNumber(tile.numberOfFollowingTile)
//     editor.getGame().addTile(addedTile)
//   })
//   let background = new Background()
//   background.setColor(msg.background.color)
//   let backImage = new Image()
//   backImage.src = msg.background.image
//   backImage.onload = function(){
//     background.setBackgroundImage(backImage)
//     editor.getGame().setBackground(background)
//     console.log('obrazok ready')
//     reload(editor,ctx)
//   }
//   background.setBackgroundImage(backImage)
//   console.log(background)
//   console.log('sprava je pod')
//   console.log(msg.background)
//   console.log('farba je: '+msg.background.color)
//   editor.getGame().setBackground(background)
//   //editor.getGame().setBackground(msg.background)
//   editor.getGame().setAuthor(msg.game.author)
//   editor.getGame().setName(msg.game.name)
//   editor.getGame().setNumOfPlayers(msg.game.numOfPlayers)
//   //reload(editor,ctx)
//   //edit()
// })
// //editorSocket.on('connected',()=>{console.log('pripojil Client Editor!')})
// if (window.location.href === 'http://localhost:8001/editor/'){
//   edit()
// }
// else{
//   const params = new URLSearchParams(window.location.search);
//   editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
// }
// editorSocket.on('loaded game',()=>{
//   console.log('Editor client connected')
//   //edit()
// })
function edit() {
    mainMenu();
    document.getElementById('editBackground').addEventListener('click', function () { (0, BackgroundEditor_1.editBackground)(); });
    document.getElementById('insertTiles').addEventListener('click', function () { (0, TileEditor_js_1.insertTilesMenu)(); });
    document.getElementById('moveTiles').addEventListener('click', function () { (0, TileEditor_js_1.moveTiles)(); });
    document.getElementById('editTiles').addEventListener('click', function () { (0, TileEditor_js_1.editTiles)(); });
    document.getElementById('deleteTiles').addEventListener('click', function () { (0, TileEditor_js_1.deleteTiles)(); });
}
var doc = document;
exports.doc = doc;
var canvas = document.createElement('canvas');
exports.canvas = canvas;
var editor = new GameEditor_js_1.GameEditor();
exports.editor = editor;
document.getElementById("canvasPlace").appendChild(canvas);
var started = false;
function mainMenu() {
    started = false;
    var numOfPlayersSlider = document.createElement('input');
    numOfPlayersSlider.type = 'range';
    numOfPlayersSlider.id = 'numOfPlayers';
    numOfPlayersSlider.value = '2';
    numOfPlayersSlider.min = '1';
    numOfPlayersSlider.max = '6';
    numOfPlayersSlider.step = '1';
    var numShower = document.createElement('paragraph');
    numShower.id = 'numShower';
    numShower.textContent = '2';
    var text = document.createElement('p');
    text.textContent = 'Počet hráčov:';
    document.getElementById("numOfPlayersPlace").appendChild(text);
    document.getElementById("numOfPlayersPlace").appendChild(numShower);
    numOfPlayersSlider.oninput = function () {
        document.getElementById("numShower").textContent = numOfPlayersSlider.value;
        editor.getGame().setNumOfPlayers(parseInt(numOfPlayersSlider.value));
        var playerTokens = [];
        for (var i = 1; i <= parseInt(numOfPlayersSlider.value); i++) {
            playerTokens.push('Player ' + i);
        }
        editor.getGame().setPlayerTokens(playerTokens);
    };
    document.getElementById("numOfPlayersPlace").appendChild(numOfPlayersSlider);
    var gameName = document.createElement('input');
    gameName.id = 'gameName';
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
        window.location.replace('/');
    });
}
exports.mainMenu = mainMenu;
var length = 0;
var ctx = canvas.getContext("2d");
exports.ctx = ctx;
resize(editor, ctx);
window.addEventListener('resize', function () { resize(editor, ctx); });
// // resize canvas
function resize(editor, context) {
    //endDrawingPath()
    context.canvas.width = window.innerWidth / 3 * 2 - 30;
    context.canvas.height = window.innerHeight;
    reload(editor, context);
    //if (started) startDrawingPath();
    // }
}
exports.resize = resize;
function reload(editor, ctx) {
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
    var tiles = editor.getGame().getTiles();
    tiles.forEach(function (tile) {
        tile.drawTile(canvas, ctx);
    });
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
