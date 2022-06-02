"use strict";
exports.__esModule = true;
exports.loadGameMenu = void 0;
var Canvas_1 = require("./Canvas");
var ClientSocket_1 = require("./ClientSocket");
var Elements_1 = require("./Elements");
var TileEditor_1 = require("./TileEditor");
function loadGameMenu(names, authored) {
    (0, TileEditor_1.removeAllButtons)();
    (0, TileEditor_1.removeAllListenersAdded)();
    (0, Elements_1.spawnHeading)(document, 'buttonPlace', '', ClientSocket_1.texts[15]);
    var div = (0, Elements_1.spawnDiv)(document, 'tileEditingPlace', 'divWrapper1', []);
    var button = document.createElement('button');
    button.textContent = ClientSocket_1.texts[251];
    ['btn', 'btn-secondary'].forEach(function (add) {
        button.classList.add(add);
    });
    button.onclick = function () {
        (0, TileEditor_1.removeAllButtons)();
        ClientSocket_1.editorSocket.emit('load game', { id: (0, ClientSocket_1.getCookie)('id'), name: menu.value, response: true });
        (0, Canvas_1.mainMenu)();
    };
    button.style.whiteSpace = 'nowrap';
    button.style.marginRight = '1%';
    var menu = (0, Elements_1.spawnSelectMenu)(document, 'divWrapper1', '', '', ['btn', 'btn-secondary'], names, authored, button);
    menu.style.float = 'left';
    button = (0, Elements_1.spawnButton)(document, 'tileEditingPlace', ClientSocket_1.texts[252], ['btn', 'btn-secondary'], ClientSocket_1.texts[252], function () {
        (0, Canvas_1.initNewGame)();
        (0, Canvas_1.reload)(Canvas_1.ctx);
    });
    button.style.marginRight = '3%;';
    button.style.marginLeft = '3%;';
    (0, Elements_1.spawnButton)(document, 'tileEditingPlace', ClientSocket_1.texts[260], ['btn', 'btn-secondary'], ClientSocket_1.texts[260], function () {
        $('#deleteGameModal').modal('show');
    });
}
exports.loadGameMenu = loadGameMenu;
