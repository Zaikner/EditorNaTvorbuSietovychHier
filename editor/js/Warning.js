"use strict";
exports.__esModule = true;
exports.Warning = void 0;
var canvas_1 = require("./canvas");
var Elements_js_1 = require("./Elements.js");
var Warning = /** @class */ (function () {
    function Warning() {
    }
    Warning.show = function (txt) {
        (0, canvas_1.elementDeleter)('warningModalBody');
        var p = (0, Elements_js_1.spawnParagraph)(canvas_1.doc, 'warningModalBody', '', txt);
        $('#WarningModal').modal('toggle');
    };
    return Warning;
}());
exports.Warning = Warning;
