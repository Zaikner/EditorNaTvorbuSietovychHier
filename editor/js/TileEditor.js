"use strict";
exports.__esModule = true;
exports.saveInsertingTiles = exports.undoTileInsert = exports.spawnTile = exports.spawnElements = exports.removeAllListenersAdded = exports.showActualState = exports.removeAllButtons = exports.moveTiles = exports.unchooseEverything = exports.deleteTiles = exports.editTiles = exports.pickTile = exports.insert = exports.startInsertingByOne = exports.copyNextTileMap = exports.moveEventHandler = exports.update = exports.TileEditor = void 0;
var Canvas_js_1 = require("./Canvas.js");
var ClientSocket_js_1 = require("./ClientSocket.js");
var Elements_js_1 = require("./Elements.js");
var PawnEditor_js_1 = require("./PawnEditor.js");
var Pawn_js_1 = require("./Pawn.js");
var lastSize = '30';
var lastColor = '#000000';
var lastOutline = '3';
var lastOutlineColor = '#000000';
var lastShape = 'circle';
var lastImage = undefined;
var TileEditor = /** @class */ (function () {
    function TileEditor() {
    }
    return TileEditor;
}());
exports.TileEditor = TileEditor;
var moveEventHandler = function (event) {
    Canvas_js_1.canvas.removeEventListener('mousemove', Canvas_js_1.game.moveTile);
    tilik = undefined;
    Canvas_js_1.canvas.removeEventListener('mousemove', moveWithTile);
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
};
exports.moveEventHandler = moveEventHandler;
var onlyMoveHandler = function (event) {
    Canvas_js_1.game.findTile(event, false);
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
};
var pickTile = function (event, token, value) {
    var _a;
    Canvas_js_1.game.findTile(event, false);
    if (Canvas_js_1.game.getChoosenTile() != undefined) {
        var pawn = Canvas_js_1.game.getChoosenTile().havePawnOnTile(token);
        if (pawn != undefined) {
            var params = new URLSearchParams(window.location.search);
            if (pawn.canMove(value)) {
                ClientSocket_js_1.editorSocket.emit('move pawns', { pawn: pawn.id, value: value, room: params.get('id') });
                Canvas_js_1.canvas.removeEventListener('click', ClientSocket_js_1.canMovePawnFunc);
            }
            else {
                (_a = Canvas_js_1.game.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setIsChoosen(false);
                Canvas_js_1.game.setChoosenTile(undefined);
            }
        }
    }
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
};
exports.pickTile = pickTile;
var copyTile = function (event) {
    var _a;
    removeAllButtons();
    spawnElements();
    Canvas_js_1.game.findTile(event, false);
    setValues(undefined, false);
    showActualState();
    (_a = Canvas_js_1.game.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setIsChoosen(false);
    Canvas_js_1.game.setChoosenTile(undefined);
    (0, Elements_js_1.spawnButton)(Canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], ClientSocket_js_1.texts[79], saveInsertingTiles);
    (0, Elements_js_1.spawnButton)(Canvas_js_1.doc, "buttonPlace", 'undoButton', ["btn", "btn-dark"], ClientSocket_js_1.texts[122], undoTileInsert);
    (0, Elements_js_1.spawnButton)(Canvas_js_1.doc, "buttonPlace", 'copyStyleButton', ["btn", "btn-dark"], ClientSocket_js_1.texts[123], copyTileStyle);
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
    Canvas_js_1.canvas.addEventListener('mousedown', insert);
};
var deleteHandler = function (event) {
    Canvas_js_1.game.deleteTile();
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
};
function spawnElements() {
    var _a;
    var options = [ClientSocket_js_1.texts[195]];
    Canvas_js_1.game.getPlayerTokens().slice().forEach(function (player) {
        options.push(player);
    });
    (0, Elements_js_1.spawnHeading)(document, 'tileEditingPlace', '', ClientSocket_js_1.texts[19]);
    var cs = (0, Elements_js_1.spawnCanvas)(Canvas_js_1.doc, 'tileEditingPlace', 'changeCanvas');
    cs.style.height = '100px';
    cs.style.width = '200px';
    cs.style.borderRadius = '20%';
    var colorPicker = (0, Elements_js_1.spawnColorPicker)(Canvas_js_1.doc, "tileEditingPlace", 'colorPicker', ClientSocket_js_1.texts[124]);
    colorPicker.value = lastColor;
    colorPicker.onchange = function () {
        Canvas_js_1.game.setImage(undefined);
        showActualState();
    };
    var sizeOfTileSlider = (0, Elements_js_1.spawnSliderWithValueShower)(Canvas_js_1.doc, "tileEditingPlace", 'sizeOfTileSlider', ClientSocket_js_1.texts[125], '20', '50', '1', lastSize);
    sizeOfTileSlider.onchange = function () { showActualState(); };
    var outlineColorPicker = (0, Elements_js_1.spawnColorPicker)(Canvas_js_1.doc, "tileEditingPlace", 'outlineColorPicker', ClientSocket_js_1.texts[127]);
    outlineColorPicker.onchange = function () { showActualState(); };
    outlineColorPicker.value = lastOutlineColor;
    var sizeOfOutlineSlider = (0, Elements_js_1.spawnSliderWithValueShower)(Canvas_js_1.doc, "tileEditingPlace", 'sizeOfOutlineSlider', ClientSocket_js_1.texts[128], '0', '10', '1', lastOutline);
    sizeOfOutlineSlider.onchange = function () { showActualState(); };
    var shapeMenu = (0, Elements_js_1.spawnSelectMenu)(Canvas_js_1.doc, "tileEditingPlace", 'shapeMenu', ClientSocket_js_1.texts[129], ["btn", "btn-dark"], ['circle', 'square']);
    shapeMenu.onchange = function () { showActualState(); };
    shapeMenu.value = lastShape;
    (0, Elements_js_1.spawnImageInput)(Canvas_js_1.doc, "tileEditingPlace", 'tileImage', ClientSocket_js_1.texts[134], ClientSocket_js_1.texts[134], function () {
        if (Canvas_js_1.doc.getElementById('tileImage').files.length > 0) {
            Canvas_js_1.game.setImage(new Image());
            Canvas_js_1.game.getImage().src = URL.createObjectURL(Canvas_js_1.doc.getElementById('tileImage').files[0]);
            Canvas_js_1.game.getImage().onload = function () {
                showActualState();
            };
        }
        else {
            Canvas_js_1.game.setImage(undefined);
        }
    });
    (0, Elements_js_1.spawnMultiSelect)(Canvas_js_1.doc, 'tileEditingPlace', 'startSelect', ClientSocket_js_1.texts[135], ClientSocket_js_1.texts[192], options, 'start');
    (0, Elements_js_1.spawnMultiSelect)(Canvas_js_1.doc, 'tileEditingPlace', 'EndSelect', ClientSocket_js_1.texts[136], ClientSocket_js_1.texts[192], options, 'end');
    (0, Elements_js_1.spawnButtonWithLabel)(Canvas_js_1.doc, "tileEditingPlace", 'setNextTileButton', ClientSocket_js_1.texts[141], ['btn', 'btn-dark'], ClientSocket_js_1.texts[208], function () {
        $('#nextTileModal').modal('show');
        generateNextTiles();
    });
    (0, Canvas_js_1.changeNextTileText)();
    (0, Elements_js_1.spawnMultiSelect)(document, 'tileEditingPlace', 'cantBeEleminated', ClientSocket_js_1.texts[143], ClientSocket_js_1.texts[192], options, 'immune');
    (0, Elements_js_1.spawnButtonWithLabel)(document, 'tileEditingPlace', 'bindEvent', ClientSocket_js_1.texts[98], ['btn', 'btn-dark'], ClientSocket_js_1.texts[174], function () {
        $('#EventModal').modal('show');
    });
    var p = (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', 'pickedEventParagraph', ClientSocket_js_1.texts[197], false);
    p.style.float = 'right';
    var div = document.createElement('div');
    div.id = 'wrapperDiv';
    div.style.textAlign = 'center';
    div.style.marginTop = '100px';
    div.style.width = '100%';
    (_a = document.getElementById('tileEditingPlace')) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    var button = (0, Elements_js_1.spawnButton)(document, 'wrapperDiv', 'removeTileButton', ['btn', 'btn-dark'], ClientSocket_js_1.texts[255], function () {
        Canvas_js_1.game.deleteTile();
        removeAllButtons();
        spawnElements();
        showActualState();
    });
    button.style.marginTop = '10%';
    button.style.textAlign = 'center';
    if (Canvas_js_1.game.getChoosenTile() == undefined) {
        document.getElementById('removeTileButton').hidden = true;
    }
}
exports.spawnElements = spawnElements;
var startX = 0;
var startY = 0;
var tilik = undefined;
var moveWithTile = function (event) {
    if (tilik != undefined) {
        var coords = (0, Canvas_js_1.calibreEventCoords)(event);
        Canvas_js_1.game.moveTile(event, tilik, startX - coords.x, startY - coords.y);
    }
};
var initMove = function (event) {
    var coords = (0, Canvas_js_1.calibreEventCoords)(event);
    startX = coords.x;
    startY = coords.y;
    var tiles = Canvas_js_1.game.getTiles();
    for (var i = tiles.length - 1; i >= 0; i--) {
        if (tiles[i].isPointedAt(coords.x, coords.y)) {
            tilik = tiles[i];
            break;
        }
    }
    Canvas_js_1.game.findTile(event, false);
};
function startInsertingByOne() {
    Canvas_js_1.game.nullEditor();
    removeAllButtons();
    removeAllListenersAdded();
    Canvas_js_1.canvas.addEventListener('mousedown', initMove);
    Canvas_js_1.canvas.addEventListener('mouseup', moveEventHandler);
    spawnElements();
    showActualState();
}
exports.startInsertingByOne = startInsertingByOne;
function copyTileStyle() {
    Canvas_js_1.game.nullEditor();
    removeAllButtons();
    removeAllListenersAdded();
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', ClientSocket_js_1.texts[147], true);
    document.getElementById('wholeBody').style.cursor = 'pointer';
    Canvas_js_1.canvas.addEventListener('click', copyTile);
}
function saveInsertingTiles() {
    removeAllButtons();
    removeAllListenersAdded();
    unchooseEverything();
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
    (0, Canvas_js_1.mainMenu)();
}
exports.saveInsertingTiles = saveInsertingTiles;
function editTiles() {
    Canvas_js_1.game.nullEditor();
    document.getElementById('removeTileButton').removeAttribute('hidden');
    Canvas_js_1.canvas.addEventListener('mousemove', moveWithTile);
    removeAllButtons();
    Canvas_js_1.game.setIsMoving(false);
    if (Canvas_js_1.game.getChoosenTile() != undefined) {
        Canvas_js_1.game.setStartForPlayers(Canvas_js_1.game.getChoosenTile().getIsStartingFor().slice());
        Canvas_js_1.game.setEndForPlayers(Canvas_js_1.game.getChoosenTile().getIsEndingFor().slice());
        Canvas_js_1.game.setCantBeEliminatedOnTile(Canvas_js_1.game.getChoosenTile().getCantBeEliminatedOnTile().slice());
    }
    spawnElements();
    setValues(undefined, true);
    showActualState(false);
}
exports.editTiles = editTiles;
function moveTiles() {
    removeAllListenersAdded();
    Canvas_js_1.game.makeAllTilesNotChoosen();
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
    Canvas_js_1.game.setIsMoving(true);
    removeAllButtons();
}
exports.moveTiles = moveTiles;
function deleteTiles() {
    removeAllListenersAdded();
    removeAllButtons();
    (0, Elements_js_1.spawnButton)(Canvas_js_1.doc, "buttonPlace", 'End', ["btn", "btn-dark"], ClientSocket_js_1.texts[90], saveInsertingTiles);
}
exports.deleteTiles = deleteTiles;
function removeAllButtons() {
    (0, Canvas_js_1.elementDeleter)('buttonPlace');
    (0, Canvas_js_1.elementDeleter)('numOfPlayersPlace');
    (0, Canvas_js_1.elementDeleter)('gameTypePlace');
    (0, Canvas_js_1.elementDeleter)('gameNamePlace');
    (0, Canvas_js_1.elementDeleter)('tileEditingPlace');
    (0, Canvas_js_1.elementDeleter)('questionPlace');
    (0, Canvas_js_1.elementDeleter)('headingPlace');
}
exports.removeAllButtons = removeAllButtons;
function removeAllListenersAdded() {
    Canvas_js_1.canvas.removeEventListener('mousemove', Canvas_js_1.game.moveTile);
    Canvas_js_1.canvas.removeEventListener('mousemove', moveTile);
    Canvas_js_1.canvas.removeEventListener('mousedown', moveTile);
    Canvas_js_1.canvas.removeEventListener('mousedown', initMove);
    Canvas_js_1.canvas.removeEventListener('mousedown', insert);
    Canvas_js_1.canvas.removeEventListener('mouseup', moveEventHandler);
    Canvas_js_1.canvas.removeEventListener('click', deleteHandler);
    Canvas_js_1.canvas.removeEventListener('click', PawnEditor_js_1.insertPawn);
    Canvas_js_1.canvas.removeEventListener('click', PawnEditor_js_1.deletePawn);
    Canvas_js_1.canvas.removeEventListener('click', copyTile);
    Canvas_js_1.canvas.removeEventListener('click', onlyMoveHandler);
    Canvas_js_1.canvas.style.cursor = 'default';
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
}
exports.removeAllListenersAdded = removeAllListenersAdded;
function unchooseEverything() {
    Canvas_js_1.game.makeAllTilesNotChoosen();
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
}
exports.unchooseEverything = unchooseEverything;
function undoTileInsert() {
    Canvas_js_1.game.removeLastFromUndoLog();
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
}
exports.undoTileInsert = undoTileInsert;
var insert = function (event) {
    unchooseEverything();
    Canvas_js_1.game.setChoosenTile(undefined);
    var coords = (0, Canvas_js_1.calibreEventCoords)(event);
    var canSpawn = true;
    if (canSpawn) {
        var addedTile = spawnTile(coords);
        console.log(addedTile);
        Canvas_js_1.game.addToUndoLog([addedTile]);
        addedTile.getIsStartingFor().forEach(function (player) {
            Canvas_js_1.game.insertPawns(player, addedTile);
        });
        showActualState();
        Canvas_js_1.game.setEvents('none', { num: 0, value: 0 });
        $('#editEventModal').modal('hide');
        $('#EventModal').modal('hide');
        (0, Canvas_js_1.elementDeleter)('askTheQuestionEventEdit');
        document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[197];
        Canvas_js_1.game.setStartForPlayers([]);
        Canvas_js_1.game.setCantBeEliminatedOnTile([]);
        Canvas_js_1.game.setEndForPlayers([]);
        removeAllButtons();
        spawnElements();
        showActualState();
    }
};
exports.insert = insert;
var spawnTile = function (coords) {
    var sizeOfTileSlider = Canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var colorPicker = Canvas_js_1.doc.getElementById('colorPicker');
    var sizeOfOutlineSlider = Canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = Canvas_js_1.doc.getElementById('outlineColorPicker');
    var shapeMenu = Canvas_js_1.doc.getElementById('shapeMenu');
    var insertImage = Canvas_js_1.game.getImage();
    var addedTile = Canvas_js_1.game.initTile(true, coords, colorPicker.value, parseInt(sizeOfTileSlider.value), parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage);
    addedTile.setIsStartingFor(Canvas_js_1.game.getStartForPlayers().slice());
    addedTile.setIsEndingFor(Canvas_js_1.game.getEndForPlayers().slice());
    addedTile.setCantBeEliminatedOnTile(Canvas_js_1.game.getCantBeEliminatedOnTile().slice());
    addedTile.setSkip(Canvas_js_1.game.getSkip());
    addedTile.setRepeat(Canvas_js_1.game.getRepeat());
    addedTile.setForward(Canvas_js_1.game.getForward());
    addedTile.setBackward(Canvas_js_1.game.getBackward());
    addedTile.setMustThrown(Canvas_js_1.game.getMustThrown());
    addedTile.setQuestionId(Canvas_js_1.game.getQuestionId());
    addedTile.setRandomQuestion(Canvas_js_1.game.getRandomQuestion());
    addedTile.setNextTilesIds(returnNextTileMap());
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
    return addedTile;
};
exports.spawnTile = spawnTile;
var update = function () {
    var _a, _b;
    var sizeOfTileSlider = Canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var colorPicker = Canvas_js_1.doc.getElementById('colorPicker');
    var sizeOfOutlineSlider = Canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = Canvas_js_1.doc.getElementById('outlineColorPicker');
    var shapeMenu = Canvas_js_1.doc.getElementById('shapeMenu');
    var insertImage = Canvas_js_1.game.getImage();
    Canvas_js_1.game.updateChoosenTile(colorPicker.value, parseInt(sizeOfTileSlider.value), parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage);
    Canvas_js_1.game.getChoosenTile().setIsStartingFor(Canvas_js_1.game.getStartForPlayers().slice());
    Canvas_js_1.game.getChoosenTile().setIsEndingFor(Canvas_js_1.game.getEndForPlayers().slice());
    Canvas_js_1.game.getChoosenTile().setCantBeEliminatedOnTile(Canvas_js_1.game.getCantBeEliminatedOnTile().slice());
    (_a = Canvas_js_1.game.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setPawns([]);
    (_b = Canvas_js_1.game.getChoosenTile()) === null || _b === void 0 ? void 0 : _b.getIsStartingFor().forEach(function (player) {
        for (var i = 0; i < Canvas_js_1.game.getNumberOfStartingPawns(); i++) {
            Canvas_js_1.game.getPawns().push(new Pawn_js_1.Pawn(player, Canvas_js_1.game.getChoosenTile()));
        }
    });
    Canvas_js_1.game.getChoosenTile().setSkip(Canvas_js_1.game.getSkip());
    Canvas_js_1.game.getChoosenTile().setRepeat(Canvas_js_1.game.getRepeat());
    Canvas_js_1.game.getChoosenTile().setForward(Canvas_js_1.game.getForward());
    Canvas_js_1.game.getChoosenTile().setBackward(Canvas_js_1.game.getBackward());
    Canvas_js_1.game.getChoosenTile().setMustThrown(Canvas_js_1.game.getMustThrown());
    Canvas_js_1.game.getChoosenTile().setQuestionId(Canvas_js_1.game.getQuestionId());
    Canvas_js_1.game.getChoosenTile().setRandomQuestion(Canvas_js_1.game.getRandomQuestion());
    Canvas_js_1.game.getChoosenTile().getPawns().forEach(function (pawn) {
        var _a;
        if (!Canvas_js_1.game.getChoosenTile().getIsStartingFor().includes(pawn.player)) {
            (_a = Canvas_js_1.game.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.removePawn(pawn);
            Canvas_js_1.game.removePawn(pawn);
        }
    });
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
};
exports.update = update;
var setValues = function (tile, copyNumber) {
    if (tile == undefined) {
        tile = Canvas_js_1.game.getChoosenTile();
    }
    if (tile != undefined) {
        Canvas_js_1.game.setSkip(tile.getSkip());
        Canvas_js_1.game.setRepeat(tile.getRepeat());
        Canvas_js_1.game.setForward(tile.getForward());
        Canvas_js_1.game.setBackward(tile.getBackward());
        Canvas_js_1.game.setMustThrown(tile.getMustThrown());
        Canvas_js_1.game.setQuestionId(tile.getQuestionId());
        Canvas_js_1.game.setRandomQuestion(tile.getRandomQuestion());
        var sizeOfTileSlider = Canvas_js_1.doc.getElementById('sizeOfTileSlider');
        var sizeOfTileSliderShower = Canvas_js_1.doc.getElementById('sizeOfTileSliderShower');
        var colorPicker = Canvas_js_1.doc.getElementById('colorPicker');
        var sizeOfOutlineSlider = Canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
        var sizeOfOutlineSliderShower = Canvas_js_1.doc.getElementById('sizeOfOutlineSliderShower');
        var outlineColorPicker = Canvas_js_1.doc.getElementById('outlineColorPicker');
        var shapeMenu = Canvas_js_1.doc.getElementById('shapeMenu');
        colorPicker.value = tile.getColor();
        sizeOfTileSlider.value = tile.getRadius().toString();
        sizeOfTileSliderShower.textContent = tile.getRadius().toString();
        sizeOfOutlineSlider.value = tile.getStroke().toString();
        sizeOfOutlineSliderShower.textContent = tile.getStroke().toString();
        outlineColorPicker.value = tile.getStrokeColor();
        if (tile.getSkip() != 0) {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[105] + tile.getSkip() + ClientSocket_js_1.texts[100];
        }
        else if (tile.getRepeat() != 0) {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[108] + tile.getRepeat() + ClientSocket_js_1.texts[100];
        }
        else if (tile.getForward() != 0) {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[99] + tile.getForward() + ClientSocket_js_1.texts[100];
        }
        else if (tile.getBackward() != 0) {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[103] + tile.getBackward() + ClientSocket_js_1.texts[100];
        }
        else if (tile.getMustThrown() != 0) {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[110] + tile.getMustThrown() + ClientSocket_js_1.texts[111];
        }
        else if (tile.getQuestionId() != -1) {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[71] + Canvas_js_1.game.getQuestions().get(tile.getQuestionId());
        }
        else if (tile.getRandomQuestion()) {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[201];
        }
        else {
            document.getElementById('pickedEventParagraph').textContent = ClientSocket_js_1.texts[197];
        }
        shapeMenu.value = tile.getShape();
    }
    else {
        Canvas_js_1.doc.getElementById('sizeOfTileSlider').value = lastSize;
        Canvas_js_1.doc.getElementById('colorPicker').value = lastColor;
        Canvas_js_1.doc.getElementById('sizeOfOutlineSlider').value = lastOutline;
        Canvas_js_1.doc.getElementById('outlineColorPicker').value = lastOutlineColor;
        Canvas_js_1.doc.getElementById('shapeMenu').value = lastShape;
    }
    return tile;
};
var moveTile = function (event) {
    Canvas_js_1.game.moveTile(event);
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
};
function showActualState(updateTile) {
    if (updateTile === void 0) { updateTile = true; }
    if (Canvas_js_1.game.getChoosenTile() && updateTile) {
        update();
    }
    var cs = document.getElementById('changeCanvas');
    var cttttx = cs.getContext("2d");
    (0, Canvas_js_1.reload)(cttttx);
    var width = cs.width;
    var height = cs.height;
    var sizeOfTileSlider = Canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var image = Canvas_js_1.game.getImage();
    if (Canvas_js_1.game.getChoosenTile() != undefined) {
        image = Canvas_js_1.game.getChoosenTile().getImage();
        Canvas_js_1.game.setImage(image);
    }
    var colorPicker = Canvas_js_1.doc.getElementById('colorPicker');
    var sizeOfOutlineSlider = Canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = Canvas_js_1.doc.getElementById('outlineColorPicker');
    var shapeMenu = Canvas_js_1.doc.getElementById('shapeMenu');
    var stroke = parseInt(sizeOfOutlineSlider.value);
    var tile = Canvas_js_1.game.initTile(false, { x: width / 2, y: height / 2 }, colorPicker.value, parseInt(sizeOfTileSlider.value), stroke, outlineColorPicker.value, shapeMenu.value, image);
    if (Canvas_js_1.game.getChoosenTile() != undefined) {
        tile.setTileNumber(Canvas_js_1.game.getChoosenTile().getTileNumber());
    }
    tile.setImage(image);
    cttttx.clearRect(0, 0, cs.width, cs.height);
    cttttx.resetTransform();
    tile.drawTile(cs, document.getElementById('changeCanvas').getContext("2d"));
    (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
    if (Canvas_js_1.game.getChoosenTile() == undefined) {
        lastSize = sizeOfTileSlider.value;
        lastColor = colorPicker.value;
        lastOutline = sizeOfOutlineSlider.value;
        lastOutlineColor = outlineColorPicker.value;
        lastShape = shapeMenu.value;
    }
}
exports.showActualState = showActualState;
function generateNextTiles() {
    (0, Canvas_js_1.elementDeleter)('nextTileModalBody');
    Canvas_js_1.game.getPlayerTokens().forEach(function (token) {
        var div = document.createElement('div');
        div.id = 'div' + token;
        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'nextTile' + token;
        if (Canvas_js_1.game.getChoosenTile() != undefined) {
            input.value = Canvas_js_1.game.getChoosenTile().getNextTilesIds().get(token).toString();
        }
        else {
            input.value = Canvas_js_1.game.getNextTilesIds().get(token).toString();
        }
        document.getElementById('nextTileModalBody').appendChild(div);
        (0, Elements_js_1.spawnParagraph)(document, 'div' + token, '', ClientSocket_js_1.texts[148] + token + ClientSocket_js_1.texts[149], false);
        div.appendChild(input);
    });
}
function returnNextTileMap() {
    var ret = new Map();
    Array.from(Canvas_js_1.game.getNextTilesIds().entries()).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        ret.set(key, value);
        Canvas_js_1.game.getNextTilesIds().set(key, value + 1);
    });
    return ret;
}
function copyNextTileMap() {
    var ret = new Map();
    Array.from(Canvas_js_1.game.getNextTilesIds().entries()).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        ret.set(key, value);
    });
    return ret;
}
exports.copyNextTileMap = copyNextTileMap;
