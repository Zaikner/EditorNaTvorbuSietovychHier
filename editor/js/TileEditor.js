"use strict";
exports.__esModule = true;
exports.saveInsertingTiles = exports.undoTileInsert = exports.spawnTile = exports.spawnElements = exports.removeAllListenersAdded = exports.showActualState = exports.removeAllButtons = exports.moveTiles = exports.unchooseEverything = exports.deleteTiles = exports.editTiles = exports.pickTile = exports.insert = exports.startInsertingByOne = exports.copyNextTileMap = exports.moveEventHandler = exports.update = exports.insertTilesMenu = void 0;
var canvas_js_1 = require("./canvas.js");
var clientSocket_js_1 = require("./clientSocket.js");
var PathEditor_js_1 = require("./PathEditor.js");
var Elements_js_1 = require("./Elements.js");
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
                clientSocket_js_1.editorSocket.emit('move pawns', { pawn: pawn.id, value: value, room: params.get('id') });
                canvas_js_1.canvas.removeEventListener('click', clientSocket_js_1.canMovePawnFunc);
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
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], clientSocket_js_1.texts[79], saveInsertingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'endInsertingButton', ["btn", "btn-dark"], clientSocket_js_1.texts[121], insertTilesMenu);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'undoButton', ["btn", "btn-dark"], clientSocket_js_1.texts[122], undoTileInsert);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'copyStyleButton', ["btn", "btn-dark"], clientSocket_js_1.texts[123], copyTileStyle);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    canvas_js_1.canvas.addEventListener('mousedown', insert);
};
var deleteHandler = function (event) {
    canvas_js_1.editor.deleteTile();
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
function spawnElements() {
    //$('#exampleModal').modal('toggle')
    var options = [clientSocket_js_1.texts[195]];
    canvas_js_1.editor.getGame().getPlayerTokens().slice().forEach(function (player) {
        options.push(player);
    });
    (0, Elements_js_1.spawnHeading)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[19]);
    var cs = (0, Elements_js_1.spawnCanvas)(canvas_js_1.doc, 'tileEditingPlace', 'changeCanvas');
    var colorPicker = (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'colorPicker', clientSocket_js_1.texts[124]);
    colorPicker.onchange = function () {
        canvas_js_1.editor.setImage(undefined);
        showActualState();
    };
    //spawnParagraph(doc,"tileEditingPlace",'',texts[173],true)
    //spawnCheckerWithValueShower(doc,"tileEditingPlace",'eliminationChecker',false,[texts[92],texts[93]])
    //spawnParagraph(doc,"tileEditingPlace",'',texts[125],true)
    var sizeOfTileSlider = (0, Elements_js_1.spawnSliderWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'sizeOfTileSlider', clientSocket_js_1.texts[125], '20', '50', '1', '30');
    sizeOfTileSlider.onchange = showActualState;
    // spawnParagraph(doc,"tileEditingPlace",'',texts[126],true)
    // let outlineChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'outlineChecker',false,[texts[92],texts[93]])
    // outlineChecker.onchange = showActualState
    // spawnParagraph(doc,"tileEditingPlace",'',texts[127],true)
    var outlineColorPicker = (0, Elements_js_1.spawnColorPicker)(canvas_js_1.doc, "tileEditingPlace", 'outlineColorPicker', clientSocket_js_1.texts[127]);
    outlineColorPicker.onchange = showActualState;
    //spawnParagraph(doc,"tileEditingPlace",'',texts[128],true)
    var sizeOfOutlineSlider = (0, Elements_js_1.spawnSliderWithValueShower)(canvas_js_1.doc, "tileEditingPlace", 'sizeOfOutlineSlider', clientSocket_js_1.texts[128], '0', '10', '1', '3');
    sizeOfOutlineSlider.onchange = showActualState;
    //spawnParagraph(doc,"tileEditingPlace",'',texts[129],true)
    var shapeMenu = (0, Elements_js_1.spawnSelectMenu)(canvas_js_1.doc, "tileEditingPlace", 'shapeMenu', clientSocket_js_1.texts[129], ["btn", "btn-dark"], ['circle', 'square']);
    //let shapeMenu =spawnRadioButtons(doc,"tileEditingPlace",'shapeMenu',texts[129],["btn","btn-dark"],['circle','square'], showActualState)
    shapeMenu.onchange = showActualState;
    //   spawnParagraph(doc,"tileEditingPlace",'',texts[130],true)
    //   let patternChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'patternChecker',false,[texts[92],texts[93]])
    //   patternChecker.onchange = showActualState
    // spawnImageInput(doc,"tileEditingPlace",'tilePattern',texts[131],texts[131],function(){
    //   if ((<HTMLInputElement>doc.getElementById('tilePattern')!).files!.length > 0){
    //     editor.setPattern(new Image())
    //       editor.getPattern()!.src =URL.createObjectURL((<HTMLInputElement>doc.getElementById('tilePattern')!).files![0]!)    
    //       editor.getPattern().onload = function (){
    //         showActualState()
    //       }
    //     }
    //   else{
    //     editor.setPattern(undefined!)
    //   }
    // })
    //   spawnParagraph(doc,"tileEditingPlace",'',texts[133],true)
    // let backgroundChecker = spawnCheckerWithValueShower(doc,"tileEditingPlace",'backgroundChecker',false,[texts[92],texts[93]])
    // backgroundChecker.onchange = showActualState
    (0, Elements_js_1.spawnImageInput)(canvas_js_1.doc, "tileEditingPlace", 'tileImage', clientSocket_js_1.texts[134], clientSocket_js_1.texts[134], function () {
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
    //spawnParagraph(doc,"tileEditingPlace",'',texts[135],true)
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', clientSocket_js_1.texts[135], clientSocket_js_1.texts[192], options, 'start');
    //spawnParagraph(doc,"tileEditingPlace",'',texts[136],true)
    (0, Elements_js_1.spawnMultiSelect)(canvas_js_1.doc, 'tileEditingPlace', '', clientSocket_js_1.texts[136], clientSocket_js_1.texts[192], options, 'end');
    // spawnParagraph(doc,"tileEditingPlace",'','Which player can visit this tile? (choose players)',true)
    // spawnMultiSelect(doc,'tileEditingPlace','',editor.getGame().getPlayerTokens(),'enabled')
    //spawnParagraph(doc,"tileEditingPlace",'',texts[138],true)
    // let numberingColorPicker =spawnColorPicker(doc,"tileEditingPlace",'numberingColorPicker',texts[138])
    // numberingColorPicker.onchange = showActualState
    // spawnParagraph(doc,"tileEditingPlace",'',texts[139],true)
    // let tileNumberSetter = spawnNumberInput(doc,"tileEditingPlace",'tileNumberSetter')
    // tileNumberSetter.onchange = showActualState
    //spawnParagraph(doc,"tileEditingPlace",'',texts[140],true)
    (0, Elements_js_1.spawnButtonWithLabel)(canvas_js_1.doc, "tileEditingPlace", 'setNextTileButton', '', ['btn', 'btn-dark'], clientSocket_js_1.texts[141], function () {
        $('#nextTileModal').modal('show');
        generateNextTiles();
    });
    //spawnParagraph(document,'tileEditingPlace','',texts[142],true)
    //spawnCheckerWithValueShower(document,'tileEditingPlace','eleminationChecker',false,[texts[92],texts[93]])
    //spawnCheckerWithLabel(document,'tileEditingPlace','eleminationChecker',texts[142],false,[texts[92],texts[93]])
    //spawnButtonWithLabel(doc,"tileEditingPlace",'eleminationButton','',['btn','btn-secondary'],texts[142],function(){
    //})
    //spawnParagraph(document,'tileEditingPlace','',texts[143],true)
    (0, Elements_js_1.spawnMultiSelect)(document, 'tileEditingPlace', 'cantBeEleminated', clientSocket_js_1.texts[143], clientSocket_js_1.texts[192], options, 'immune');
    //spawnParagraph(document,'tileEditingPlace','',texts[144],true)
    //let questionChecker =spawnCheckerWithValueShower(document,'tileEditingPlace','askQuestionChecker',false,[texts[92],texts[93]])
    //pawnParagraph(document,'tileEditingPlace','',texts[72],true)
    //spawnButton(document,'tileEditingPlace','bindQuestion',['btn','btn-secondary'],texts[114],function(){
    //   if (!questionChecker.checked){
    //     Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.')
    //   }
    //   else{
    //     editorSocket.emit('loadQuestions')
    //     $('#pickQuestionModal').modal('show');
    //   }
    // })
    //spawnParagraph(document,'tileEditingPlace','pickedQuestionParagraph',texts[145],true)
    // spawnParagraph(document,'tileEditingPlace','',texts[146],true)
    // let eventChecker =spawnCheckerWithValueShower(document,'tileEditingPlace','eventChecker',false,[texts[92],texts[93]])
    //spawnParagraph(document,'tileEditingPlace','',texts[98],true)
    (0, Elements_js_1.spawnButtonWithLabel)(document, 'tileEditingPlace', 'bindEvent', clientSocket_js_1.texts[98], ['btn', 'btn-dark'], clientSocket_js_1.texts[174], function () {
        $('#EventModal').modal('show');
        // if (!questionChecker.checked){
        //   Warning.show('Asking question is not allowed. If you want to enable it, it can be enabled by ticking "Ask question on this tile?" checkkox.')
        // }
        // else{
        //   editorSocket.emit('loadQuestions')
        //   $('#pickQuestionModal').modal('show');
        // }
        //$('#EventModal').modal('show');
    });
    var p = (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', 'pickedEventParagraph', clientSocket_js_1.texts[197], false);
    p.style.float = 'right';
    var button = (0, Elements_js_1.spawnButton)(document, 'tileEditingPlace', '', ['btn', 'btn-dark'], clientSocket_js_1.texts[70], function () {
        canvas_js_1.editor.deleteTile();
    });
    //document.getElementById('pickedEventParagraph')!.textContent = texts[71] + elem.questionText;
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
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'Save', ["btn", "btn-dark"], clientSocket_js_1.texts[79], saveInsertingTiles);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'drawPath', ["btn", "btn-dark"], clientSocket_js_1.texts[26], PathEditor_js_1.editTrack);
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'startInsertingButton', ["btn", "btn-dark"], clientSocket_js_1.texts[27], startInsertingByOne);
}
exports.insertTilesMenu = insertTilesMenu;
function startInsertingByOne() {
    canvas_js_1.editor.nullEditor();
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllButtons();
    removeAllListenersAdded();
    //canvas.addEventListener('mousedown', insert);
    canvas_js_1.canvas.addEventListener('click', moveEventHandler);
    canvas_js_1.canvas.addEventListener('mousedown', moveTile);
    //spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],texts[79],saveInsertingTiles)
    //spawnButton(doc,"buttonPlace",'endInsertingButton',["btn","btn-dark"],texts[28],insertTilesMenu)   
    spawnElements();
    //spawnButton(doc,"tileEditingPlace",'undoButton',["btn","btn-dark"],texts[122],undoTileInsert)
    //spawnButton(doc,"buttonPlace",'copyStyleButton',["btn","btn-dark"],texts[123],copyTileStyle)
    showActualState();
}
exports.startInsertingByOne = startInsertingByOne;
function copyTileStyle() {
    canvas_js_1.editor.nullEditor();
    removeAllButtons();
    removeAllListenersAdded();
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[147], true);
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
    //spawnButton(doc,"buttonPlace",'Save',["btn","btn-dark"],texts[79],saveEditingTiles)
    //spawnButton(doc,"buttonPlace",'Update',["btn","btn-dark"],texts[64],update)   
    if (canvas_js_1.editor.getChoosenTile() != undefined) {
        canvas_js_1.editor.setStartForPlayers(canvas_js_1.editor.getChoosenTile().getIsStartingFor().slice());
        canvas_js_1.editor.setEndForPlayers(canvas_js_1.editor.getChoosenTile().getIsEndingFor().slice());
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
    addEventListener('mousemove', moveTile);
    canvas_js_1.canvas.addEventListener('mousedown', moveTile);
}
exports.moveTiles = moveTiles;
function deleteTiles() {
    //doc.getElementById("canvasPlace")!.style.cursor = 'grabbing'
    removeAllListenersAdded();
    removeAllButtons();
    (0, Elements_js_1.spawnButton)(canvas_js_1.doc, "buttonPlace", 'End', ["btn", "btn-dark"], clientSocket_js_1.texts[90], saveInsertingTiles);
    canvas_js_1.canvas.addEventListener('click', deleteHandler);
}
exports.deleteTiles = deleteTiles;
function removeAllButtons() {
    (0, canvas_js_1.elementDeleter)('buttonPlace');
    (0, canvas_js_1.elementDeleter)('numOfPlayersPlace');
    (0, canvas_js_1.elementDeleter)('gameTypePlace');
    (0, canvas_js_1.elementDeleter)('gameNamePlace');
    (0, canvas_js_1.elementDeleter)('tileEditingPlace');
    (0, canvas_js_1.elementDeleter)('questionPlace');
    (0, canvas_js_1.elementDeleter)('headingPlace');
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
    unchooseEverything();
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
exports.insert = insert;
var spawnTile = function (coords) {
    var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
    var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
    var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
    //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
    var insertImage = canvas_js_1.editor.getImage();
    // if (!backgroundChecker.checked){
    //   insertImage = undefined!
    // }
    var addedTile = canvas_js_1.editor.initTile(true, coords, colorPicker.value, parseInt(sizeOfTileSlider.value), parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage);
    addedTile.setIsStartingFor(canvas_js_1.editor.getStartForPlayers().slice());
    addedTile.setIsEndingFor(canvas_js_1.editor.getEndForPlayers().slice());
    //addedTile.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    //addedTile.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    addedTile.setCantBeEliminatedOnTile(canvas_js_1.editor.getCantBeEliminatedOnTile().slice());
    addedTile.setSkip(canvas_js_1.editor.getSkip());
    addedTile.setRepeat(canvas_js_1.editor.getRepeat());
    addedTile.setForward(canvas_js_1.editor.getForward());
    addedTile.setBackward(canvas_js_1.editor.getBackward());
    addedTile.setMustThrown(canvas_js_1.editor.getMustThrown());
    addedTile.setTurnsToSetFree(canvas_js_1.editor.getTurnsToSetFree());
    addedTile.setQuestionId(canvas_js_1.editor.getQuestionId());
    addedTile.setRandomQuestion(canvas_js_1.editor.getRandomQuestion());
    // if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0){
    //   addedTile.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
    //   let tileWithSameNumber = editor.getGame().getTiles()
    //   .filter((t:Tile) => {return t!= addedTile && t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
    //   if (tileWithSameNumber.length > 0){
    //     tileWithSameNumber[0].setTileNumber(editor.nextTileNumber())
    //   }
    // }
    // if ((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value.length > 0){
    //   addedTile.setFollowingTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileFollowingSetter')).value))    
    // }
    // if ((<HTMLInputElement>document.getElementById('askQuestionChecker')).checked){
    //   addedTile.setQuestionId(editor.getQuestionId())
    // }
    // else{
    //   addedTile.setQuestionId(-1)
    // }
    addedTile.setNextTilesIds(returnNextTileMap());
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    console.log(addedTile);
    console.log(canvas_js_1.editor);
    return addedTile;
};
exports.spawnTile = spawnTile;
var update = function () {
    var _a, _b;
    console.log('zavolal update');
    var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
    var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
    var outlineChecker = canvas_js_1.doc.getElementById('outlineChecker');
    var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
    //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
    //let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
    var insertImage = canvas_js_1.editor.getImage();
    //let pattImage = editor.getPattern()
    // if (!backgroundChecker.checked){
    //   insertImage = undefined!
    // }
    // if (!patternChecker.checked){
    //   pattImage = undefined!
    // }
    canvas_js_1.editor.updateChoosenTile(colorPicker.value, parseInt(sizeOfTileSlider.value), parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage);
    (_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.setPawns([]);
    (_b = canvas_js_1.editor.getChoosenTile()) === null || _b === void 0 ? void 0 : _b.getIsStartingFor().forEach(function (player) {
        for (var i = 0; i < canvas_js_1.editor.getGame().getNumberOfStartingPawns(); i++) {
            canvas_js_1.editor.getGame().getPawns().push(new Pawn_js_1.Pawn(player, canvas_js_1.editor.getChoosenTile()));
        }
    });
    console.log(canvas_js_1.editor.getChoosenTile());
    console.log(canvas_js_1.editor.getStartForPlayers().slice());
    canvas_js_1.editor.getChoosenTile().setIsStartingFor(canvas_js_1.editor.getStartForPlayers().slice());
    canvas_js_1.editor.getChoosenTile().setIsEndingFor(canvas_js_1.editor.getEndForPlayers().slice());
    //editor.getChoosenTile()!.setToogleNumber((<HTMLInputElement>doc.getElementById('toogleNumberingChecker')!).checked)
    //editor.getChoosenTile()!.setNumberingColor((<HTMLInputElement>doc.getElementById('numberingColorPicker')!).value)
    canvas_js_1.editor.getChoosenTile().setCantBeEliminatedOnTile(canvas_js_1.editor.getCantBeEliminatedOnTile().slice());
    // if ((<HTMLInputElement>document.getElementById('eventChecker')).checked){
    canvas_js_1.editor.getChoosenTile().setSkip(canvas_js_1.editor.getSkip());
    canvas_js_1.editor.getChoosenTile().setRepeat(canvas_js_1.editor.getRepeat());
    canvas_js_1.editor.getChoosenTile().setForward(canvas_js_1.editor.getForward());
    canvas_js_1.editor.getChoosenTile().setBackward(canvas_js_1.editor.getBackward());
    canvas_js_1.editor.getChoosenTile().setMustThrown(canvas_js_1.editor.getMustThrown());
    canvas_js_1.editor.getChoosenTile().setTurnsToSetFree(canvas_js_1.editor.getTurnsToSetFree());
    canvas_js_1.editor.getChoosenTile().setQuestionId(canvas_js_1.editor.getQuestionId());
    canvas_js_1.editor.getChoosenTile().setRandomQuestion(canvas_js_1.editor.getRandomQuestion());
    // }
    // else{
    // editor.getChoosenTile()!.setSkip(0)
    // editor.getChoosenTile()!.setRepeat(0)
    // editor.getChoosenTile()!.setForward(0)
    // editor.getChoosenTile()!.setBackward(0)
    // editor.getChoosenTile()!.setMustThrown(0)
    // editor.getChoosenTile()!.setTurnsToSetFree(0)
    // }
    // if ((<HTMLInputElement>document.getElementById('tileNumberSetter')).value.length > 0  && editor.getChoosenTile()?.getTileNumber()!= parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)){
    //   editor.getChoosenTile()!.setTileNumber(parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value))
    //   let tileWithSameNumber = editor.getGame().getTiles()
    //   .filter((t:Tile) => {return t.getTileNumber() === parseInt((<HTMLInputElement>document.getElementById('tileNumberSetter')).value)});
    //   if (tileWithSameNumber.length > 0){
    //     tileWithSameNumber[0].setTileNumber(editor.nextTileNumber())
    //   }
    //}
    canvas_js_1.editor.getChoosenTile().getPawns().forEach(function (pawn) {
        var _a;
        if (!canvas_js_1.editor.getChoosenTile().getIsStartingFor().includes(pawn.player)) {
            (_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.removePawn(pawn);
            canvas_js_1.editor.getGame().removePawn(pawn);
        }
    });
    // if ((<HTMLInputElement>document.getElementById('askQuestionChecker')).checked){
    //   editor.getChoosenTile()?.setQuestionId(editor.getQuestionId())
    // }
    // else{
    //   editor.getChoosenTile()?.setQuestionId(-1)
    // }S
    //editor.getChoosenTile()!.setNextTilesIds(returnNextTileMap())
    console.log(canvas_js_1.editor.getChoosenTile());
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
exports.update = update;
var setValues = function (tile, copyNumber) {
    if (tile == undefined) {
        tile = canvas_js_1.editor.getChoosenTile();
    }
    else { }
    console.log('choosen tile je :');
    console.log(tile);
    if (tile != undefined) {
        canvas_js_1.editor.setSkip(tile.getSkip());
        canvas_js_1.editor.setRepeat(tile.getRepeat());
        canvas_js_1.editor.setForward(tile.getForward());
        canvas_js_1.editor.setBackward(tile.getBackward());
        canvas_js_1.editor.setMustThrown(tile.getMustThrown());
        canvas_js_1.editor.setTurnsToSetFree(tile.getTurnsToSetFree());
        canvas_js_1.editor.setQuestionId(tile.getQuestionId());
        canvas_js_1.editor.setRandomQuestion(tile.getRandomQuestion());
        var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
        var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
        //let numberingColor:HTMLInputElement = <HTMLInputElement>doc.getElementById('numberingColorPicker')!
        var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
        var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
        //let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
        var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
        //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
        //let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
        var toogleNumberingChecker = canvas_js_1.doc.getElementById('toogleNumberingChecker');
        var tileNumberSetter = canvas_js_1.doc.getElementById('tileNumberSetter');
        //let tileFollowingSetter:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileFollowingSetter')!
        //let choosenTile = editor.getChoosenTile()
        colorPicker.value = tile.getColor();
        //numberingColor.value = tile!.getNumberingColor()
        sizeOfTileSlider.value = tile.getRadius().toString();
        sizeOfOutlineSlider.value = tile.getStroke().toString();
        outlineColorPicker.value = tile.getStrokeColor();
        // if (copyNumber){
        //   tileNumberSetter.value = tile!.getTileNumber().toString()
        //   //tileFollowingSetter.value = tile!.getFollowingTileNumber().toString()
        // }
        // else{
        //   console.log('nastavil spravne')
        //   tileNumberSetter.value = ''
        //   //tileFollowingSetter.value = ''
        // }
        // if (tile.getQuestionId()!=-1){
        //   (<HTMLInputElement>document.getElementById('askQuestionChecker')).checked = true;
        //   (doc.getElementById("askQuestionCheckerShower"))!.textContent = texts[93]
        //   //document.getElementById('bindQuestion')!.textContent = 'Choosen Question Id: '+tile.getQuestionId()
        // }
        if (tile.getSkip() != 0) {
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[105] + tile.getSkip() + clientSocket_js_1.texts[100];
        }
        else if (tile.getRepeat() != 0) {
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[108] + tile.getRepeat() + clientSocket_js_1.texts[100];
        }
        else if (tile.getForward() != 0) {
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[99] + tile.getForward() + clientSocket_js_1.texts[100];
        }
        else if (tile.getBackward() != 0) {
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[103] + tile.getBackward() + clientSocket_js_1.texts[100];
        }
        else if (tile.getMustThrown() != 0) {
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[110] + tile.getMustThrown() + clientSocket_js_1.texts[111] + tile.getTurnsToSetFree() + clientSocket_js_1.texts[100];
        }
        else if (tile.getQuestionId() != -1) {
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[71] + canvas_js_1.editor.getGame().getQuestions().get(tile.getQuestionId());
        }
        else if (tile.getRandomQuestion()) {
            console.log('chooooooooooooooooooooooosen tile:');
            console.log(canvas_js_1.editor.getChoosenTile());
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[201];
        }
        else {
            document.getElementById('pickedEventParagraph').textContent = clientSocket_js_1.texts[197];
        }
        shapeMenu.value = tile.getShape();
        // toogleNumberingChecker.checked = tile.getToggleNumber()!
        // if (toogleNumberingChecker.checked){
        //   doc.getElementById("toogleNumberingCheckerShower")!.textContent = texts[92]
        // }
        // else{
        //   doc.getElementById("toogleNumberingCheckerShower")!.textContent = texts[93]
        // }
        // Array.from(editor.getChoosenTile()!.getNextTilesIds().entries()).forEach(([key,value])=>{
        //   console.log(key)
        //   console.log(value)
        //   console.log('nextTile'+key)
        //   console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)
        //   // let input =  (<HTMLInputElement>document.getElementById('nextTile'+key))!
        //   if ((<HTMLInputElement>document.getElementById('nextTile'+key)!=undefined)){
        //     (<HTMLInputElement>document.getElementById('nextTile'+key)).textContent = value.toString()
        //   }
        //   //(<HTMLInputElement>document.getElementById('nextTile'+key))!.textContent = value.toString();
        //   //(<HTMLInputElement>document.getElementById('nextTile'+key))!.value = value.toString()
        //   console.log('nastavil '+ value)
        //   console.log('nastavil '+  key)
        //   console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)
        // })
    }
    //startingFor = doc.getElementById('')
    return tile;
};
var moveTile = function (event) {
    canvas_js_1.editor.moveTile(event);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
};
function showActualState() {
    if (canvas_js_1.editor.getChoosenTile()) {
        update();
    }
    var cs = document.getElementById('changeCanvas');
    var cttttx = cs.getContext("2d");
    (0, canvas_js_1.reload)(canvas_js_1.editor, cttttx);
    var width = cs.width;
    var height = cs.height;
    var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
    var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
    //let numberingColor:HTMLInputElement = <HTMLInputElement>doc.getElementById('numberingColorPicker')!
    var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
    var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
    //let outlineChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('outlineChecker')!
    var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
    //let backgroundChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('backgroundChecker')!
    //let patternChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('patternChecker')!
    //let toogleNumberingChecker:HTMLInputElement = <HTMLInputElement>doc.getElementById('toogleNumberingChecker')!
    var stroke = parseInt(sizeOfOutlineSlider.value);
    var tile = canvas_js_1.editor.initTile(false, { x: width / 2, y: height / 2 }, colorPicker.value, parseInt(sizeOfTileSlider.value), stroke, outlineColorPicker.value, shapeMenu.value, undefined);
    //tile.setNumberingColor(numberingColor.value)
    // if (tileNumberSetter.value != ""){
    //   tile.setTileNumber(parseInt(tileNumberSetter.value))
    // }
    tile.setImage(canvas_js_1.editor.getImage());
    cttttx.clearRect(0, 0, cs.width, cs.height);
    tile.drawTile(cs, document.getElementById('changeCanvas').getContext("2d"), true);
    (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
}
exports.showActualState = showActualState;
function generateNextTiles() {
    (0, canvas_js_1.elementDeleter)('nextTileModalBody');
    // if (editor.getChoosenTile() == undefined){
    canvas_js_1.editor.getGame().getPlayerTokens().forEach(function (token) {
        console.log('pridal' + token);
        var div = document.createElement('div');
        div.id = 'div' + token;
        //div.style.width = '100%'
        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'nextTile' + token;
        if (canvas_js_1.editor.getChoosenTile() != undefined) {
            input.value = canvas_js_1.editor.getChoosenTile().getNextTilesIds().get(token).toString();
            console.log('generate nextTile nastavil pre ' + 'nextTile' + token + 'hodnotu ' + canvas_js_1.editor.getChoosenTile().getNextTilesIds().get(token).toString());
        }
        else {
            input.value = canvas_js_1.editor.getGame().getNextTilesIds().get(token).toString();
        }
        // input.onchange = function(){
        //     editor.getGame().getNextTilesIds().set(token,parseInt(input.value))
        //     if (editor.getChoosenTile()!= undefined){
        //       editor.getChoosenTile()?.setNextTilesIds(copyNextTileMap())
        //       console.log('prestavil')
        //     }
        // }
        document.getElementById('nextTileModalBody').appendChild(div);
        (0, Elements_js_1.spawnParagraph)(document, 'div' + token, '', clientSocket_js_1.texts[148] + token + clientSocket_js_1.texts[149], true);
        div.appendChild(input);
    });
    // }else if (editor.getChoosenTile() !=undefined){
    //   Array.from(editor.getChoosenTile()!.getNextTilesIds().entries()).forEach(([key,value])=>{
    //     console.log(key)
    //     console.log(value)
    //     console.log('nextTile'+key)
    //     console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)
    //     // let input =  (<HTMLInputElement>document.getElementById('nextTile'+key))!
    //     if ((<HTMLInputElement>document.getElementById('nextTile'+key)!=undefined)){
    //       (<HTMLInputElement>document.getElementById('nextTile'+key)).textContent = value.toString()
    //     }
    //     //(<HTMLInputElement>document.getElementById('nextTile'+key))!.textContent = value.toString();
    //     //(<HTMLInputElement>document.getElementById('nextTile'+key))!.value = value.toString()
    //     console.log('nastavil '+ value)
    //     console.log('nastavil '+  key)
    //     console.log((<HTMLInputElement>document.getElementById('nextTile'+key))!)
    //   })
    // }
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
function copyNextTileMap() {
    var ret = new Map();
    Array.from(canvas_js_1.editor.getGame().getNextTilesIds().entries()).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        ret.set(key, value);
    });
    return ret;
}
exports.copyNextTileMap = copyNextTileMap;
function updateNextTileIds() {
    Array.from(canvas_js_1.editor.getGame().getNextTilesIds().keys()).forEach(function (token) {
        canvas_js_1.editor.getGame().getNextTilesIds().set(token, parseInt(document.getElementById('nextTile' + token).value));
    });
}
