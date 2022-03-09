"use strict";
exports.__esModule = true;
exports.editBackground = void 0;
var canvas_js_1 = require("./canvas.js");
var TileEditor_js_1 = require("./TileEditor.js");
var background = undefined;
function editBackground() {
    (0, TileEditor_js_1.removeAllButtons)();
    (0, TileEditor_js_1.removeAllListenersAdded)();
    var backgroundChecker = canvas_js_1.doc.createElement('input');
    backgroundChecker.type = 'checkbox';
    backgroundChecker.id = 'backgroundChecker';
    var text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Is background an Image? (checkbox)';
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
    var backgroundImage = canvas_js_1.doc.createElement('input');
    backgroundImage.id = 'backgroundImage';
    backgroundImage.type = 'file';
    backgroundImage.accept = ".jpg, .jpeg, .png";
    backgroundImage.textContent = 'Choose an Image!';
    backgroundImage.oninput = function () {
        if (backgroundImage.files.length > 0) {
            background = new Image();
            background.src = URL.createObjectURL(backgroundImage.files[0]);
        }
        else {
            background = undefined;
        }
    };
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(backgroundImage);
    var buttonSubmit = canvas_js_1.doc.createElement('button');
    buttonSubmit.id = 'changeBackground';
    buttonSubmit.textContent = 'Change!';
    buttonSubmit.classList.add("btn");
    buttonSubmit.classList.add("btn-dark");
    canvas_js_1.doc.getElementById("buttonPlace").appendChild(buttonSubmit);
    canvas_js_1.doc.getElementById("changeBackground").addEventListener('click', function () {
        if (backgroundChecker.checked) {
            canvas_js_1.editor.getGame().getBackground().setBackgroundImage(background);
        }
        else {
            canvas_js_1.editor.getGame().getBackground()["delete"]();
        }
        canvas_js_1.editor.getGame().getBackground().setColor(colorPicker.value);
        (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    });
    var buttonDelete = canvas_js_1.doc.createElement('button');
    buttonDelete.id = 'deleteBackground';
    buttonDelete.textContent = 'Delete Background!';
    buttonDelete.classList.add("btn");
    buttonDelete.classList.add("btn-dark");
    canvas_js_1.doc.getElementById("buttonPlace").appendChild(buttonDelete);
    canvas_js_1.doc.getElementById("deleteBackground").addEventListener('click', function () {
        canvas_js_1.editor.getGame().getBackground()["delete"]();
        (0, canvas_js_1.reload)(canvas_js_1.editor, canvas_js_1.ctx);
    });
    var colorPicker = canvas_js_1.doc.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'colorPicker';
    text = canvas_js_1.doc.createElement('p');
    text.textContent = 'Choose color of background:';
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(text);
    canvas_js_1.doc.getElementById("tileEditingPlace").appendChild(colorPicker);
}
exports.editBackground = editBackground;
