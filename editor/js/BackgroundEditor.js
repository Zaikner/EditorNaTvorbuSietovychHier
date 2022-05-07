"use strict";
exports.__esModule = true;
exports.editComponent = exports.removeAllComponentListeners = exports.deleteComponentMenu = exports.editComponentMenu = exports.moveComponentMenu = exports.addComponentMenu = exports.editBackground = void 0;
var canvas_js_1 = require("./canvas.js");
var clientSocket_js_1 = require("./clientSocket.js");
var Elements_js_1 = require("./Elements.js");
var TileEditor_js_1 = require("./TileEditor.js");
var background = undefined;
function editBackground() {
    (0, TileEditor_js_1.removeAllButtons)();
    (0, TileEditor_js_1.removeAllListenersAdded)();
    (0, Elements_js_1.spawnHeading)(document, 'buttonPlace', '', clientSocket_js_1.texts[19]);
    (0, Elements_js_1.spawnImageInput)(document, 'tileEditingPlace', 'backgroundImage', '', clientSocket_js_1.texts[91], function () {
        var backgroundImage = document.getElementById('backgroundImage');
        if (backgroundImage.files.length > 0) {
            background = new Image();
            background.src = URL.createObjectURL(backgroundImage.files[0]);
            background.onload = function () {
                canvas_js_1.game.getBackground().setBackgroundImage(background);
                (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
            };
        }
    });
    (0, Elements_js_1.spawnColorPicker)(document, 'tileEditingPlace', 'colorPicker', clientSocket_js_1.texts[95], function () {
        canvas_js_1.game.getBackground().setColor(document.getElementById('colorPicker').value);
        canvas_js_1.game.getBackground().setBackgroundImage(undefined);
        (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
    });
}
exports.editBackground = editBackground;
var moveComponentHandler = function (event) {
    canvas_js_1.game.getBackground().findComponent(event, false);
    (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
};
var moveComponent = function (event) {
    canvas_js_1.game.getBackground().moveComponent(event);
    (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
};
var deleteComponent = function (event) {
    canvas_js_1.game.getBackground().deleteComponent(event);
    (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
};
function moveComponents() {
    (0, TileEditor_js_1.removeAllListenersAdded)();
    canvas_js_1.doc.getElementById("canvasPlace").style.cursor = 'grabbing';
    //game.makeAllTilesNotChoosen()
    (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
    canvas_js_1.game.setIsMoving(true);
    (0, TileEditor_js_1.removeAllButtons)();
    canvas_js_1.canvas.addEventListener('click', moveComponentHandler);
    canvas_js_1.canvas.addEventListener('mousemove', moveComponent);
    canvas_js_1.canvas.addEventListener('mousedown', moveComponent);
}
function spawnComponentElements(edit) {
    (0, TileEditor_js_1.removeAllButtons)();
    if (edit) {
        (0, Elements_js_1.spawnButton)(document, 'buttonPlace', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[64], function () {
            updateComponent();
            (0, TileEditor_js_1.unchooseEverything)();
            (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
        });
    }
    (0, Elements_js_1.spawnButton)(document, 'buttonPlace', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[79], function () {
        (0, TileEditor_js_1.removeAllButtons)();
        (0, TileEditor_js_1.removeAllListenersAdded)();
        (0, canvas_js_1.mainMenu)();
    });
    (0, Elements_js_1.spawnButton)(document, 'buttonPlace', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[80], function () {
        canvas_js_1.game.getBackground().deleteFromUndoLog();
        (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
    });
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[81], true);
    (0, Elements_js_1.spawnSliderWithValueShower)(document, 'tileEditingPlace', 'componentSizeSlider', clientSocket_js_1.texts[81], '30', '300', '10', '100');
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[82], true);
    (0, Elements_js_1.spawnColorPicker)(document, 'tileEditingPlace', 'componentColorPicker', clientSocket_js_1.texts[82]);
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[83], true);
    (0, Elements_js_1.spawnSliderWithValueShower)(document, 'tileEditingPlace', 'componentOutlineSlider', clientSocket_js_1.texts[83], '0', '20', '10', '100');
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[84], true);
    (0, Elements_js_1.spawnColorPicker)(document, 'tileEditingPlace', 'componentOutlineColorPicker', clientSocket_js_1.texts[84]);
    //spawnParagraph(document,'tileEditingPlace','',texts[85],true)
    (0, Elements_js_1.spawnSelectMenu)(document, 'tileEditingPlace', 'componentTypeMenu', clientSocket_js_1.texts[85], ['btn', 'btn-secondary'], ['circle', 'square', 'image']);
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[86], true);
    (0, Elements_js_1.spawnImageInput)(document, 'tileEditingPlace', 'componentImage', clientSocket_js_1.texts[86], clientSocket_js_1.texts[86], function () {
        if (document.getElementById('componentImage').files.length > 0) {
            canvas_js_1.game.getBackground().setNextComponentImage(new Image());
            canvas_js_1.game.getBackground().getNextComponentImage().src = URL.createObjectURL(document.getElementById('componentImage').files[0]);
            canvas_js_1.game.getBackground().getNextComponentImage().onload = function () {
                //showActualState()
            };
        }
        else {
            canvas_js_1.game.getBackground().setNextComponentImage(undefined);
        }
    });
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[87], true);
    (0, Elements_js_1.spawnSliderWithValueShower)(document, 'tileEditingPlace', 'componentWidthSlider', clientSocket_js_1.texts[87], '1', '500', '10', '100');
    (0, Elements_js_1.spawnParagraph)(document, 'tileEditingPlace', '', clientSocket_js_1.texts[88], true);
    (0, Elements_js_1.spawnSliderWithValueShower)(document, 'tileEditingPlace', 'componentHeightSlider', clientSocket_js_1.texts[88], '1', '500', '10', '100');
}
var editComponent = function () {
};
exports.editComponent = editComponent;
var insertComponent = function (event) {
    var size = canvas_js_1.doc.getElementById('componentSizeSlider').value.slice();
    var color = canvas_js_1.doc.getElementById('componentColorPicker').value.slice();
    var stroke = canvas_js_1.doc.getElementById('componentOutlineSlider').value.slice();
    var colorStroke = canvas_js_1.doc.getElementById('componentOutlineColorPicker').value.slice();
    var type = canvas_js_1.doc.getElementById('componentTypeMenu').value.slice();
    var image = canvas_js_1.game.getBackground().getNextComponentImage();
    var imageWidth = canvas_js_1.doc.getElementById('componentWidthSlider').value.slice();
    var imageHeight = canvas_js_1.doc.getElementById('componentHeightSlider').value.slice();
    var createdComponent = canvas_js_1.game.getBackground().createComponent(event, type, parseInt(size), color, parseInt(stroke), colorStroke, image, parseInt(imageWidth), parseInt(imageHeight));
    return createdComponent;
};
var updateComponent = function () {
    var size = canvas_js_1.doc.getElementById('componentSizeSlider').value.slice();
    var color = canvas_js_1.doc.getElementById('componentColorPicker').value.slice();
    var stroke = canvas_js_1.doc.getElementById('componentOutlineSlider').value.slice();
    var colorStroke = canvas_js_1.doc.getElementById('componentOutlineColorPicker').value.slice();
    var type = canvas_js_1.doc.getElementById('componentTypeMenu').value.slice();
    var imageWidth = canvas_js_1.doc.getElementById('componentWidthSlider').value.slice();
    var imageHeight = canvas_js_1.doc.getElementById('componentHeightSlider').value.slice();
    var component = canvas_js_1.game.getBackground().getChoosenComponent();
    component === null || component === void 0 ? void 0 : component.setRadius(parseInt(size));
    component === null || component === void 0 ? void 0 : component.setColor(color);
    component === null || component === void 0 ? void 0 : component.setStroke(parseInt(stroke));
    component === null || component === void 0 ? void 0 : component.setStrokeColor(colorStroke);
    component === null || component === void 0 ? void 0 : component.setType(type);
    component === null || component === void 0 ? void 0 : component.setImage(canvas_js_1.game.getBackground().getNextComponentImage());
    component === null || component === void 0 ? void 0 : component.setImageWidth(parseInt(imageWidth));
    component === null || component === void 0 ? void 0 : component.setImageHeight(parseInt(imageHeight));
    (0, canvas_js_1.reload)(canvas_js_1.game, canvas_js_1.ctx);
};
function setElements() {
    var _a, _b, _c, _d, _e, _f, _g;
    canvas_js_1.doc.getElementById('componentSizeSlider').value = (_a = canvas_js_1.game.getBackground().getChoosenComponent()) === null || _a === void 0 ? void 0 : _a.getRadius().toString();
    canvas_js_1.doc.getElementById('componentColorPicker').value = (_b = canvas_js_1.game.getBackground().getChoosenComponent()) === null || _b === void 0 ? void 0 : _b.getColor();
    canvas_js_1.doc.getElementById('componentOutlineSlider').value = (_c = canvas_js_1.game.getBackground().getChoosenComponent()) === null || _c === void 0 ? void 0 : _c.getStroke().toString();
    canvas_js_1.doc.getElementById('componentOutlineColorPicker').value = (_d = canvas_js_1.game.getBackground().getChoosenComponent()) === null || _d === void 0 ? void 0 : _d.getStrokeColor();
    canvas_js_1.doc.getElementById('componentTypeMenu').value = (_e = canvas_js_1.game.getBackground().getChoosenComponent()) === null || _e === void 0 ? void 0 : _e.getType();
    canvas_js_1.doc.getElementById('componentWidthSlider').value = (_f = canvas_js_1.game.getBackground().getChoosenComponent()) === null || _f === void 0 ? void 0 : _f.getImageWidth().toString();
    canvas_js_1.doc.getElementById('componentHeightSlider').value = (_g = canvas_js_1.game.getBackground().getChoosenComponent()) === null || _g === void 0 ? void 0 : _g.getImageHeight().toString();
}
function addComponentMenu() {
    spawnComponentElements(false);
    (0, TileEditor_js_1.removeAllListenersAdded)();
    TileEditor_js_1.unchooseEverything;
    canvas_js_1.canvas.addEventListener('click', insertComponent);
}
exports.addComponentMenu = addComponentMenu;
function moveComponentMenu() {
    (0, TileEditor_js_1.removeAllButtons)();
    (0, TileEditor_js_1.removeAllListenersAdded)();
    (0, Elements_js_1.spawnButton)(document, 'tileEditingPlace', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[89], function () { (0, TileEditor_js_1.saveInsertingTiles)(); });
    moveComponents();
}
exports.moveComponentMenu = moveComponentMenu;
function editComponentMenu() {
    (0, TileEditor_js_1.removeAllButtons)();
    (0, TileEditor_js_1.removeAllListenersAdded)();
    spawnComponentElements(true);
    canvas_js_1.canvas.addEventListener('click', function (event) {
        canvas_js_1.game.getBackground().findComponent(event, false);
        setElements();
    });
}
exports.editComponentMenu = editComponentMenu;
function deleteComponentMenu() {
    (0, TileEditor_js_1.removeAllButtons)();
    (0, TileEditor_js_1.removeAllListenersAdded)();
    canvas_js_1.canvas.addEventListener('click', deleteComponent);
    (0, Elements_js_1.spawnButton)(document, 'tileEditingPlace', '', ['btn', 'btn-secondary'], clientSocket_js_1.texts[90], function () { (0, TileEditor_js_1.saveInsertingTiles)(); });
}
exports.deleteComponentMenu = deleteComponentMenu;
function removeAllComponentListeners() {
    canvas_js_1.canvas.removeEventListener('click', insertComponent);
    canvas_js_1.canvas.removeEventListener('click', moveComponentHandler);
    canvas_js_1.canvas.removeEventListener('mousemove', moveComponent);
    canvas_js_1.canvas.removeEventListener('mousedown', moveComponent);
    canvas_js_1.canvas.removeEventListener('click', deleteComponent);
}
exports.removeAllComponentListeners = removeAllComponentListeners;
