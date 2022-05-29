"use strict";
exports.__esModule = true;
exports.rulesMenu = void 0;
var Canvas_1 = require("./Canvas");
var ClientSocket_1 = require("./ClientSocket");
var Elements_1 = require("./Elements");
var TileEditor_1 = require("./TileEditor");
function rulesMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    var field;
    if (ClientSocket_1.isEditor) {
        (0, TileEditor_1.removeAllButtons)();
        (0, Elements_1.spawnHeading)(document, 'tileEditingPlace', '', ClientSocket_1.texts[16]);
        field = (0, Elements_1.spawnTextArea)(document, 'tileEditingPlace', 'ruleInput', '', false);
        field.style.width = '120%;';
        field.style.height = '50%;';
    }
    else {
        field = document.getElementById('ruleInput');
        $('#rulesModal').modal('show');
    }
    field.onchange = function () {
        Canvas_1.game.setRules(field.value);
    };
}
exports.rulesMenu = rulesMenu;
