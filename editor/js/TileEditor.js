"use strict";
exports.__esModule = true;
exports.spawnTile = exports.spawnElements = exports.removeAllListenersAdded = exports.removeAllButtons = exports.isMoving = exports.moveTiles = exports.deleteTiles = exports.editTiles = exports.insertTilesMenu = void 0;
var canvas_js_1 = require("./canvas.js");
var PathEditor_js_1 = require("./PathEditor.js");
var isMoving = false;
exports.isMoving = isMoving;
var image = undefined;
var pattern = undefined;
var moveEventHandler = function (event) {
    canvas_js_1.editor.findTile(event);
    (0, canvas_js_1.reload)();
};
var deleteHandler = function (event) {
    canvas_js_1.editor.deleteTile(event);
    (0, canvas_js_1.reload)();
};
function spawnElements() {
    var colorPicker = canvas_js_1.doc.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'colorPicker';
    var text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Choose color of tile:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(colorPicker);
    var sizeOfTileSlider = canvas_js_1.doc.createElement('input');
    sizeOfTileSlider.type = 'range';
    sizeOfTileSlider.id = 'sizeOfTileSlider';
    sizeOfTileSlider.value = '30';
    sizeOfTileSlider.min = '20';
    sizeOfTileSlider.max = '50';
    sizeOfTileSlider.step = '1';
    var tileSizeShower = canvas_js_1.doc.createElement('paragraph');
    tileSizeShower.id = 'tileSizeShower';
    tileSizeShower.textContent = '30';
    sizeOfTileSlider.oninput = function () {
        canvas_js_1.doc.getElementById("tileSizeShower").textContent = sizeOfTileSlider.value;
    };
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Tile size:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(sizeOfTileSlider);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(tileSizeShower);
    var outlineChecker = canvas_js_1.doc.createElement('input');
    outlineChecker.type = 'checkbox';
    outlineChecker.id = 'outlineChecker';
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Tile have outline? (checkbox)';
    var hasOutlineShower = canvas_js_1.doc.createElement('paragraph');
    hasOutlineShower.id = 'hasOutlineShower';
    hasOutlineShower.textContent = 'no';
    outlineChecker.oninput = function () {
        if (outlineChecker.checked) {
            canvas_js_1.doc.getElementById("hasOutlineShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("hasOutlineShower").textContent = 'no';
        }
    };
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(outlineChecker);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(hasOutlineShower);
    var outlineColorPicker = canvas_js_1.doc.createElement('input');
    outlineColorPicker.type = 'color';
    outlineColorPicker.id = 'outlineColorPicker';
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Choose color of outline:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(outlineColorPicker);
    var sizeOfOutlineSlider = canvas_js_1.doc.createElement('input');
    sizeOfOutlineSlider.type = 'range';
    sizeOfOutlineSlider.id = 'sizeOfOutlineSlider';
    sizeOfOutlineSlider.value = '3';
    sizeOfOutlineSlider.min = '1';
    sizeOfOutlineSlider.max = '10';
    sizeOfOutlineSlider.step = '1';
    var tileOutlineSizeShower = canvas_js_1.doc.createElement('paragraph');
    tileOutlineSizeShower.id = 'tileOutlineSizeShower';
    tileOutlineSizeShower.textContent = '3';
    sizeOfOutlineSlider.oninput = function () {
        canvas_js_1.doc.getElementById("tileOutlineSizeShower").textContent = sizeOfOutlineSlider.value;
    };
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Outline size:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(sizeOfOutlineSlider);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(tileOutlineSizeShower);
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Choose Shape:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    var shapeMenu = canvas_js_1.doc.createElement('select');
    shapeMenu.id = 'shapeMenu';
    shapeMenu.classList.add("btn");
    shapeMenu.classList.add("btn-dark");
    var types = ['circle', 'square'];
    for (var i = 0; i < types.length; i++) {
        var option = canvas_js_1.doc.createElement("option");
        option.value = types[i];
        option.text = types[i];
        shapeMenu.appendChild(option);
    }
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(shapeMenu);
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Choose pattern image:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    var patternChecker = canvas_js_1.doc.createElement('input');
    patternChecker.type = 'checkbox';
    patternChecker.id = 'patternChecker';
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Tile have pattern from images? (checkbox)';
    var hasPatternImageShower = canvas_js_1.doc.createElement('paragraph');
    hasPatternImageShower.id = 'hasPatternImageShower';
    hasPatternImageShower.textContent = 'no';
    patternChecker.oninput = function () {
        if (patternChecker.checked) {
            canvas_js_1.doc.getElementById("hasPatternImageShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("hasPatternImageShower").textContent = 'no';
        }
    };
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(patternChecker);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(hasPatternImageShower);
    var patternImage = canvas_js_1.doc.createElement('input');
    patternImage.id = 'tileImage';
    patternImage.type = 'file';
    patternImage.accept = ".jpg, .jpeg, .png";
    patternImage.textContent = 'Choose an Image!';
    patternImage.oninput = function () {
        if (patternImage.files.length > 0) {
            pattern = new Image();
            pattern.src = URL.createObjectURL(patternImage.files[0]);
        }
        else {
            pattern = undefined;
        }
    };
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(patternImage);
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Choose background image:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    var backgroundChecker = canvas_js_1.doc.createElement('input');
    backgroundChecker.type = 'checkbox';
    backgroundChecker.id = 'backgroundChecker';
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Tile have background image? (checkbox)';
    var hasBackgroundImageShower = canvas_js_1.doc.createElement('paragraph');
    hasBackgroundImageShower.id = 'hasBackgroundImageShower';
    hasBackgroundImageShower.textContent = 'no';
    backgroundChecker.oninput = function () {
        if (backgroundChecker.checked) {
            canvas_js_1.doc.getElementById("hasBackgroundImageShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("hasBackgroundImageShower").textContent = 'no';
        }
    };
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(backgroundChecker);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(hasBackgroundImageShower);
    var tileImage = canvas_js_1.doc.createElement('input');
    tileImage.id = 'tileImage';
    tileImage.type = 'file';
    tileImage.accept = ".jpg, .jpeg, .png";
    tileImage.textContent = 'Choose an Image!';
    tileImage.oninput = function () {
        if (tileImage.files.length > 0) {
            image = new Image();
            image.src = URL.createObjectURL(tileImage.files[0]);
        }
        else {
            image = undefined;
        }
    };
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(tileImage);
}
exports.spawnElements = spawnElements;
function insertTilesMenu() {
    removeAllListenersAdded();
    canvas_js_1.editor.makeAllTilesNotChoosen();
    (0, canvas_js_1.reload)();
    removeAllButtons();
    var i = 0;
    canvas_js_1.canvas.addEventListener('click', moveEventHandler);
    var saveButton = canvas_js_1.doc.createElement('button');
    //let addToStartButton:HTMLButtonElement = doc.createElement('button');
    //let addDistributedButton:HTMLButtonElement = doc.createElement('button');
    saveButton.id = 'Save';
    saveButton.textContent = 'Save!';
    saveButton.classList.add("btn");
    saveButton.classList.add("btn-dark");
    canvas_js_1.doc.getElementById("buttonPlace").appendChild(saveButton);
    canvas_js_1.doc.getElementById("Save").addEventListener('click', function () { saveInsertingTiles(); });
    var drawPathButton = canvas_js_1.doc.createElement('button');
    drawPathButton.id = 'drawPath';
    drawPathButton.textContent = 'Draw Path!!';
    drawPathButton.classList.add("btn");
    drawPathButton.classList.add("btn-dark");
    canvas_js_1.doc.getElementById("buttonPlace").appendChild(drawPathButton);
    canvas_js_1.doc.getElementById('drawPath').addEventListener('click', function () {
        (0, PathEditor_js_1.editTrack)();
    });
    var insertOneTileButton = canvas_js_1.doc.createElement('button');
    insertOneTileButton.id = 'startInsertingButton';
    insertOneTileButton.textContent = 'Insert by one!';
    insertOneTileButton.classList.add("btn");
    insertOneTileButton.classList.add("btn-dark");
    canvas_js_1.doc.getElementById("buttonPlace").appendChild(insertOneTileButton);
    canvas_js_1.doc.getElementById('startInsertingButton').addEventListener('click', function () {
        startInsertingByOne(canvas_js_1.doc);
    });
}
exports.insertTilesMenu = insertTilesMenu;
function startInsertingByOne(doc) {
    doc.getElementById("canvasPlace").style.cursor = 'grabbing';
    removeAllButtons();
    removeAllListenersAdded();
    canvas_js_1.canvas.addEventListener('mousedown', insert);
    var endInsertingButton = doc.createElement('button');
    endInsertingButton.id = 'endInsertingButton';
    endInsertingButton.textContent = 'Stop inserting!';
    endInsertingButton.classList.add("btn");
    endInsertingButton.classList.add("btn-dark");
    doc.getElementById("buttonPlace").appendChild(endInsertingButton);
    doc.getElementById('endInsertingButton').addEventListener('click', function () {
        insertTilesMenu();
        canvas_js_1.canvas.removeEventListener('mousedown', insert);
        doc.getElementById("canvasPlace").style.cursor = 'default';
    });
    spawnElements();
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
    exports.isMoving = isMoving = false;
    var saveButton = canvas_js_1.doc.createElement('button');
    saveButton.id = 'Save';
    saveButton.textContent = 'Save!';
    saveButton.classList.add("btn");
    saveButton.classList.add("btn-dark");
    canvas_js_1.doc.getElementById("buttonPlace").appendChild(saveButton);
    canvas_js_1.doc.getElementById("Save").addEventListener('click', function () { saveEditingTiles(); });
    var updateButton = canvas_js_1.doc.createElement('button');
    updateButton.id = 'Update';
    updateButton.textContent = 'Edit button!';
    updateButton.classList.add("btn");
    updateButton.classList.add("btn-dark");
    canvas_js_1.doc.getElementById("buttonPlace").appendChild(updateButton);
    canvas_js_1.doc.getElementById("Update").addEventListener('click', update);
    spawnElements();
    setValues();
    //canvas.addEventListener('mousemove',moveTile)
    //canvas.addEventListener('mousedown',moveTile)
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
    exports.isMoving = isMoving = true;
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
    var endButton = document.createElement('button');
    endButton.id = 'End';
    endButton.textContent = 'End deleting!';
    endButton.classList.add("btn");
    endButton.classList.add("btn-dark");
    document.getElementById('buttonPlace').appendChild(endButton);
    endButton.addEventListener('click', saveInsertingTiles);
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
var insert = function (event) {
    var coords = (0, canvas_js_1.calibreEventCoords)(event);
    spawnTile(coords);
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
    var insertImage = image;
    var pattImage = pattern;
    if (!backgroundChecker.checked) {
        insertImage = undefined;
    }
    if (!patternChecker.checked) {
        pattImage = undefined;
    }
    // var image = new Image()
    // let tileImage:HTMLInputElement = <HTMLInputElement>doc.getElementById('tileImage')!
    // image.src =URL.createObjectURL(tileImage!.files![0]!)
    // newTile.backgroundFile = image
    if (outlineChecker.checked) {
        canvas_js_1.editor.initTile(coords, colorPicker.value, parseInt(sizeOfTileSlider.value), parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage, pattImage);
    }
    else {
        canvas_js_1.editor.initTile(coords, colorPicker.value, parseInt(sizeOfTileSlider.value), 0, '', shapeMenu.value, insertImage, pattImage);
    }
    (0, canvas_js_1.reload)();
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
    var insertImage = image;
    if (!backgroundChecker.checked) {
        insertImage = undefined;
    }
    canvas_js_1.editor.updateChoosenTile(colorPicker.value, parseInt(sizeOfTileSlider.value), outlineChecker.checked, parseInt(sizeOfOutlineSlider.value), outlineColorPicker.value, shapeMenu.value, insertImage);
    (0, canvas_js_1.reload)();
};
var setValues = function () {
    var _a;
    if (canvas_js_1.editor.getChoosenTile() != undefined) {
        var sizeOfTileSlider = canvas_js_1.doc.getElementById('sizeOfTileSlider');
        var colorPicker = canvas_js_1.doc.getElementById('colorPicker');
        var sizeOfOutlineSlider = canvas_js_1.doc.getElementById('sizeOfOutlineSlider');
        var outlineColorPicker = canvas_js_1.doc.getElementById('outlineColorPicker');
        var outlineChecker = canvas_js_1.doc.getElementById('outlineChecker');
        var shapeMenu = canvas_js_1.doc.getElementById('shapeMenu');
        var backgroundChecker = canvas_js_1.doc.getElementById('backgroundChecker');
        var choosenTile = canvas_js_1.editor.getChoosenTile();
        colorPicker.value = choosenTile.getColor();
        sizeOfTileSlider.value = choosenTile.getRadius().toString();
        sizeOfOutlineSlider.value = choosenTile.getStroke().toString();
        outlineColorPicker.value = choosenTile.getStrokeColor();
        outlineChecker.checked = choosenTile.getStroke() > 0;
        if (outlineChecker.checked) {
            canvas_js_1.doc.getElementById("hasOutlineShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("hasOutlineShower").textContent = 'no';
        }
        shapeMenu.value = choosenTile.getShape();
        backgroundChecker.checked = ((_a = canvas_js_1.editor.getChoosenTile()) === null || _a === void 0 ? void 0 : _a.getBackgroundFile()) != undefined;
        if (backgroundChecker.checked) {
            canvas_js_1.doc.getElementById("hasBackgroundImageShower").textContent = 'yes';
        }
        else {
            canvas_js_1.doc.getElementById("hasBackgroundImageShower").textContent = 'no';
        }
    }
};
var moveTile = function (event) {
    canvas_js_1.editor.moveTile(event);
    (0, canvas_js_1.reload)();
};
