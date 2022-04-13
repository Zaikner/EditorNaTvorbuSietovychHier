"use strict";
exports.__esModule = true;
exports.Texts = void 0;
var Texts = /** @class */ (function () {
    function Texts() {
        this.id = 0;
        this.EN = '';
        this.SK = '';
    }
    Texts.prototype.getId = function () {
        return this.id;
    };
    Texts.prototype.setId = function (newId) {
        this.id = newId;
    };
    Texts.prototype.getEN = function () {
        return this.EN;
    };
    Texts.prototype.setEN = function (newEN) {
        this.EN = newEN;
    };
    Texts.prototype.getSK = function () {
        return this.SK;
    };
    Texts.prototype.setSK = function (newSK) {
        this.SK = newSK;
    };
    Texts.load = function (data) {
        var ret = new Texts();
        ret.setId(data.id);
        ret.setEN(data.EN);
        ret.setSK(data.SK);
        return ret;
    };
    return Texts;
}());
exports.Texts = Texts;
