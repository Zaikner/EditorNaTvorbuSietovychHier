"use strict";
exports.__esModule = true;
exports.undoTileInsert = exports.spawnTile = exports.spawnElements = exports.removeAllListenersAdded = exports.removeAllButtons = exports.moveTiles = exports.deleteTiles = exports.editTiles = exports.insertTilesMenu = void 0;
var canvas_js_1 = require("./canvas.js");
var PathEditor_js_1 = require("./PathEditor.js");
var Elements_js_1 = require("./Elements.js");
var Warning_js_1 = require("./Warning.js");
var moveEventHandler = function (event) {
    canvas_js_1.editor.findTile(event);
    (0, canvas_js_1.reload)();
};
var deleteHandler = function (event) {
    canvas_js_1.editor.deleteTile(event);
    (0, canvas_js_1.reload)();
};
function spawnElements() {
    //$('#exampleModal').modal('toggle')
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Choose color of tile:');
    (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'colorPicker');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Tile size:');
    (0, Elements_js_1.spawnSliderWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'sizeOfTileSlider', '20', '50', '1', '30');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Tile have outline? (checkbox)');
    (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'outlineChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Choose color of outline:');
    (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'outlineColorPicker');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Outline size:');
    (0, Elements_js_1.spawnSliderWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'sizeOfOutlineSlider', '1', '10', '1', '3');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Choose shape:');
    (0, Elements_js_1.spawnSelectMenu)(canvas_js_1.doc, "tileEditingPlace", 'shapeMenu', ["btn", "btn-dark"], ['circle', 'square']);
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Tile have pattern from images? (checkbox)');
    (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'patternChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnImageInput)(canvas_js_1.doc, "tileEditingPlace", 'tilePattern', 'Choose a Pattern!', function () {
        if (canvas_js_1.doc.getElementById('tilePattern').files.length > 0) {
            canvas_js_1.editor.setPattern(new Image());
            canvas_js_1.editor.getPattern().src = URL.createObjectURL(canvas_js_1.doc.getElementById('tilePattern').files[0]);
        }
        else {
            canvas_js_1.editor.setPattern(undefined);
        }
    });
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Choose background image:');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Tile have background image? (checkbox)');
    (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'backgroundChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnImageInput)(canvas_js_1.doc, "tileEditingPlace", 'tileImage', 'Choose an Image!', function () {
        if (canvas_js_1.doc.getElementById('tileImage').files.length > 0) {
            canvas_js_1.editor.setImage(new Image());
            canvas_js_1.editor.getImage().src = URL.createObjectURL(canvas_js_1.doc.getElementById('tileImage').files[0]);
        }
        else {
            canvas_js_1.editor.setImage(undefined);
        }
    });
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'For whom is this starting tile? (choose players)');
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', canvas_js_1.editor.getGame().getPlayerTokens(), 'start');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'For whom is this finishing tile? (choose players)');
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', canvas_js_1.editor.getGame().getPlayerTokens(), 'end');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Which player can visit this tile? (choose players)');
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', canvas_js_1.editor.getGame().getPlayerTokens(), 'enabled');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Toogle tile numbering ingame? (checkbox)');
    (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'toogleNumberingChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Choose color of numbering:');
    (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'numberingColorPicker');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Choose tile number! (Insert a number into textfield)');
    (0, Elements_js_1.spawnNumberInput)(canvas_js_1.doc, "tileEditingPlace", 'tileNumberSetter');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Which number follows ?! (Insert a number into textfield)');
    (0, Elements_js_1.spawnNumberInput)(canvas_js_1.doc, "tileEditingPlace", 'tileFollowingSetter');
}
exports.spawnElements = spawnElements;
function insertTilesMenu() {
    canvas_js_1.doc.getElementById("canvasPlace").style.cursor = 'default';
    removeAllListenersAdded();
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)();
    removeAllButtons();
    canvas_js_1.canvas.addEventListener('click', moveEventHandler);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], 'Save!', saveInsertingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'drawPath', ["btn", "btn-dark"], 'Draw Path!!', PathEditor_js_1.editTrack);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'startInsertingButton', ["btn", "btn-dark"], 'Insert by one!', startInsertingByOne);
}
exports.insertTilesMenu = insertTilesMenu;
function startInsertingByOne() {
    canvas_js_1.doc.getElementById("canvasPlace").style.cursor = 'grabbing';
    removeAllButtons();
    removeAllListenersAdded();
    canvas_js_1.canvas.addEventListener('mousedown', insert);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'endInsertingButton', ["btn", "btn-dark"], 'Stop inserting!', insertTilesMenu);
    spawnElements();
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'undoButton', ["btn", "btn-dark"], 'Undo last Tile!', undoTileInsert);
}
function saveInsertingTiles() {
    removeAllButtons();
    removeAllListenersAdded();
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)();
    (0, canvas_js_1.mainMenu)();
}
function editTiles() {
    removeAllListenersAdded();
    canvas_js_1.canvas.addEventListener('click', moveEventHandler);
    removeAllButtons();
    canvas_js_1.editor.setIsMoving(false);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], 'Save!', saveEditingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Update', ["btn", "btn-dark"], 'Edit button!', update);
    spawnElements();
    setValues();
}
exports.editTiles = editTiles;
function saveEditingTiles() {
    removeAllButtons();
    removeAllListenersAdded();
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)();
    (0, canvas_js_1.mainMenu)();
}
function moveTiles() {
    //canvas.removeEventListener('click',moveEventHandler)
    (0, PathEditor_js_1.endDrawingPath)();
    canvas_js_1.doc.getElementById("canvasPlace").style.cursor = 'grabbing';
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)();
    canvas_js_1.editor.setIsMoving(true);
    removeAllButtons();
    canvas_js_1.canvas.addEventListener('click', moveEventHandler);
    canvas_js_1.canvas.addEventListener('mousemove', moveTile);
    canvas_js_1.canvas.addEventListener('mousedown', moveTile);
}
exports.moveTiles = moveTiles;
function deleteTiles() {
    canvas_js_1.doc.getElementById("canvasPlace").style.cursor = 'grabbing';
    removeAllListenersAdded();
    removeAllButtons();
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'End', ["btn", "btn-dark"], 'End deleting!', saveInsertingTiles);
    canvas_js_1.canvas.addEventListener('click', deleteHandler);
}
exports.deleteTiles = deleteTiles;
function removeAllButtons() {
    (0, canvas_js_1.elementDeleter)('buttonPlace');
    (0, canvas_js_1.elementDeleter)('numOfPlayersPlace');
    (0, canvas_js_1.elementDeleter)('gameTypePlace');
    (0, canvas_js_1.elementDeleter)('gameNamePlace');
    (0, canvas_js_1.elementDeleter)('tileEditingPlace');
}
exports.removeAllButtons = removeAllButtons;
function removeAllListenersAdded() {
    canvas_js_1.canvas.removeEventListener('mousemove', moveTile);
    canvas_js_1.canvas.removeEventListener('mousedown', moveTile);
    canvas_js_1.canvas.removeEventListener('mousedown', insert);
    canvas_js_1.canvas.removeEventListener('click', moveEventHandler);
    canvas_js_1.canvas.removeEventListener('click', deleteHandler);
    (0, PathEditor_js_1.endDrawingPath)();
}
exports.removeAllListenersAdded = removeAllListenersAdded;
function undoTileInsert() {
    canvas_js_1.editor.removeLastFromUndoLog();
    (0, canvas_js_1.reload)();
}
exports.undoTileInsert = undoTileInsert;
var insert = function (event) {
    var coords = (0, canvas_js_1.calibreEventCoords)(event);
    var canSpawn = true;
    if (document.getElementById('tileFollowingSetter').value.length > 0) {
        if (!canvas_js_1.editor.tileWithNumberExists(parseInt(document.getElementById('tileFollowingSetter').value))) {
            canSpawn = false;
            Warning_js_1.Warning.show("Following tile with that number doesn't exist");
        }
    }
    if (canSpawn) {
        var addedTile = spawnTile(coords);
        canvas_js_1.editor.addToUndoLog([addedTile]);
    }
};
var spawnTile = function (coords) {
    var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
    var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
    var outlineChecker = canvas_js_1.doc.getElementById('outlineChecker');
    var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
    var backgroundChecker = canvas_js_1.doc.getElementById('backgroundChecker');
    var patternChecker = canvas_js_1.doc.getElementById('patternChecker');
    var insertImage = canvas_js_1.editor.getImage();
    var pattImage = canvas_js_1.editor.getPattern();
    if (!backgroundChecker.checked) {
        insertImage = undefined;
    }
    if (!patternChecker.checked) {
        pattImage = undefined;
    }
    var addedTile = null;
    if (outlineChecker.checked) {
        addedTile = canvas_js_1.editor.initTile(coords, colorPicker.value, parseInt(sizeOfTileSlider.value), parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage, pattImage);
    }
    else {
        addedTile = canvas_js_1.editor.initTile(coords, colorPicker.value, parseInt(sizeOfTileSlider.value), 0, '', shapeMenu.value, insertImage, pattImage);
    }
    addedTile.setIsStartingFor(canvas_js_1.editor.getStartForPlayers());
    addedTile.setIsEndingFor(canvas_js_1.editor.getEndForPlayers());
    addedTile.setCanOccupy(canvas_js_1.editor.getEnabledForPlayers());
    addedTile.setToogleNumber(canvas_js_1.doc.getElementById('toogleNumberingChecker').checked);
    addedTile.setNumberingColor(canvas_js_1.doc.getElementById('numberingColorPicker').value);
    if (document.getElementById('tileNumberSetter').value.length > 0) {
        addedTile.setTileNumber(parseInt(document.getElementById('tileNumberSetter').value));
        var tileWithSameNumber = canvas_js_1.editor.getGame().getTiles()
            .filter(function (t) { return t.getTileNumber() === parseInt(document.getElementById('tileNumberSetter').value); });
        if (tileWithSameNumber.length > 0) {
            tileWithSameNumber[0].setTileNumber(canvas_js_1.editor.nextTileNumber());
        }
    }
    if (document.getElementById('tileFollowingSetter').value.length > 0) {
        addedTile.setFollowingTileNumber(parseInt(document.getElementById('tileFollowingSetter').value));
    }
    (0, canvas_js_1.reload)();
    console.log(addedTile);
    return addedTile;
};
exports.spawnTile = spawnTile;
var update = function () {
    var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
    var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
    var outlineChecker = canvas_js_1.doc.getElementById('outlineChecker');
    var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
    var backgroundChecker = canvas_js_1.doc.getElementById('backgroundChecker');
    var patternChecker = canvas_js_1.doc.getElementById('patternChecker');
    var insertImage = canvas_js_1.editor.getImage();
    var pattImage = canvas_js_1.editor.getPattern();
    if (!backgroundChecker.checked) {
        insertImage = undefined;
    }
    if (!patternChecker.checked) {
        pattImage = undefined;
    }
    canvas_js_1.editor.updateChoosenTile(colorPicker.value, parseInt(sizeOfTileSlider.value), outlineChecker.checked, parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage);
    canvas_js_1.editor.getChoosenTile().setIsStartingFor(canvas_js_1.editor.getStartForPlayers());
    canvas_js_1.editor.getChoosenTile().setIsEndingFor(canvas_js_1.editor.getEndForPlayers());
    canvas_js_1.editor.getChoosenTile().setCanOccupy(canvas_js_1.editor.getEnabledForPlayers());
    canvas_js_1.editor.getChoosenTile().setToogleNumber(canvas_js_1.doc.getElementById('toogleNumberingChecker').checked);
    canvas_js_1.editor.getChoosenTile().setNumberingColor(canvas_js_1.doc.getElementById('numberingColorPicker').value);
    canvas_js_1.editor.getChoosenTile().setPatternFile(pattImage);
    if (document.getElementById('tileNumberSetter').value.length > 0) {
        canvas_js_1.editor.getChoosenTile().setTileNumber(parseInt(document.getElementById('tileNumberSetter').value));
        var tileWithSameNumber = canvas_js_1.editor.getGame().getTiles()
            .filter(function (t) { return t.getTileNumber() === parseInt(document.getElementById('tileNumberSetter').value); });
        if (tileWithSameNumber.length > 0) {
            tileWithSameNumber[0].setTileNumber(canvas_js_1.editor.nextTileNumber());
        }
    }
    (0, canvas_js_1.reload)();
};
var setValues = function () {
    var _a, _b, _c;
    if (canvas_js_1.editor.getChoosenTile() != undefined) {
        var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
        var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
        var numberingColor = canvas_js_1.doc.getElementById('numberingColorPicker');
        var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
        var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
        var outlineChecker = canvas_js_1.doc.getElementById('outlineChecker');
        var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
        var backgroundChecker = canvas_js_1.doc.getElementById('backgroundChecker');
        var patternChecker = canvas_js_1.doc.getElementById('patternChecker');
        var toogleNumberingChecker = canvas_js_1.doc.getElementById('toogleNumberingChecker');
        var tileNumberSetter = canvas_js_1.doc.getElementById('tileNumberSetter');
        var tileFollowingSetter = canvas_js_1.doc.getElementById('tileFollowingSetter');
        var choosenTile = canvas_js_1.editor.getChoosenTile();
        colorPicker.value = choosenTile.getColor();
        numberingColor.value = choosenTile.getNumberingColor();
        sizeOfTileSlider.value = choosenTile.getRadius().toString();
        sizeOfOutlineSlider.value = choosenTile.getStroke().toString();
        outlineColorPicker.value = choosenTile.getStrokeColor();
        outlineChecker.checked = choosenTile.getStroke() > 0;
        tileNumberSetter.value = choosenTile.getTileNumber().toString();
        tileFollowingSetter.value = choosenTile.getFollowingTileNumber().toString();
        if (outlineChecker.checked) {
            canvas_js_1.doc.getElementById("outlineCheckerShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("outlineCheckerShower").textContent = 'no';
        }
        shapeMenu.value = choosenTile.getShape();
        backgroundChecker.checked = (((_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.getBackgroundFile()) != undefined);
        if (backgroundChecker.checked) {
            canvas_js_1.doc.getElementById("backgroundCheckerShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("backgroundCheckerShower").textContent = 'no';
        }
        patternChecker.checked = (((_b = canvas_js_1.editor.getChoosenTile()) === null || _b === void 0 ? void 0 : _b.getPatternFile()) != undefined);
        //console.log(doc.getElementById("patternCheckerShower")!)
        if (patternChecker.checked) {
            canvas_js_1.doc.getElementById("patternCheckerShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("patternCheckerShower").textContent = 'no';
        }
        toogleNumberingChecker.checked = (_c = canvas_js_1.editor.getChoosenTile()) === null || _c === void 0 ? void 0 : _c.getToggleNumber();
        if (toogleNumberingChecker.checked) {
            canvas_js_1.doc.getElementById("toogleNumberingCheckerShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("toogleNumberingCheckerShower").textContent = 'no';
        }
    }
};
var moveTile = function (event) {
    canvas_js_1.editor.moveTile(event);
    (0, canvas_js_1.reload)();
};
