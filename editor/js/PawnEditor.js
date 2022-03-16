"use strict";
exports.__esModule = true;
exports.pawnMenu = void 0;
var canvas_1 = require("./canvas");
var Elements_1 = require("./Elements");
var Pawn_1 = require("./Pawn");
var TileEditor_1 = require("./TileEditor");
function pawnMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, TileEditor_1.removeAllButtons)();
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Configure your Pawn, and click on tile to insert it!');
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn color!');
    (0, Elements_1.spawnColorPicker)(canvas_1.doc, 'tileEditingPlace', 'pawnColorPicker');
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Choose pawn image!');
    (0, Elements_1.spawnImageInput)(canvas_1.doc, 'tileEditingPlace', 'imagePicker', 'Choose!', function () { });
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'Give an ID to pawn(so you can choose it, edit it and delete it)!');
    (0, Elements_1.spawnParagraph)(canvas_1.doc, 'tileEditingPlace', '', 'To which player it belong?');
    (0, Elements_1.spawnSelectMenu)(canvas_1.doc, 'tileEditingPlace', '', [], canvas_1.editor.getGame().getPlayerTokens());
    canvas_1.canvas.addEventListener('click', insertPawn);
}
exports.pawnMenu = pawnMenu;
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
        var newPawn = new Pawn_1.Pawn(1, 'player1', tile);
        newPawn.color = colorPicker.value;
        canvas_1.editor.getGame().getPawns().push(newPawn);
        (0, TileEditor_1.removeAllListenersAdded)();
        (0, canvas_1.reload)(canvas_1.editor, canvas_1.ctx);
    }
}
