"use strict";
exports.__esModule = true;
exports.saveInsertingTiles = exports.undoTileInsert = exports.spawnTile = exports.spawnElements = exports.removeAllListenersAdded = exports.showActualState = exports.removeAllButtons = exports.moveTiles = exports.unchooseEverything = exports.deleteTiles = exports.editTiles = exports.pickTile = exports.moveEventHandler = exports.insertTilesMenu = void 0;
var canvas_js_1 = require("./canvas.js");
var PathEditor_js_1 = require("./PathEditor.js");
var Elements_js_1 = require("./Elements.js");
var Warning_js_1 = require("./Warning.js");
var PawnEditor_js_1 = require("./PawnEditor.js");
var Pawn_js_1 = require("./Pawn.js");
var BackgroundEditor_js_1 = require("./BackgroundEditor.js");
var moveEventHandler = function (event) {
    canvas_js_1.editor.findTile(event, true);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
exports.moveEventHandler = moveEventHandler;
var onlyMoveHandler = function (event) {
    canvas_js_1.editor.findTile(event, false);
    console.log('zavolal only move');
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
var pickTile = function (event, token, value) {
    var _a;
    canvas_js_1.editor.findTile(event, false);
    console.log('aspon spustil pickTile');
    if (canvas_js_1.editor.getChoosenTile() != undefined) {
        var pawn = canvas_js_1.editor.getChoosenTile().havePawnOnTile(token);
        console.log('aspon vybral');
        if (pawn != undefined) {
            //'TU RADSEJ EMITOVAT NA SERVER, NECH VSSETKYCH ODSTRANI'
            //'AAAA NEZABUDNI NA LISTERNER'
            //editor.getGame().movePawnById(pawn.id,value)
            var params = new URLSearchParams(window.location.search);
            if (pawn.canMove(value)) {
                console.log('can move, teda pohol');
                canvas_js_1.editorSocket.emit('move pawns', { pawn: pawn.id, value: value, room: params.get('id') });
                canvas_js_1.canvas.removeEventListener('click', canvas_js_1.canMovePawnFunc);
            }
            else {
                console.log('nepohol, teda odnuluje');
                (_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setIsChoosen(false);
                canvas_js_1.editor.setChoosenTile(undefined);
            }
            //(msg:{room:string,pawn:number,value:number})
            console.log('pohol s panacikom');
        }
    }
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
exports.pickTile = pickTile;
var copyTile = function (event) {
    var _a;
    removeAllButtons();
    spawnElements();
    canvas_js_1.editor.findTile(event, false);
    setValues(undefined, false);
    showActualState();
    (_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setIsChoosen(false);
    canvas_js_1.editor.setChoosenTile(undefined);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], canvas_js_1.texts[79], saveInsertingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'endInsertingButton', ["btn", "btn-dark"], canvas_js_1.texts[121], insertTilesMenu);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'undoButton', ["btn", "btn-dark"], canvas_js_1.texts[122], undoTileInsert);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'copyStyleButton', ["btn", "btn-dark"], canvas_js_1.texts[123], copyTileStyle);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    canvas_js_1.canvas.addEventListener('mousedown', insert);
};
var deleteHandler = function (event) {
    canvas_js_1.editor.deleteTile(event);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
function spawnElements() {
    //$('#exampleModal').modal('toggle')
    (0, Elements_js_1.spawnCanvas)(canvas_js_1.doc, 'tileEditingPlace', 'changeCanvas');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[124]);
    var colorPicker = (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'colorPicker');
    colorPicker.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[125]);
    var sizeOfTileSlider = (0, Elements_js_1.spawnSliderWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'sizeOfTileSlider', '20', '50', '1', '30');
    sizeOfTileSlider.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[126]);
    var outlineChecker = (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'outlineChecker', false, ['no', 'yes']);
    outlineChecker.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[127]);
    var outlineColorPicker = (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'outlineColorPicker');
    outlineColorPicker.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[128]);
    var sizeOfOutlineSlider = (0, Elements_js_1.spawnSliderWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'sizeOfOutlineSlider', '1', '10', '1', '3');
    sizeOfOutlineSlider.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[129]);
    var shapeMenu = (0, Elements_js_1.spawnSelectMenu)(canvas_js_1.doc, "tileEditingPlace", 'shapeMenu', ["btn", "btn-dark"], ['circle', 'square']);
    shapeMenu.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[130]);
    var patternChecker = (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'patternChecker', false, ['no', 'yes']);
    patternChecker.onchange = showActualState;
    (0, Elements_js_1.spawnImageInput)(canvas_js_1.doc, "tileEditingPlace", 'tilePattern', canvas_js_1.texts[131], function () {
        if (canvas_js_1.doc.getElementById('tilePattern').files.length > 0) {
            canvas_js_1.editor.setPattern(new Image());
            canvas_js_1.editor.getPattern().src = URL.createObjectURL(canvas_js_1.doc.getElementById('tilePattern').files[0]);
            canvas_js_1.editor.getPattern().onload = function () {
                showActualState();
            };
        }
        else {
            canvas_js_1.editor.setPattern(undefined);
        }
    });
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[132]);
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[133]);
    var backgroundChecker = (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'backgroundChecker', false, ['no', 'yes']);
    backgroundChecker.onchange = showActualState;
    (0, Elements_js_1.spawnImageInput)(canvas_js_1.doc, "tileEditingPlace", 'tileImage', canvas_js_1.texts[134], function () {
        if (canvas_js_1.doc.getElementById('tileImage').files.length > 0) {
            canvas_js_1.editor.setImage(new Image());
            canvas_js_1.editor.getImage().src = URL.createObjectURL(canvas_js_1.doc.getElementById('tileImage').files[0]);
            canvas_js_1.editor.getImage().onload = function () {
                showActualState();
            };
        }
        else {
            canvas_js_1.editor.setImage(undefined);
        }
    });
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[135]);
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', canvas_js_1.editor.getGame().getPlayerTokens(), 'start');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[136]);
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', canvas_js_1.editor.getGame().getPlayerTokens(), 'end');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', 'Which player can visit this tile? (choose players)');
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', canvas_js_1.editor.getGame().getPlayerTokens(), 'enabled');
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[137]);
    (0, Elements_js_1.spawnCheckerWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'toogleNumberingChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[138]);
    var numberingColorPicker = (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'numberingColorPicker');
    numberingColorPicker.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[139]);
    var tileNumberSetter = (0, Elements_js_1.spawnNumberInput)(canvas_js_1.doc, "tileEditingPlace", 'tileNumberSetter');
    tileNumberSetter.onchange = showActualState;
    (0, Elements_js_1.spawnParagraph)(canvas_js_1.doc, "tileEditingPlace", '', canvas_js_1.texts[140]);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "tileEditingPlace", 'setNextTileButton', ['btn', 'btn-secondary'], canvas_js_1.texts[141], function () {
        $('#nextTileModal').modal('show');
        generateNextTiles();
    });
    //spawnNumberInput(doc,"tileEditingPlace",'tileFollowingSetter')
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', canvas_js_1.texts[142]);
    (0, Elements_js_1.spawnCheckerWithValueShower)(document, 'tileEditingPlace', 'eleminationChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', canvas_js_1.texts[143]);
    (0, Elements_js_1.spawnMultiSelect)(document, 'tileEditingPlace', 'cantBeEleminated', canvas_js_1.editor.getGame().getPlayerTokens(), 'immune');
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', canvas_js_1.texts[144]);
    var questionChecker = (0, Elements_js_1.spawnCheckerWithValueShower)(document, 'tileEditingPlace', 'askQuestionChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', canvas_js_1.texts[72]);
    (0, Elements_js_1.spawnButton)(document, 'tileEditingPlace', 'bindQuestion', ['btn', 'btn-secondary'], canvas_js_1.texts[114], function () {
        if (!questionChecker.checked) {
            Warning_js_1.Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.');
        }
        else {
            canvas_js_1.editorSocket.emit('loadQuestions');
            $('#pickQuestionModal').modal('show');
        }
    });
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', 'pickedQuestionParagraph', canvas_js_1.texts[145]);
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', canvas_js_1.texts[146]);
    var eventChecker = (0, Elements_js_1.spawnCheckerWithValueShower)(document, 'tileEditingPlace', 'eventChecker', false, ['no', 'yes']);
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', canvas_js_1.texts[98]);
    (0, Elements_js_1.spawnButton)(document, 'tileEditingPlace', 'bindEvent', ['btn', 'btn-secondary'], canvas_js_1.texts[114], function () {
        if (!eventChecker.checked) {
            Warning_js_1.Warning.show('Adding event is not allowed. If you want to enable it, it can be enabled by ticking "Does event occur when moving to this tile ???" checkkox.');
        }
        else {
            $('#EventModal').modal('show');
        }
        // if (!questionChecker.checked){
        //   Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.')
        // }
        // else{
        //   editorSocket.emit('loadQuestions')
        //   $('#pickQuestionModal').modal('show');
        // }
        //$('#EventModal').modal('show');
    });
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', 'pickedEventParagraph', 'Picked Event: None');
}
exports.spawnElements = spawnElements;
function insertTilesMenu() {
    //unchooseEverything()
    //doc.getElementById("canvasPlace")!.style.cursor = 'default'
    removeAllListenersAdded();
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    removeAllButtons();
    canvas_js_1.canvas.addEventListener('click', moveEventHandler);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], canvas_js_1.texts[79], saveInsertingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'drawPath', ["btn", "btn-dark"], canvas_js_1.texts[26], PathEditor_js_1.editTrack);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'startInsertingButton', ["btn", "btn-dark"], canvas_js_1.texts[27], startInsertingByOne);
}
exports.insertTilesMenu = insertTilesMenu;
function startInsertingByOne() {
    canvas_js_1.editor.nullEditor();
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllButtons();
    removeAllListenersAdded();
    canvas_js_1.canvas.addEventListener('mousedown', insert);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], canvas_js_1.texts[79], saveInsertingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'endInsertingButton', ["btn", "btn-dark"], canvas_js_1.texts[28], insertTilesMenu);
    spawnElements();
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'undoButton', ["btn", "btn-dark"], canvas_js_1.texts[122], undoTileInsert);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'copyStyleButton', ["btn", "btn-dark"], canvas_js_1.texts[123], copyTileStyle);
    showActualState();
}
function copyTileStyle() {
    canvas_js_1.editor.nullEditor();
    removeAllButtons();
    removeAllListenersAdded();
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', canvas_js_1.texts[147]);
    document.getElementById('wholeBody').style.cursor = 'pointer';
    //canvas.style.cursor = 'pointer'
    //document.getElementById('optionPlace')!.style.cursor = 'pointer'
    canvas_js_1.canvas.addEventListener('click', copyTile);
}
function saveInsertingTiles() {
    removeAllButtons();
    removeAllListenersAdded();
    unchooseEverything();
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    (0, canvas_js_1.mainMenu)();
}
exports.saveInsertingTiles = saveInsertingTiles;
function editTiles() {
    console.log('zavolal update');
    canvas_js_1.editor.nullEditor();
    removeAllListenersAdded();
    canvas_js_1.canvas.addEventListener('click', moveEventHandler);
    removeAllButtons();
    canvas_js_1.editor.setIsMoving(false);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], canvas_js_1.texts[79], saveEditingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Update', ["btn", "btn-dark"], canvas_js_1.texts[64], update);
    if (canvas_js_1.editor.getChoosenTile() != undefined) {
        canvas_js_1.editor.setStartForPlayers(canvas_js_1.editor.getChoosenTile().getIsStartingFor().slice());
        canvas_js_1.editor.setEndForPlayers(canvas_js_1.editor.getChoosenTile().getIsEndingFor().slice());
        canvas_js_1.editor.setEnabledForPlayers(canvas_js_1.editor.getChoosenTile().getCanOccupy().slice());
    }
    spawnElements();
    setValues(undefined, true);
    showActualState();
}
exports.editTiles = editTiles;
function saveEditingTiles() {
    removeAllButtons();
    removeAllListenersAdded();
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    (0, canvas_js_1.mainMenu)();
}
function moveTiles() {
    //canvas.removeEventListener('click',moveEventHandler)
    removeAllListenersAdded();
    (0, PathEditor_js_1.endDrawingPath)();
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    canvas_js_1.editor.setIsMoving(true);
    removeAllButtons();
    canvas_js_1.canvas.addEventListener('click', onlyMoveHandler);
    canvas_js_1.canvas.addEventListener('mousemove', moveTile);
    canvas_js_1.canvas.addEventListener('mousedown', moveTile);
}
exports.moveTiles = moveTiles;
function deleteTiles() {
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllListenersAdded();
    removeAllButtons();
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'End', ["btn", "btn-dark"], canvas_js_1.texts[90], saveInsertingTiles);
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
    (0, BackgroundEditor_js_1.removeAllComponentListeners)();
    canvas_js_1.canvas.removeEventListener('mousemove', moveTile);
    canvas_js_1.canvas.removeEventListener('mousedown', moveTile);
    canvas_js_1.canvas.removeEventListener('mousedown', insert);
    canvas_js_1.canvas.removeEventListener('click', moveEventHandler);
    canvas_js_1.canvas.removeEventListener('click', deleteHandler);
    canvas_js_1.canvas.removeEventListener('click', PawnEditor_js_1.insertPawn);
    canvas_js_1.canvas.removeEventListener('click', PawnEditor_js_1.deletePawn);
    canvas_js_1.canvas.removeEventListener('click', copyTile);
    canvas_js_1.canvas.removeEventListener('click', onlyMoveHandler);
    (0, PathEditor_js_1.endDrawingPath)();
    //document.getElementById('wholeBody')!.style.cursor = 'default'
    canvas_js_1.canvas.style.cursor = 'default';
    //document.getElementById('optionPlace')!.style.cursor = 'default'
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
}
exports.removeAllListenersAdded = removeAllListenersAdded;
function unchooseEverything() {
    canvas_js_1.editor.makeAllTilesNotChoosen();
    canvas_js_1.editor.getGame().getBackground().makeAllComponentsNotChoosen();
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
}
exports.unchooseEverything = unchooseEverything;
function undoTileInsert() {
    canvas_js_1.editor.removeLastFromUndoLog();
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
}
exports.undoTileInsert = undoTileInsert;
var insert = function (event) {
    canvas_js_1.editor.setChoosenTile(undefined);
    var coords = (0, canvas_js_1.calibreEventCoords)(event);
    var canSpawn = true;
    // if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
    //   if (!editor.tileWithNumberExists(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))){
    //     canSpawn = false
    //     Warning.show("Following tile with that number doesn't exist")
    //   }
    // }
    if (canSpawn) {
        var addedTile = spawnTile(coords);
        canvas_js_1.editor.addToUndoLog([addedTile]);
        addedTile.getIsStartingFor().forEach(function (player) {
            canvas_js_1.editor.getGame().insertPawns(player, addedTile);
        });
        showActualState();
    }
    console.log(canvas_js_1.editor.getGame());
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
    var addedTile;
    if (outlineChecker.checked) {
        addedTile = canvas_js_1.editor.initTile(true, coords, colorPicker.value, parseInt(sizeOfTileSlider.value), parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage, pattImage);
    }
    else {
        addedTile = canvas_js_1.editor.initTile(true, coords, colorPicker.value, parseInt(sizeOfTileSlider.value), 0, '', shapeMenu.value, insertImage, pattImage);
    }
    addedTile.setIsStartingFor(canvas_js_1.editor.getStartForPlayers().slice());
    addedTile.setIsEndingFor(canvas_js_1.editor.getEndForPlayers().slice());
    addedTile.setCanOccupy(canvas_js_1.editor.getEnabledForPlayers().slice());
    addedTile.setToogleNumber(canvas_js_1.doc.getElementById('toogleNumberingChecker').checked);
    addedTile.setNumberingColor(canvas_js_1.doc.getElementById('numberingColorPicker').value);
    addedTile.setCantBeEliminatedOnTile(canvas_js_1.editor.getCantBeEliminatedOnTile().slice());
    if (document.getElementById('eventChecker').checked) {
        addedTile.setSkip(canvas_js_1.editor.getSkip());
        addedTile.setRepeat(canvas_js_1.editor.getRepeat());
        addedTile.setForward(canvas_js_1.editor.getForward());
        addedTile.setBackward(canvas_js_1.editor.getBackward());
        addedTile.setMustThrown(canvas_js_1.editor.getMustThrown());
        addedTile.setTurnsToSetFree(canvas_js_1.editor.getTurnsToSetFree());
    }
    else {
        addedTile.setSkip(0);
        addedTile.setRepeat(0);
        addedTile.setForward(0);
        addedTile.setBackward(0);
        addedTile.setMustThrown(0);
        addedTile.setTurnsToSetFree(0);
    }
    if (document.getElementById('tileNumberSetter').value.length > 0) {
        addedTile.setTileNumber(parseInt(document.getElementById('tileNumberSetter').value));
        var tileWithSameNumber = canvas_js_1.editor.getGame().getTiles()
            .filter(function (t) { return t != addedTile && t.getTileNumber() === parseInt(document.getElementById('tileNumberSetter').value); });
        if (tileWithSameNumber.length > 0) {
            tileWithSameNumber[0].setTileNumber(canvas_js_1.editor.nextTileNumber());
        }
    }
    // if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
    //   addedTile.setFollowingTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))    
    // }
    if (document.getElementById('askQuestionChecker').checked) {
        addedTile.setQuestionId(canvas_js_1.editor.getQuestionId());
    }
    else {
        addedTile.setQuestionId(-1);
    }
    addedTile.setNextTilesIds(returnNextTileMap());
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    console.log(addedTile);
    console.log(canvas_js_1.editor);
    return addedTile;
};
exports.spawnTile = spawnTile;
var update = function () {
    var _a, _b, _c, _d, _e;
    console.log('zavolal update');
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
    (_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setPawns([]);
    (_b = canvas_js_1.editor.getChoosenTile()) === null || _b === void 0 ? void 0 : _b.getIsStartingFor().forEach(function (player) {
        for (var i = 0; i < canvas_js_1.editor.getGame().getNumberOfStartingPawns(); i++) {
            canvas_js_1.editor.getGame().getPawns().push(new Pawn_js_1.Pawn(player, canvas_js_1.editor.getChoosenTile()));
        }
    });
    // let set:Set<string> = new Set()
    // editor.getGame().getPawns().forEach((pawn:Pawn)=>{
    //   set.add(pawn.player)
    // })
    // editor.getChoosenTile()?.getIsStartingFor().forEach((player:string)=>{
    //   set.delete(player)
    // })
    // set.forEach((player:string)=>{
    //   for (let i = 0;i<editor.getGame().getNumberOfStartingPawns();i++){
    //     editor.getGame().getPawns().push(new Pawn(player,editor.getChoosenTile()!))
    //   }
    // })
    // editor.getStartForPlayers().forEach((player:string)=>{
    //   if( !editor.getChoosenTile()!.getIsStartingFor().includes(player)){
    //     for (let i = 0;i<editor.getGame().getNumberOfStartingPawns();i++){
    //       editor.getGame().getPawns().push(new Pawn(player,editor.getChoosenTile()!))
    //     }
    //   }
    //   else{
    //     console.log(player + ' sa nachadza v ')
    //     console.log(editor.getChoosenTile()!.getIsStartingFor())
    //     console.log(editor.getStartForPlayers())
    //   }
    // })
    console.log(canvas_js_1.editor.getChoosenTile());
    console.log(canvas_js_1.editor.getStartForPlayers().slice());
    canvas_js_1.editor.getChoosenTile().setIsStartingFor(canvas_js_1.editor.getStartForPlayers().slice());
    canvas_js_1.editor.getChoosenTile().setIsEndingFor(canvas_js_1.editor.getEndForPlayers().slice());
    canvas_js_1.editor.getChoosenTile().setCanOccupy(canvas_js_1.editor.getEnabledForPlayers());
    canvas_js_1.editor.getChoosenTile().setToogleNumber(canvas_js_1.doc.getElementById('toogleNumberingChecker').checked);
    canvas_js_1.editor.getChoosenTile().setNumberingColor(canvas_js_1.doc.getElementById('numberingColorPicker').value);
    canvas_js_1.editor.getChoosenTile().setPatternFile(pattImage);
    canvas_js_1.editor.getChoosenTile().setCantBeEliminatedOnTile(canvas_js_1.editor.getCantBeEliminatedOnTile().slice());
    if (document.getElementById('eventChecker').checked) {
        canvas_js_1.editor.getChoosenTile().setSkip(canvas_js_1.editor.getSkip());
        canvas_js_1.editor.getChoosenTile().setRepeat(canvas_js_1.editor.getRepeat());
        canvas_js_1.editor.getChoosenTile().setForward(canvas_js_1.editor.getForward());
        canvas_js_1.editor.getChoosenTile().setBackward(canvas_js_1.editor.getBackward());
        canvas_js_1.editor.getChoosenTile().setMustThrown(canvas_js_1.editor.getMustThrown());
        canvas_js_1.editor.getChoosenTile().setTurnsToSetFree(canvas_js_1.editor.getTurnsToSetFree());
    }
    else {
        canvas_js_1.editor.getChoosenTile().setSkip(0);
        canvas_js_1.editor.getChoosenTile().setRepeat(0);
        canvas_js_1.editor.getChoosenTile().setForward(0);
        canvas_js_1.editor.getChoosenTile().setBackward(0);
        canvas_js_1.editor.getChoosenTile().setMustThrown(0);
        canvas_js_1.editor.getChoosenTile().setTurnsToSetFree(0);
    }
    if (document.getElementById('tileNumberSetter').value.length > 0 && ((_c = canvas_js_1.editor.getChoosenTile()) === null || _c === void 0 ? void 0 : _c.getTileNumber()) != parseInt(document.getElementById('tileNumberSetter').value)) {
        canvas_js_1.editor.getChoosenTile().setTileNumber(parseInt(document.getElementById('tileNumberSetter').value));
        var tileWithSameNumber = canvas_js_1.editor.getGame().getTiles()
            .filter(function (t) { return t.getTileNumber() === parseInt(document.getElementById('tileNumberSetter').value); });
        if (tileWithSameNumber.length > 0) {
            tileWithSameNumber[0].setTileNumber(canvas_js_1.editor.nextTileNumber());
        }
    }
    canvas_js_1.editor.getChoosenTile().getPawns().forEach(function (pawn) {
        var _a;
        if (!canvas_js_1.editor.getChoosenTile().getIsStartingFor().includes(pawn.player)) {
            (_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.removePawn(pawn);
            canvas_js_1.editor.getGame().removePawn(pawn);
        }
    });
    if (document.getElementById('askQuestionChecker').checked) {
        (_d = canvas_js_1.editor.getChoosenTile()) === null || _d === void 0 ? void 0 : _d.setQuestionId(canvas_js_1.editor.getQuestionId());
    }
    else {
        (_e = canvas_js_1.editor.getChoosenTile()) === null || _e === void 0 ? void 0 : _e.setQuestionId(-1);
    }
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
var setValues = function (tile, copyNumber) {
    if (tile == undefined) {
        tile = canvas_js_1.editor.getChoosenTile();
    }
    else { }
    if (tile != undefined) {
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
        //let tileFollowingSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileFollowingSetter')!
        //let choosenTile = editor.getChoosenTile()
        colorPicker.value = tile.getColor();
        numberingColor.value = tile.getNumberingColor();
        sizeOfTileSlider.value = tile.getRadius().toString();
        sizeOfOutlineSlider.value = tile.getStroke().toString();
        outlineColorPicker.value = tile.getStrokeColor();
        outlineChecker.checked = tile.getStroke() > 0;
        if (copyNumber) {
            tileNumberSetter.value = tile.getTileNumber().toString();
            //tileFollowingSetter.value = tile!.getFollowingTileNumber().toString()
        }
        else {
            console.log('nastavil spravne');
            tileNumberSetter.value = '';
            //tileFollowingSetter.value = ''
        }
        if (tile.getQuestionId() != -1) {
            document.getElementById('askQuestionChecker').checked = true;
            (canvas_js_1.doc.getElementById("askQuestionCheckerShower")).textContent = canvas_js_1.texts[93];
            document.getElementById('bindQuestion').textContent = 'Choosen Question Id: ' + tile.getQuestionId();
        }
        if (tile.getSkip() != 0) {
            document.getElementById('eventChecker').checked = true;
            (canvas_js_1.doc.getElementById('eventCheckerShower')).textContent = canvas_js_1.texts[93];
            document.getElementById('bindEvent').textContent = canvas_js_1.texts[105] + tile.getSkip() + canvas_js_1.texts[100];
        }
        if (tile.getRepeat() != 0) {
            document.getElementById('eventChecker').checked = true;
            (canvas_js_1.doc.getElementById('eventCheckerShower')).textContent = canvas_js_1.texts[93];
            document.getElementById('bindEvent').textContent = canvas_js_1.texts[108] + tile.getRepeat() + canvas_js_1.texts[100];
        }
        if (tile.getForward() != 0) {
            document.getElementById('eventChecker').checked = true;
            (canvas_js_1.doc.getElementById('eventCheckerShower')).textContent = canvas_js_1.texts[93];
            document.getElementById('bindEvent').textContent = canvas_js_1.texts[99] + tile.getForward() + canvas_js_1.texts[100];
        }
        if (tile.getBackward() != 0) {
            document.getElementById('eventChecker').checked = true;
            (canvas_js_1.doc.getElementById('eventCheckerShower')).textContent = canvas_js_1.texts[93];
            document.getElementById('bindEvent').textContent = canvas_js_1.texts[103] + tile.getBackward() + canvas_js_1.texts[10];
        }
        if (tile.getMustThrown() != 0) {
            document.getElementById('eventChecker').checked = true;
            (canvas_js_1.doc.getElementById('eventCheckerShower')).textContent = canvas_js_1.texts[93];
            canvas_js_1.texts[110] + tile.getMustThrown() + canvas_js_1.texts[111] + tile.getTurnsToSetFree() + canvas_js_1.texts[100];
            document.getElementById('bindEvent').textContent = canvas_js_1.texts[110] + tile.getMustThrown() + canvas_js_1.texts[111] + tile.getTurnsToSetFree() + canvas_js_1.texts[100];
        }
        if (outlineChecker.checked) {
            canvas_js_1.doc.getElementById("outlineCheckerShower").textContent = canvas_js_1.texts[93];
        }
        else {
            canvas_js_1.doc.getElementById("outlineCheckerShower").textContent = canvas_js_1.texts[92];
        }
        shapeMenu.value = tile.getShape();
        backgroundChecker.checked = (tile.getBackgroundFile() != undefined);
        if (backgroundChecker.checked) {
            canvas_js_1.doc.getElementById("backgroundCheckerShower").textContent = canvas_js_1.texts[93];
        }
        else {
            canvas_js_1.doc.getElementById("backgroundCheckerShower").textContent = canvas_js_1.texts[92];
        }
        patternChecker.checked = (tile.getPatternFile() != undefined);
        //console.log(doc.getElementById("patternCheckerShower")!)
        if (patternChecker.checked) {
            canvas_js_1.doc.getElementById("patternCheckerShower").textContent = canvas_js_1.texts[92];
        }
        else {
            canvas_js_1.doc.getElementById("patternCheckerShower").textContent = canvas_js_1.texts[93];
        }
        toogleNumberingChecker.checked = tile.getToggleNumber();
        if (toogleNumberingChecker.checked) {
            canvas_js_1.doc.getElementById("toogleNumberingCheckerShower").textContent = canvas_js_1.texts[92];
        }
        else {
            canvas_js_1.doc.getElementById("toogleNumberingCheckerShower").textContent = canvas_js_1.texts[93];
        }
    }
    //startingFor = doc.getElementById('')
    return tile;
};
var moveTile = function (event) {
    canvas_js_1.editor.moveTile(event);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
function showActualState() {
    var cs = document.getElementById('changeCanvas');
    var cttttx = cs.getContext("2d");
    (0, canvas_js_1.reload)(canvas_js_1.editor, cttttx);
    var width = cs.width;
    var height = cs.height;
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
    var stroke = 0;
    if (outlineChecker.checked) {
        stroke = parseInt(sizeOfOutlineSlider.value);
    }
    var tile = canvas_js_1.editor.initTile(false, { x: width / 2, y: height / 2 }, colorPicker.value, parseInt(sizeOfTileSlider.value), stroke, outlineColorPicker.value, shapeMenu.value, undefined, undefined);
    tile.setNumberingColor(numberingColor.value);
    if (tileNumberSetter.value != "") {
        tile.setTileNumber(parseInt(tileNumberSetter.value));
    }
    if (backgroundChecker.checked) {
        tile.setBackgroundFile(canvas_js_1.editor.getImage());
    }
    if (patternChecker.checked) {
        tile.setPatternFile(canvas_js_1.editor.getPattern());
    }
    //tile = setValues(tile)
    cttttx.clearRect(0, 0, cs.width, cs.height);
    tile.drawTile(cs, document.getElementById('changeCanvas').getContext("2d"), true);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
}
exports.showActualState = showActualState;
function generateNextTiles() {
    (0, canvas_js_1.elementDeleter)('nextTileModalBody');
    canvas_js_1.editor.getGame().getPlayerTokens().forEach(function (token) {
        console.log('pridal' + token);
        var div = document.createElement('div');
        div.id = 'div' + token;
        //div.style.width = '100%'
        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'nextTile' + token;
        input.value = canvas_js_1.editor.getGame().getNextTilesIds().get(token).toString();
        input.onchange = function () {
            canvas_js_1.editor.getGame().getNextTilesIds().set(token, parseInt(input.value));
        };
        document.getElementById('nextTileModalBody').appendChild(div);
        (0, Elements_js_1.spawnParagraph)(document, 'div' + token, '', canvas_js_1.texts[148] + token + canvas_js_1.texts[149]);
        div.appendChild(input);
    });
}
function returnNextTileMap() {
    var ret = new Map();
    Array.from(canvas_js_1.editor.getGame().getNextTilesIds().entries()).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        ret.set(key, value);
        canvas_js_1.editor.getGame().getNextTilesIds().set(key, value + 1);
    });
    return ret;
}
function updateNextTileIds() {
    Array.from(canvas_js_1.editor.getGame().getNextTilesIds().keys()).forEach(function (token) {
        canvas_js_1.editor.getGame().getNextTilesIds().set(token, parseInt(document.getElementById('nextTile' + token).value));
    });
}
