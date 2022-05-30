"use strict";
exports.__esModule = true;
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(account, token) {
        this.id = 0;
        this.token = '';
        this.place = 0;
        this.skip = 0;
        this.repeat = 0;
        this.mustThrown = 0;
        //this.id = id;
        this.account = account;
    }
    //constructor(){}
    Player.prototype.getId = function () {
        return this.id;
    };
    Player.prototype.setId = function (newId) {
        this.id = newId;
    };
    Player.prototype.getPlace = function () {
        return this.place;
    };
    Player.prototype.setPlace = function (newPlace) {
        this.place = newPlace;
    };
    Player.prototype.getAccount = function () {
        return this.account;
    };
    Player.prototype.setAccount = function (newAccount) {
        this.account = newAccount;
    };
    Player.prototype.getToken = function () {
        return this.token;
    };
    Player.prototype.setToken = function (token) {
        this.token = token;
    };
    Player.prototype.getSkip = function () {
        return this.skip;
    };
    Player.prototype.setSkip = function (newSkip) {
        this.skip = newSkip;
    };
    Player.prototype.getRepeat = function () {
        return this.repeat;
    };
    Player.prototype.setRepeat = function (newRepeat) {
        this.repeat = newRepeat;
    };
    Player.prototype.getMustThrown = function () {
        return this.mustThrown;
    };
    Player.prototype.setMustThrown = function (newThrown) {
        this.mustThrown = newThrown;
    };
    return Player;
}());
exports.Player = Player;
module.exports = Player;
