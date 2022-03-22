"use strict";
exports.__esModule = true;
exports.insertPawn = exports.pawnDeleteMenu = exports.pawnEditMenu = exports.pawnInsertMenu = void 0;
var canvas_1 = require("./canvas");
var Elements_1 = require("./Elements");
var Pawn_1 = require("./Pawn");
var TileEditor_1 = require("./TileEditor");
function pawnInsertMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    // spawnParagraph(doc,'tileEditingPlace','','Configure your Pawn, and click on tile to insert it!')
    // spawnParagraph(doc,'tileEditingPlace','','Choose pawn color!')
    // spawnColorPicker(doc,'tileEditingPlace','pawnColorPicker')
    // spawnParagraph(doc,'tileEditingPlace','','Choose pawn image!')
    // spawnImageInput(doc,'tileEditingPlace','imagePicker','Choose!',function(){})
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'To which player it belong?');
    (0, Elements_1.spawnSelectMenu)(canvas_1.doc, 'tileEditingPlace', 'playerSelect', [], canvas_1.editor.getGame().getPlayerTokens());
    canvas_1.canvas.addEventListener('click', insertPawn);
}
exports.pawnInsertMenu = pawnInsertMenu;
function insertPawn(event) {
    var colorPicker = canvas_1.doc.getElementById('pawnColorPicker');
    console.log('skusil nakreslit');
    var tiles = canvas_1.editor.getGame().getTiles();
    var tile = undefined;
    var coords = (0, canvas_1.calibreEventCoords)(event);
    for (var i = tiles.length - 1; i >= 0; i--) {
        if (tiles[i].isPointedAt(coords.x, coords.y)) {
            tile = tiles[i];
            break;
        }
    }
    if (tile != undefined) {
        var player = canvas_1.doc.getElementById('playerSelect');
        var newPawn = new Pawn_1.Pawn(1, player.value, tile);
        //newPawn.color = colorPicker!.value
        canvas_1.editor.getGame().getPawns().push(newPawn);
        (0, TileEditor_1.removeAllListenersAdded)();
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
        console.log(newPawn);
    }
}
exports.insertPawn = insertPawn;
function pawnEditMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Select player:');
    var playerPicker = (0, Elements_1.spawnSelectMenu)(canvas_1.doc, 'tileEditingPlace', 'playerSelect', [], canvas_1.editor.getGame().getPlayerTokens());
    playerPicker.onchange = function () {
        drawActualPawnLook(playerPicker.value);
    };
    (0, Elements_1.spawnCanvas)(canvas_1.doc, 'tileEditingPlace', 'pawnStyle');
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn color!');
    var colorPicker = (0, Elements_1.spawnColorPicker)(canvas_1.doc, 'tileEditingPlace', 'pawnColorPicker');
    colorPicker.onchange = function () {
        var _a;
        (_a = canvas_1.editor.getGame().getPawnStyle().get(playerPicker.value)) === null || _a === void 0 ? void 0 : _a.setColor(colorPicker.value);
        drawActualPawnLook(playerPicker.value);
    };
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn type!');
    (0, Elements_1.spawnButton)(canvas_1.doc, 'tileEditingPlace', 'chooseType', ['btn', 'btn-secondary'], 'Choose type!', function () {
        $('#pawnModal').modal('show');
        drawStyles(colorPicker.value);
    });
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn image!');
    (0, Elements_1.spawnImageInput)(canvas_1.doc, 'tileEditingPlace', 'imagePicker', 'Choose!', function () { });
    var _loop_1 = function (i) {
        var button = document.getElementById('pawnType' + i);
        button.onclick = function () {
            var _a;
            var player = playerPicker.value;
            (_a = canvas_1.editor.getGame().getPawnStyle().get(player)) === null || _a === void 0 ? void 0 : _a.setType('type' + i);
            console.log(canvas_1.editor.getGame().getPawnStyle());
            drawActualPawnLook(player);
        };
        drawActualPawnLook('Player 1');
    };
    for (var i = 1; i <= 3; i++) {
        _loop_1(i);
    }
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
}
exports.pawnEditMenu = pawnEditMenu;
function pawnDeleteMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
}
exports.pawnDeleteMenu = pawnDeleteMenu;
function drawStyles(color) {
    var cs = document.getElementById('canvasPawn1');
    cs.width = 100;
    cs.height = 100;
    drawPawnType1(cs.getContext("2d"), 50, 20, 20, 100, 100, color);
    // cs.width = 100
    // cs.height = 100
    // let contextik = <CanvasRenderingContext2D> cs.getContext("2d");
    // contextik.resetTransform()
    // let width = cs.width
    // let height = cs.height
    // contextik.beginPath()
    // contextik.arc(50,20,20,0, 2 * Math.PI)
    // contextik.fillStyle = color
    // contextik.fill()
    // contextik.beginPath()
    // contextik.moveTo(50,30)
    // contextik.lineTo(20,90)
    // contextik.lineTo(80,90)
    // contextik.lineTo(50,30)
    // contextik.fill()
    cs = document.getElementById('canvasPawn2');
    cs.width = 100;
    cs.height = 100;
    var contextik = cs.getContext("2d");
    contextik.resetTransform();
    var width = cs.width;
    var height = cs.height;
    contextik.beginPath();
    contextik.arc(50, 20, 20, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.moveTo(30, 40);
    contextik.lineTo(70, 40);
    contextik.lineTo(50, 90);
    contextik.lineTo(30, 40);
    contextik.fill();
    cs = document.getElementById('canvasPawn3');
    cs.width = 100;
    cs.height = 100;
    contextik = cs.getContext("2d");
    contextik.resetTransform();
    width = cs.width;
    height = cs.height;
    contextik.beginPath();
    contextik.arc(50, 20, 20, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.moveTo(10, 40);
    contextik.lineTo(90, 40);
    contextik.lineTo(50, 90);
    contextik.lineTo(10, 40);
    contextik.fill();
}
function drawPawnType1(contextik, headCenterX, headCenterY, radius, width, height, color) {
    contextik.beginPath();
    contextik.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.moveTo(headCenterX, headCenterY + radius / 2);
    contextik.lineTo(headCenterX - radius * 1.5, headCenterY + radius * 3);
    contextik.lineTo(headCenterX + radius * 1.5, headCenterY + radius * 3);
    contextik.lineTo(headCenterX, headCenterY + radius / 2);
    contextik.fill();
}
function drawActualPawnLook(player) {
    var cs = document.getElementById('pawnStyle');
    var style = canvas_1.editor.getGame().getPawnStyle().get(player);
    if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type1') {
        drawPawnType1(cs.getContext("2d"), cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else {
        console.log('nie je dorobene');
    }
}
