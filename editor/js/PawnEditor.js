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
    (0, Elements_1.spawnSelectMenu)(canvas_1.doc, 'tileEditingPlace', 'playerSelect', [], canvas_1.editor.getGame().getPlayerTokens());
    (0, Elements_1.spawnCanvas)(canvas_1.doc, 'tileEditingPlace', 'pawnStyle');
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn color!');
    (0, Elements_1.spawnColorPicker)(canvas_1.doc, 'tileEditingPlace', 'pawnColorPicker');
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn type!');
    (0, Elements_1.spawnButton)(canvas_1.doc, 'tileEditingPlace', 'chooseType', ['btn', 'btn-secondary'], 'Choose type!', function () { $('#pawnModal').modal('show'); });
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn image!');
    (0, Elements_1.spawnImageInput)(canvas_1.doc, 'tileEditingPlace', 'imagePicker', 'Choose!', function () { });
    // spawnParagraph(doc,'tileEditingPlace','','Give an ID to pawn(so you can choose it, edit it and delete it)!')
}
exports.pawnEditMenu = pawnEditMenu;
function pawnDeleteMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
}
exports.pawnDeleteMenu = pawnDeleteMenu;
