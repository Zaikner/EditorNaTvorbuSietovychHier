"use strict";
exports.__esModule = true;
exports.Warning = void 0;
var Canvas_1 = require("./Canvas");
var Elements_js_1 = require("./Elements.js");
var Warning = /** @class */ (function () {
    function Warning() {
    }
    Warning.show = function (txt) {
        (0, Canvas_1.elementDeleter)('warningModalBody');
        var p = (0, Elements_js_1.spawnParagraph)(Canvas_1.doc, 'warningModalBody', '', txt, false);
        $('#WarningModal').modal('toggle');
    };
    Warning.showInGame = function (txt) {
        (0, Canvas_1.elementDeleter)('InGameModalBody');
        var p = (0, Elements_js_1.spawnParagraph)(Canvas_1.doc, 'InGameModalBody', '', txt, false);
        $('#InGameModal').modal('toggle');
    };
    return Warning;
}());
exports.Warning = Warning;
