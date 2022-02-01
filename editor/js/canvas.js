"use strict";
exports.__esModule = true;
exports.reload = exports.editor = exports.calibreEventCoords = exports.ctx = exports.canvas = exports.clear = exports.elementDeleter = exports.doc = exports.mainMenu = void 0;
//import {Socket} from "./../../services/socket/Socket.js" --nemaz ale spojazdni
var TileEditor_js_1 = require("./TileEditor.js");
var BackgroundEditor_1 = require("./BackgroundEditor");
var GameEditor_js_1 = require("./GameEditor.js");
//const socket = io('http://localhost:8001')
//socket.emit("greetings","Hello!")
var doc = document;
exports.doc = doc;
var canvas = document.createElement('canvas');
exports.canvas = canvas;
var editor = new GameEditor_js_1.GameEditor();
exports.editor = editor;
document.getElementById("canvasPlace").appendChild(canvas);
var started = false;
document.getElementById('editBackground').addEventListener('click', function () { (0, BackgroundEditor_1.editBackground)(); });
document.getElementById('insertTiles').addEventListener('click', function () { (0, TileEditor_js_1.insertTilesMenu)(); });
document.getElementById('moveTiles').addEventListener('click', function () { (0, TileEditor_js_1.moveTiles)(); });
document.getElementById('editTiles').addEventListener('click', function () { (0, TileEditor_js_1.editTiles)(); });
document.getElementById('deleteTiles').addEventListener('click', function () { (0, TileEditor_js_1.deleteTiles)(); });
mainMenu();
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
    };
    document.getElementById("numOfPlayersPlace").appendChild(numOfPlayersSlider);
    var gameName = document.createElement('input');
    gameName.id = 'gameName';
    text = document.createElement('p');
    text.textContent = 'Názov hry:';
    document.getElementById("gameNamePlace").appendChild(text);
    document.getElementById("gameNamePlace").appendChild(gameName);
    var gameType = document.createElement('select');
    gameType.id = 'gameType';
    text = document.createElement('p');
    text.textContent = 'Typ hry:';
    document.getElementById("gameTypePlace").appendChild(text);
    document.getElementById("gameTypePlace").appendChild(gameType);
}
exports.mainMenu = mainMenu;
var length = 0;
var ctx = canvas.getContext("2d");
exports.ctx = ctx;
resize();
window.addEventListener('resize', resize);
// // resize canvas
function resize() {
    //endDrawingPath()
    ctx.canvas.width = window.innerWidth / 3 * 2 - 30;
    ctx.canvas.height = window.innerHeight;
    reload();
    //if (started) startDrawingPath();
    // }
}
function reload() {
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
// ///
// let u = {x:(to.getX() - from.getX())/10,y:(to.getY() - from.getY())/10}
// let newPoint= new Point(from.getX(),from.getY(),false)
// let t = 0.1
// console.log('zaciatok'+'x: '+newPoint.getX()+' y: '+newPoint.getY())
// //console.log('dufany koniec'+'x: '+to.getX()+' y: '+to.getY())
// while (Math.sqrt( Math.pow((newPoint.getX()-to.getX()), 2) + Math.pow((newPoint.getY()-to.getY()), 2) ) > 1){
//   newPoint.setX(from.getX()+t*u.x) 
//   newPoint.setY(from.getY()+t*u.y)
//   if (newPoint.getX()%1 == 0){
//     console.log(Math.sqrt( Math.pow((newPoint.getX()-to.getX()), 2) + Math.pow((newPoint.getY()-to.getY()), 2) ))
//     console.log('novy'+'x: '+newPoint.getX()+' y: '+newPoint.getY())
//   }
//   t+=0.1
// }
// console.log('koniec'+'x: '+newPoint.getX()+' y: '+newPoint.getY())
