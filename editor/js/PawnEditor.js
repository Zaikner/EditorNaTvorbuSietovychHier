"use strict";
exports.__esModule = true;
exports.deletePawn = exports.drawPawnType7 = exports.drawPawnType6 = exports.drawPawnType5 = exports.drawPawnType4 = exports.drawPawnType3 = exports.drawPawnType2 = exports.drawPawnType1 = exports.insertPawn = exports.drawPawnImage = exports.pawnDeleteMenu = exports.pawnEditMenu = exports.pawnInsertMenu = void 0;
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
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', canvas_1.texts[73], true);
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
        var newPawn = new Pawn_1.Pawn(player.value, tile);
        //newPawn.color = colorPicker!.value
        canvas_1.editor.getGame().getPawns().push(newPawn);
        tile.getPawns().push(newPawn);
        //removeAllListenersAdded()
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
        console.log(newPawn);
    }
}
exports.insertPawn = insertPawn;
function deletePawn(event) {
    console.log('deleteto');
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
        console.log('nasiel tile');
        var pawns = tile.getPawns();
        var stop_1 = false;
        var player_1 = canvas_1.doc.getElementById('playerSelect');
        pawns.forEach(function (pawn) {
            if (pawn.player == player_1.value && !stop_1) {
                console.log('nasiel pawn');
                stop_1 = true;
                canvas_1.editor.getGame().removePawn(pawn);
                tile.removePawn(pawn);
            }
        });
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
    }
}
exports.deletePawn = deletePawn;
function pawnEditMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', canvas_1.texts[74], true);
    var playerPicker = (0, Elements_1.spawnSelectMenu)(canvas_1.doc, 'tileEditingPlace', 'playerSelect', [], canvas_1.editor.getGame().getPlayerTokens());
    playerPicker.onchange = function () {
        drawActualPawnLook(playerPicker.value);
    };
    (0, Elements_1.spawnCanvas)(canvas_1.doc, 'tileEditingPlace', 'pawnStyle');
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', canvas_1.texts[75], true);
    var colorPicker = (0, Elements_1.spawnColorPicker)(canvas_1.doc, 'tileEditingPlace', 'pawnColorPicker');
    colorPicker.onchange = function () {
        var _a;
        (_a = canvas_1.editor.getGame().getPawnStyle().get(playerPicker.value)) === null || _a === void 0 ? void 0 : _a.setColor(colorPicker.value);
        drawActualPawnLook(playerPicker.value);
    };
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', canvas_1.texts[76], true);
    (0, Elements_1.spawnButton)(canvas_1.doc, 'tileEditingPlace', 'chooseType', ['btn', 'btn-secondary'], canvas_1.texts[77], function () {
        $('#pawnModal').modal('show');
        drawStyles(colorPicker.value);
    });
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', canvas_1.texts[78], true);
    (0, Elements_1.spawnImageInput)(canvas_1.doc, 'tileEditingPlace', 'imagePicker', canvas_1.texts[63], function () {
        var _a, _b;
        if (document.getElementById('imagePicker').files.length > 0) {
            (_a = canvas_1.editor.getGame().getPawnStyle().get(playerPicker.value)) === null || _a === void 0 ? void 0 : _a.setImage(new Image());
            canvas_1.editor.getGame().getPawnStyle().get(playerPicker.value).getImage().src = URL.createObjectURL(document.getElementById('imagePicker').files[0]);
        }
        else {
            (_b = canvas_1.editor.getGame().getPawnStyle().get(playerPicker.value)) === null || _b === void 0 ? void 0 : _b.setImage(undefined);
        }
    });
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
    for (var i = 1; i <= 7; i++) {
        _loop_1(i);
    }
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
}
exports.pawnEditMenu = pawnEditMenu;
function pawnDeleteMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', canvas_1.texts[73], true);
    (0, Elements_1.spawnSelectMenu)(canvas_1.doc, 'tileEditingPlace', 'playerSelect', [], canvas_1.editor.getGame().getPlayerTokens());
    canvas_1.canvas.addEventListener('click', deletePawn);
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
    // contextik.beginPath()
    // contextik.arc(50,20,20,0, 2 * Math.PI)
    // contextik.fillStyle = color
    // contextik.fill()
    // contextik.beginPath()
    // contextik.moveTo(30,40)
    // contextik.lineTo(70,40)
    // contextik.lineTo(50,90)
    // contextik.lineTo(30,40)
    // contextik.fill()
    drawPawnType2(contextik, 50, 20, 20, 100, 100, color);
    cs = document.getElementById('canvasPawn3');
    cs.width = 100;
    cs.height = 100;
    contextik = cs.getContext("2d");
    contextik.resetTransform();
    width = cs.width;
    height = cs.height;
    drawPawnType3(contextik, 50, 20, 20, 100, 100, color);
    cs = document.getElementById('canvasPawn4');
    cs.width = 100;
    cs.height = 100;
    contextik = cs.getContext("2d");
    contextik.resetTransform();
    width = cs.width;
    height = cs.height;
    drawPawnType4(contextik, 50, 20, 20, 100, 100, color);
    cs = document.getElementById('canvasPawn5');
    cs.width = 100;
    cs.height = 100;
    contextik = cs.getContext("2d");
    contextik.resetTransform();
    width = cs.width;
    height = cs.height;
    drawPawnType5(contextik, 50, 20, 20, 100, 100, color);
    cs = document.getElementById('canvasPawn6');
    cs.width = 100;
    cs.height = 100;
    contextik = cs.getContext("2d");
    contextik.resetTransform();
    width = cs.width;
    height = cs.height;
    drawPawnType6(contextik, 50, 20, 20, 100, 100, color);
    cs = document.getElementById('canvasPawn7');
    cs.width = 100;
    cs.height = 100;
    contextik = cs.getContext("2d");
    contextik.resetTransform();
    width = cs.width;
    height = cs.height;
    drawPawnType7(contextik, 50, 20, 20, 100, 100, color);
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
exports.drawPawnType1 = drawPawnType1;
function drawPawnType2(contextik, headCenterX, headCenterY, radius, width, height, color) {
    contextik.beginPath();
    contextik.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.moveTo(headCenterX - radius, headCenterY + radius);
    contextik.lineTo(headCenterX + radius, headCenterY + radius);
    contextik.lineTo(headCenterX, headCenterY + radius * 3.5);
    contextik.lineTo(headCenterX - radius, headCenterY + radius);
    contextik.fill();
}
exports.drawPawnType2 = drawPawnType2;
function drawPawnType3(contextik, headCenterX, headCenterY, radius, width, height, color) {
    contextik.beginPath();
    contextik.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.moveTo(headCenterX - radius * 2, headCenterY + radius);
    contextik.lineTo(headCenterX + radius * 2, headCenterY + radius);
    contextik.lineTo(headCenterX, headCenterY + radius * 3.5);
    contextik.lineTo(headCenterX - radius * 2, headCenterY + radius);
    contextik.fill();
}
exports.drawPawnType3 = drawPawnType3;
function drawPawnType4(contextik, headCenterX, headCenterY, radius, width, height, color) {
    contextik.beginPath();
    contextik.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY + radius * 3, radius * 1.5, radius * 2.5, 0, 0, Math.PI, true);
    contextik.fill();
}
exports.drawPawnType4 = drawPawnType4;
function drawPawnType5(contextik, headCenterX, headCenterY, radius, width, height, color) {
    contextik.beginPath();
    contextik.fillStyle = color;
    contextik.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
    contextik.fill();
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY + radius * 3, radius / 2, radius * 4, 0, 0, Math.PI, true);
    contextik.fill();
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY + radius * 3, radius * 1.5, radius * 1.5, 0, 0, Math.PI, true);
    contextik.fill();
}
exports.drawPawnType5 = drawPawnType5;
function drawPawnType6(contextik, headCenterX, headCenterY, radius, width, height, color) {
    contextik.beginPath();
    contextik.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY + radius * 3, radius, radius * 2.5, 0, 0, Math.PI, true);
    contextik.fill();
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY + radius * 3, radius * 1.5, radius * 1.5, 0, 0, Math.PI, true);
    contextik.fill();
}
exports.drawPawnType6 = drawPawnType6;
function drawPawnType7(contextik, headCenterX, headCenterY, radius, width, height, color) {
    contextik.beginPath();
    contextik.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
    contextik.fillStyle = color;
    contextik.fill();
    contextik.beginPath();
    contextik.moveTo(headCenterX, headCenterY + radius / 2);
    contextik.lineTo(headCenterX - radius, headCenterY + radius * 3);
    contextik.lineTo(headCenterX + radius, headCenterY + radius * 3);
    contextik.lineTo(headCenterX, headCenterY + radius / 2);
    contextik.fill();
    contextik.beginPath();
    contextik.ellipse(headCenterX, headCenterY + radius * 3, radius * +1.5, radius, 0, 0, Math.PI, true);
    contextik.fill();
}
exports.drawPawnType7 = drawPawnType7;
function drawPawnImage(contextik, headCenterX, headCenterY, radius, width, height, image) {
    contextik.beginPath();
    console.log(headCenterX, headCenterY, radius);
    contextik.drawImage(image, headCenterX - radius, headCenterY - radius, radius * 2, radius * 3);
}
exports.drawPawnImage = drawPawnImage;
function drawActualPawnLook(player) {
    var cs = document.getElementById('pawnStyle');
    var context = cs.getContext("2d");
    context.clearRect(0, 0, cs.width, cs.height);
    var style = canvas_1.editor.getGame().getPawnStyle().get(player);
    if ((style === null || style === void 0 ? void 0 : style.getImage()) != undefined) {
        drawPawnImage(context, cs.width / 2, 40, 40, 100, 100, style === null || style === void 0 ? void 0 : style.getImage());
    }
    else if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type1') {
        drawPawnType1(context, cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type2') {
        drawPawnType2(context, cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type3') {
        drawPawnType3(context, cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type4') {
        drawPawnType4(context, cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type5') {
        drawPawnType5(context, cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type6') {
        drawPawnType6(context, cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else if ((style === null || style === void 0 ? void 0 : style.getType()) === 'type7') {
        drawPawnType7(context, cs.width / 2, 40, 40, 100, 100, style.getColor());
    }
    else {
        console.log('nie je dorobene');
    }
}
