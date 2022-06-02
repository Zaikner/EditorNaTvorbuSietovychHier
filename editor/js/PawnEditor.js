"use strict";
exports.__esModule = true;
exports.drawnPawnTypes = exports.deletePawn = exports.insertPawn = exports.drawPawnImage = exports.pawnDeleteMenu = exports.pawnEditMenu = exports.pawnInsertMenu = void 0;
var Canvas_1 = require("./Canvas");
var ClientSocket_1 = require("./ClientSocket");
var Elements_1 = require("./Elements");
var Pawn_1 = require("./Pawn");
var TileEditor_1 = require("./TileEditor");
function pawnInsertMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnSelectMenu)(Canvas_1.doc, 'tileEditingPlace', 'playerSelect', ClientSocket_1.texts[73], ['btn', 'btn-secondary'], Canvas_1.game.getPlayerTokens());
    Canvas_1.canvas.addEventListener('click', insertPawn);
}
exports.pawnInsertMenu = pawnInsertMenu;
function insertPawn(event) {
    var colorPicker = Canvas_1.doc.getElementById('pawnColorPicker');
    var tiles = Canvas_1.game.getTiles();
    var tile = undefined;
    var coords = (0, Canvas_1.calibreEventCoords)(event);
    for (var i = tiles.length - 1; i >= 0; i--) {
        if (tiles[i].isPointedAt(coords.x, coords.y)) {
            tile = tiles[i];
            break;
        }
    }
    if (tile != undefined) {
        var player = Canvas_1.doc.getElementById('playerSelect');
        var newPawn = new Pawn_1.Pawn(player.value, tile);
        Canvas_1.game.getPawns().push(newPawn);
        tile.getPawns().push(newPawn);
        (0, Canvas_1.reload)(Canvas_1.ctx);
    }
}
exports.insertPawn = insertPawn;
function deletePawn(event) {
    var tiles = Canvas_1.game.getTiles();
    var tile = undefined;
    var coords = (0, Canvas_1.calibreEventCoords)(event);
    for (var i = tiles.length - 1; i >= 0; i--) {
        if (tiles[i].isPointedAt(coords.x, coords.y)) {
            tile = tiles[i];
            break;
        }
    }
    if (tile != undefined) {
        var pawns = tile.getPawns();
        var stop_1 = false;
        var player_1 = Canvas_1.doc.getElementById('playerSelect');
        pawns.forEach(function (pawn) {
            if (pawn.player == player_1.value && !stop_1) {
                stop_1 = true;
                Canvas_1.game.removePawn(pawn);
                tile.removePawn(pawn);
            }
        });
        (0, Canvas_1.reload)(Canvas_1.ctx);
    }
}
exports.deletePawn = deletePawn;
function pawnEditMenu() {
    var _a, _b, _c;
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnHeading)(document, 'tileEditingPlace', '', ClientSocket_1.texts[18]);
    var playerPicker = (0, Elements_1.spawnSelectMenu)(Canvas_1.doc, 'tileEditingPlace', 'playerSelect', ClientSocket_1.texts[74], ['btn', 'btn-secondary'], Canvas_1.game.getPlayerTokens());
    playerPicker.onchange = function () {
        var _a, _b;
        drawActualPawnLook(playerPicker.value);
        for (var i = 1; i <= 8; i++) {
            document.getElementById('canvasPawn' + i).style.borderColor = 'white';
        }
        var type = (_a = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _a === void 0 ? void 0 : _a.getType();
        document.getElementById('canvasPawn' + type.charAt(type.length - 1)).style.borderColor = 'red';
        document.getElementById('pawnColorPicker').value = (_b = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _b === void 0 ? void 0 : _b.getColor();
    };
    var colorPicker = (0, Elements_1.spawnColorPicker)(Canvas_1.doc, 'tileEditingPlace', 'pawnColorPicker', ClientSocket_1.texts[75]);
    colorPicker.onchange = function () {
        var _a, _b;
        (_a = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _a === void 0 ? void 0 : _a.setColor(colorPicker.value);
        (_b = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _b === void 0 ? void 0 : _b.setImage(undefined);
        drawActualPawnLook(playerPicker.value);
        drawStyles(colorPicker.value);
        (0, Canvas_1.reload)(Canvas_1.ctx);
    };
    colorPicker.value = Canvas_1.game.getPawnStyle().get(playerPicker.value).getColor();
    (0, Elements_1.spawnImageInput)(Canvas_1.doc, 'tileEditingPlace', 'imagePicker', ClientSocket_1.texts[78], ClientSocket_1.texts[78], function () {
        var _a, _b, _c;
        if (document.getElementById('imagePicker').files.length > 0) {
            (_a = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _a === void 0 ? void 0 : _a.setImage(new Image());
            (_b = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _b === void 0 ? void 0 : _b.setType('type 8');
            Canvas_1.game.getPawnStyle().get(playerPicker.value).getImage().src = URL.createObjectURL(document.getElementById('imagePicker').files[0]);
            Canvas_1.game.getPawnStyle().get(playerPicker.value).getImage().onload = function () {
                drawActualPawnLook(playerPicker.value);
                (0, Canvas_1.reload)(Canvas_1.ctx);
            };
            for (var i = 1; i <= 7; i++) {
                document.getElementById('canvasPawn' + i).style.borderColor = 'white';
            }
            document.getElementById('canvasPawn' + 8).style.borderColor = 'red';
        }
        else {
            (_c = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _c === void 0 ? void 0 : _c.setImage(undefined);
        }
    });
    var p = (0, Elements_1.spawnParagraph)(Canvas_1.doc, 'tileEditingPlace', '', ClientSocket_1.texts[76], true);
    (0, Elements_1.spawnDiv)(document, 'tileEditingPlace', 'pawnPickerDiv', []);
    p.style.textAlign = 'center';
    var _loop_1 = function (i) {
        var c_1 = (0, Elements_1.spawnCanvas)(document, 'pawnPickerDiv', 'canvasPawn' + i);
        c_1.classList.add('pawnType');
        c_1.style.width = '50px';
        c_1.style.height = '50px';
        var type_1 = (_a = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _a === void 0 ? void 0 : _a.getType();
        var image = (_b = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _b === void 0 ? void 0 : _b.getImage();
        if (i.toString() == type_1.charAt(type_1.length - 1) && image == undefined) {
            c_1.style.borderColor = 'red';
        }
        c_1.onclick = function () {
            var _a, _b;
            for (var i_1 = 1; i_1 <= 8; i_1++) {
                document.getElementById('canvasPawn' + i_1).style.borderColor = 'white';
            }
            var player = playerPicker.value;
            c_1.style.borderColor = 'red';
            (_a = Canvas_1.game.getPawnStyle().get(player)) === null || _a === void 0 ? void 0 : _a.setType('type' + i);
            (_b = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _b === void 0 ? void 0 : _b.setImage(undefined);
            drawActualPawnLook(player);
            (0, Canvas_1.reload)(Canvas_1.ctx);
        };
    };
    for (var i = 1; i <= 7; i++) {
        _loop_1(i);
    }
    var c = (0, Elements_1.spawnCanvas)(document, 'pawnPickerDiv', 'canvasPawn' + 8);
    c.classList.add('pawnType');
    c.style.width = '50px';
    c.style.height = '50px';
    var type = (_c = Canvas_1.game.getPawnStyle().get(playerPicker.value)) === null || _c === void 0 ? void 0 : _c.getType();
    if (type.charAt(type.length - 1) == '8') {
        c.style.borderColor = 'red';
    }
    c.onclick = function () {
        var _a;
        if (document.getElementById('imagePicker').files.length > 0) {
            for (var i = 1; i <= 8; i++) {
                document.getElementById('canvasPawn' + i).style.borderColor = 'white';
            }
            var player = playerPicker.value;
            c.style.borderColor = 'red';
            (_a = Canvas_1.game.getPawnStyle().get(player)) === null || _a === void 0 ? void 0 : _a.setType('type' + 8);
            Canvas_1.game.getPawnStyle().get(playerPicker.value).getImage().src = URL.createObjectURL(document.getElementById('imagePicker').files[0]);
            Canvas_1.game.getPawnStyle().get(playerPicker.value).getImage().onload = function () {
                drawActualPawnLook(playerPicker.value);
            };
            drawActualPawnLook(player);
        }
    };
    drawActualPawnLook('Player 1');
    drawStyles(colorPicker.value);
}
exports.pawnEditMenu = pawnEditMenu;
function pawnDeleteMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnParagraph)(Canvas_1.doc, 'tileEditingPlace', '', ClientSocket_1.texts[73], true);
    (0, Elements_1.spawnSelectMenu)(Canvas_1.doc, 'tileEditingPlace', 'playerSelect', ClientSocket_1.texts[129], [], Canvas_1.game.getPlayerTokens());
    Canvas_1.canvas.addEventListener('click', deletePawn);
}
exports.pawnDeleteMenu = pawnDeleteMenu;
function drawStyles(color) {
    var _a;
    var context2;
    var cs;
    for (var i = 1; i <= 7; i++) {
        cs = document.getElementById('canvasPawn' + i);
        cs.width = 100;
        cs.height = 100;
        context2 = cs.getContext("2d");
        context2.resetTransform();
        drawnPawnTypes(cs.getContext("2d"), 50, 20, 20, color, 'type' + i);
    }
    cs = document.getElementById('canvasPawn8');
    cs.width = 100;
    cs.height = 100;
    context2 = cs.getContext("2d");
    context2.resetTransform();
    var image = (_a = Canvas_1.game.getPawnStyle().get(document.getElementById('playerSelect').value)) === null || _a === void 0 ? void 0 : _a.getImage();
    if (image != undefined) {
        drawPawnImage(context2, 50, 30, 30, image);
    }
}
function drawnPawnTypes(context2, headCenterX, headCenterY, radius, color, type) {
    if (type == 'type1') {
        context2.beginPath();
        context2.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
        context2.fillStyle = color;
        context2.fill();
        context2.beginPath();
        context2.moveTo(headCenterX, headCenterY + radius / 2);
        context2.lineTo(headCenterX - radius * 1.5, headCenterY + radius * 3);
        context2.lineTo(headCenterX + radius * 1.5, headCenterY + radius * 3);
        context2.lineTo(headCenterX, headCenterY + radius / 2);
        context2.fill();
    }
    else if (type == 'type2') {
        context2.beginPath();
        context2.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
        context2.fillStyle = color;
        context2.fill();
        context2.beginPath();
        context2.moveTo(headCenterX - radius, headCenterY + radius);
        context2.lineTo(headCenterX + radius, headCenterY + radius);
        context2.lineTo(headCenterX, headCenterY + radius * 3.5);
        context2.lineTo(headCenterX - radius, headCenterY + radius);
        context2.fill();
    }
    else if (type == 'type3') {
        context2.beginPath();
        context2.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
        context2.fillStyle = color;
        context2.fill();
        context2.beginPath();
        context2.moveTo(headCenterX - radius * 2, headCenterY + radius);
        context2.lineTo(headCenterX + radius * 2, headCenterY + radius);
        context2.lineTo(headCenterX, headCenterY + radius * 3.5);
        context2.lineTo(headCenterX - radius * 2, headCenterY + radius);
        context2.fill();
    }
    else if (type == 'type4') {
        context2.beginPath();
        context2.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
        context2.fillStyle = color;
        context2.fill();
        context2.beginPath();
        context2.ellipse(headCenterX, headCenterY + radius * 3, radius * 1.5, radius * 2.5, 0, 0, Math.PI, true);
        context2.fill();
    }
    else if (type == 'type5') {
        context2.beginPath();
        context2.fillStyle = color;
        context2.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
        context2.fill();
        context2.beginPath();
        context2.ellipse(headCenterX, headCenterY + radius * 3, radius / 2, radius * 4, 0, 0, Math.PI, true);
        context2.fill();
        context2.beginPath();
        context2.ellipse(headCenterX, headCenterY + radius * 3, radius * 1.5, radius * 1.5, 0, 0, Math.PI, true);
        context2.fill();
    }
    else if (type == 'type6') {
        context2.beginPath();
        context2.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
        context2.fillStyle = color;
        context2.fill();
        context2.beginPath();
        context2.ellipse(headCenterX, headCenterY + radius * 3, radius, radius * 2.5, 0, 0, Math.PI, true);
        context2.fill();
        context2.beginPath();
        context2.ellipse(headCenterX, headCenterY + radius * 3, radius * 1.5, radius * 1.5, 0, 0, Math.PI, true);
        context2.fill();
    }
    else if (type == 'type7') {
        context2.beginPath();
        context2.arc(headCenterX, headCenterY, radius, 0, 2 * Math.PI);
        context2.fillStyle = color;
        context2.fill();
        context2.beginPath();
        context2.moveTo(headCenterX, headCenterY + radius / 2);
        context2.lineTo(headCenterX - radius, headCenterY + radius * 3);
        context2.lineTo(headCenterX + radius, headCenterY + radius * 3);
        context2.lineTo(headCenterX, headCenterY + radius / 2);
        context2.fill();
        context2.beginPath();
        context2.ellipse(headCenterX, headCenterY + radius * 3, radius * +1.5, radius, 0, 0, Math.PI, true);
        context2.fill();
    }
}
exports.drawnPawnTypes = drawnPawnTypes;
function drawPawnImage(context2, headCenterX, headCenterY, radius, image) {
    context2.beginPath();
    context2.drawImage(image, headCenterX - radius, headCenterY - radius, radius * 2, radius * 3);
}
exports.drawPawnImage = drawPawnImage;
function drawActualPawnLook(player) {
    var style = Canvas_1.game.getPawnStyle().get(player);
    drawStyles(style.getColor());
}
