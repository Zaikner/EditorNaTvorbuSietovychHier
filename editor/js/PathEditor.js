"use strict";
exports.__esModule = true;
exports.endDrawingPath = exports.saveEditingTrack = exports.editTrack = void 0;
var canvas_js_1 = require("./canvas.js");
var Point_js_1 = require("./Point.js");
var TileEditor_js_1 = require("./TileEditor.js");
var can = false;
function editTrack() {
    (0, TileEditor_js_1.removeAllButtons)();
    (0, TileEditor_js_1.removeAllListenersAdded)();
    //startDrawingPath()
    var startButton = document.createElement('button');
    startButton.id = 'start';
    startButton.textContent = 'Start Inserting!';
    startButton.classList.add("btn");
    startButton.classList.add("btn-dark");
    document.getElementById("buttonPlace").appendChild(startButton);
    document.getElementById("start").addEventListener('click', startDrawingPath);
    var spawnButton = document.createElement('button');
    spawnButton.id = 'spawn';
    spawnButton.textContent = 'Spawn Tiles!';
    spawnButton.classList.add("btn");
    spawnButton.classList.add("btn-dark");
    document.getElementById("buttonPlace").appendChild(spawnButton);
    document.getElementById("spawn").addEventListener('click', spawnTiles);
    var endButton = document.createElement('button');
    endButton.id = 'end';
    endButton.textContent = 'End Inserting!';
    endButton.classList.add("btn");
    endButton.classList.add("btn-dark");
    document.getElementById("buttonPlace").appendChild(endButton);
    document.getElementById("end").addEventListener('click', endDrawingPath);
    (0, TileEditor_js_1.spawnElements)();
}
exports.editTrack = editTrack;
function saveEditingTrack() {
    endDrawingPath();
    //if (sessionStorage.points === '' || sessionStorage.points == null){
    if (canvas_js_1.editor.getGame().getPath().getPath() == []) {
        //socket.emit('saveEditingTrack',{lenght:length,points:editor.getGame().getPath().getPath(),type:(<HTMLSelectElement>document.getElementById('Select')).value})
    }
    (0, canvas_js_1.elementDeleter)('buttonPlace');
    (0, canvas_js_1.mainMenu)();
}
exports.saveEditingTrack = saveEditingTrack;
function startDrawingPath() {
    canvas_js_1.editor.getGame().getPath().setPath([]);
    (0, canvas_js_1.reload)();
    canvas_js_1.canvas.addEventListener('mousemove', draw);
    canvas_js_1.canvas.addEventListener('mousedown', setPosition);
    canvas_js_1.canvas.addEventListener('mouseenter', setPosition);
}
function endDrawingPath() {
    canvas_js_1.editor.getGame().getPath().setPath([]);
    (0, canvas_js_1.reload)();
    canvas_js_1.canvas.removeEventListener('mousemove', draw);
    canvas_js_1.canvas.removeEventListener('mousedown', setPosition);
    canvas_js_1.canvas.removeEventListener('mouseenter', setPosition);
}
exports.endDrawingPath = endDrawingPath;
var pos = { x: 0, y: 0, end: false };
function setPosition(event) {
    var coords = (0, canvas_js_1.calibreEventCoords)(event);
    if (coords.x < 0) {
        pos.x = 0;
    }
    else if (coords.x > canvas_js_1.ctx.canvas.width) {
        pos.x = canvas_js_1.ctx.canvas.width;
    }
    else {
        pos.x = coords.x;
    }
    if (coords.y < 0) {
        pos.y = 0;
    }
    else if (coords.y > canvas_js_1.ctx.canvas.height) {
        pos.y = canvas_js_1.ctx.canvas.height;
    }
    else {
        pos.y = coords.y;
    }
}
function draw(event) {
    if (event.buttons !== 1)
        return;
    var coords = (0, canvas_js_1.calibreEventCoords)(event);
    canvas_js_1.editor.getGame().getPath().add(new Point_js_1.Point(coords.x, coords.y, pos.end));
    if (canvas_js_1.editor.getGame().getPath().getPath().length == 1) {
        canvas_js_1.ctx.moveTo(coords.x, coords.y);
        return;
    }
    canvas_js_1.ctx.beginPath();
    canvas_js_1.ctx.lineWidth = 5;
    canvas_js_1.ctx.lineCap = 'round';
    canvas_js_1.ctx.strokeStyle = '#c0392b';
    canvas_js_1.ctx.moveTo(pos.x, pos.y);
    setPosition(event);
    canvas_js_1.ctx.lineTo(pos.x, pos.y);
    canvas_js_1.ctx.stroke();
    //socket.emit('skuska');
}
function spawnTiles() {
    canvas_js_1.editor.getGame().getPath().getPath().forEach(function (point) {
        canSpawn(point.getX(), point.getY());
        if (can == true) {
            (0, TileEditor_js_1.spawnTile)({ x: point.getX(), y: point.getY() });
            console.log(canvas_js_1.editor.getGame().getTiles().length);
        }
    });
    endDrawingPath();
}
function canSpawn(x, y) {
    can = true;
    canvas_js_1.editor.getGame().getTiles().forEach(function (tile) {
        if (Math.sqrt(Math.pow((x - tile.getCenterX()), 2) + Math.pow((y - tile.getCenterY()), 2)) <= 2 * tile.getRadius()) {
            can = false;
        }
        return;
    });
}
