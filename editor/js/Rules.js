"use strict";
exports.__esModule = true;
exports.rulesMenu = void 0;
var canvas_1 = require("./canvas");
var clientSocket_1 = require("./clientSocket");
var Elements_1 = require("./Elements");
var TileEditor_1 = require("./TileEditor");
function rulesMenu() {
    (0, TileEditor_1.removeAllListenersAdded)();
    //elementDeleter(parent)
    var field;
    if (clientSocket_1.isEditor) {
        (0, TileEditor_1.removeAllButtons)();
        (0, Elements_1.spawnHeading)(document, 'tileEditingPlace', '', clientSocket_1.texts[16]);
        field = (0, Elements_1.spawnTextArea)(document, 'tileEditingPlace', 'ruleInput', '', false);
        field.style.width = '120%;';
        field.style.height = '50%;';
    }
    else {
        field = document.getElementById('ruleInput');
        $('#rulesModal').modal('show');
    }
    //let field:HTMLTextAreaElement = spawnTextArea(document,'tileEditingPlace','ruleInput','',false)
    field.onchange = function () {
        canvas_1.game.setRules(field.value);
    };
}
exports.rulesMenu = rulesMenu;
