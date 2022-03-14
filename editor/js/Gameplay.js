"use strict";
exports.__esModule = true;
exports.initGameInfo = void 0;
var Elements_1 = require("./Elements");
var canvas_1 = require("./canvas");
function initGameInfo(name) {
    (0, Elements_1.spawnParagraph)(canvas_1.doc, "tileEditingPlace", '', 'Game: ' + name);
}
exports.initGameInfo = initGameInfo;
