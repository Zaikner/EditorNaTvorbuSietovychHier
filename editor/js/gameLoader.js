"use strict";
exports.__esModule = true;
exports.loadGameMenu = void 0;
var canvas_1 = require("./canvas");
var clientSocket_1 = require("./clientSocket");
var Elements_1 = require("./Elements");
var TileEditor_1 = require("./TileEditor");
function loadGameMenu(names) {
    (0, TileEditor_1.removeAllButtons)();
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', clientSocket_1.texts[15]);
    var div = (0, Elements_1.spawnDiv)(document, 'tileEditingPlace', 'divWrapper1', []);
    var menu = (0, Elements_1.spawnSelectMenu)(document, 'divWrapper1', '', '', ['btn', 'btn-secondary'], names);
    menu.style.float = 'left';
    var button = (0, Elements_1.spawnButton)(document, menu.parentElement.id, '', ['btn', 'btn-secondary', 'buttonLeftMargin'], clientSocket_1.texts[15], function () {
        (0, TileEditor_1.removeAllButtons)();
        clientSocket_1.editorSocket.emit('load game', { id: (0, clientSocket_1.getCookie)('id'), name: menu.value, response: true });
        (0, canvas_1.mainMenu)();
    });
    button.style.float = 'left';
}
exports.loadGameMenu = loadGameMenu;
