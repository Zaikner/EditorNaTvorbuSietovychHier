"use strict";
exports.__esModule = true;
exports.Account = void 0;
var Account_db_1 = require("../../services/db/RDG/Account_db");
var Account = /** @class */ (function () {
    function Account(name, password) {
        this.id = 0;
        this.avatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBJRXhpZgAASUkqAAgAAAABAA4BAgAnAAAAGgAAAAAAAABCbGFuayBNYW4gUHJvZmlsZSBIZWFkIEljb24gUGxhY2Vob2xkZXL/4QVHaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpJcHRjNHhtcENvcmU9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBDb3JlLzEuMC94bWxucy8iICAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSJodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcy9pU3RvY2twaG90byIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjEyOTgyNjE1MzciIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9sZWdhbC9saWNlbnNlLWFncmVlbWVudD91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29v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';
        this.clientId = '';
        this.isGuest = false;
        this.socketId = '';
        this.score = 0;
        this.gameLost = 0;
        this.gameWon = 0;
        this.ping = 0;
        this.activeInRoom = undefined;
        this.name = name;
        this.password = password;
    }
    Account.prototype.save = function () {
        var newAcc = new Account_db_1.Account_db();
        newAcc.setAvatar(this.avatar);
        newAcc.setPassword(this.password);
        newAcc.setScore(this.score);
        newAcc.setName(this.name);
        newAcc.setGameWon(this.gameWon);
        newAcc.setGameLost(this.gameLost);
        console.log('updatoval:');
        console.log(newAcc);
        newAcc.update();
    };
    Account.prototype.addPing = function () {
        var acc = this;
        setInterval(function () {
            acc.setPing(acc.getPing() + 1);
        }, 5000);
    };
    Account.prototype.getScore = function () {
        return this.score;
    };
    Account.prototype.setScore = function (newScore) {
        this.score = newScore;
    };
    Account.prototype.getName = function () {
        return this.name;
    };
    Account.prototype.setName = function (newName) {
        this.name = newName;
    };
    Account.prototype.getPassword = function () {
        return this.password;
    };
    Account.prototype.setPassword = function (newPassword) {
        this.password = newPassword;
    };
    Account.prototype.getAvatar = function () {
        return this.avatar;
    };
    Account.prototype.setAvatar = function (newAvatar) {
        this.avatar = newAvatar;
    };
    Account.prototype.getClientId = function () {
        return this.clientId;
    };
    Account.prototype.setClientId = function (newId) {
        this.clientId = newId;
    };
    Account.prototype.getIsGuest = function () {
        return this.isGuest;
    };
    Account.prototype.setIsGuest = function (is) {
        this.isGuest = is;
    };
    Account.prototype.getSocketId = function () {
        return this.socketId;
    };
    Account.prototype.setSocketId = function (newId) {
        this.socketId = newId;
    };
    Account.prototype.getGameWon = function () {
        return this.gameWon;
    };
    Account.prototype.setGameWon = function (newScore) {
        this.gameWon = newScore;
    };
    Account.prototype.getGameLost = function () {
        return this.gameLost;
    };
    Account.prototype.setGameLost = function (newScore) {
        this.gameLost = newScore;
    };
    Account.prototype.getPing = function () {
        return this.ping;
    };
    Account.prototype.setPing = function (newScore) {
        this.ping = newScore;
    };
    Account.prototype.getId = function () {
        return this.id;
    };
    Account.prototype.setId = function (newId) {
        this.id = newId;
    };
    Account.prototype.getActiveInRoom = function () {
        return this.activeInRoom;
    };
    Account.prototype.setActiveInRoom = function (room) {
        this.activeInRoom = room;
    };
    return Account;
}());
exports.Account = Account;
