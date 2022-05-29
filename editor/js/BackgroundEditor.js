"use strict";
exports.__esModule = true;
exports.editBackground = void 0;
var Canvas_js_1 = require("./Canvas.js");
var ClientSocket_js_1 = require("./ClientSocket.js");
var Elements_js_1 = require("./Elements.js");
var TileEditor_js_1 = require("./TileEditor.js");
var background = undefined;
function editBackground() {
    (0, TileEditor_js_1.removeAllButtons)();
    (0, TileEditor_js_1.removeAllListenersAdded)();
    (0, Elements_js_1.spawnHeading)(document, 'buttonPlace', '', ClientSocket_js_1.texts[233]);
    (0, Elements_js_1.spawnImageInput)(document, 'tileEditingPlace', 'backgroundImage', '', ClientSocket_js_1.texts[91], function () {
        var backgroundImage = document.getElementById('backgroundImage');
        if (backgroundImage.files.length > 0) {
            background = new Image();
            background.src = URL.createObjectURL(backgroundImage.files[0]);
            background.onload = function () {
                Canvas_js_1.game.getBackground().setBackgroundImage(background);
                (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
                console.log('16');
            };
        }
    });
    var coloPicker = (0, Elements_js_1.spawnColorPicker)(document, 'tileEditingPlace', 'colorPicker', ClientSocket_js_1.texts[95], function () {
        Canvas_js_1.game.getBackground().setColor(document.getElementById('colorPicker').value);
        Canvas_js_1.game.getBackground().setBackgroundImage(undefined);
        (0, Canvas_js_1.reload)(Canvas_js_1.ctx);
        console.log('17');
    });
    coloPicker.value = Canvas_js_1.game.getBackground().getColor();
}
exports.editBackground = editBackground;
