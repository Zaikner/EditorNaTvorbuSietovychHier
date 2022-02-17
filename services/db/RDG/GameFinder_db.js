"use strict";
exports.__esModule = true;
exports.GameFinder = void 0;
var DbConnect_1 = require("../DbConnect");
var GameFinder = /** @class */ (function () {
    function GameFinder() {
    }
    GameFinder.getIntance = function () { return this.INSTANCE; };
    GameFinder.prototype.findByName = function (name) {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'select-game',
            text: 'SELECT * FROM "bachelorsThesis"."Game" WHERE name=$1;',
            values: [name]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    GameFinder.INSTANCE = new GameFinder();
    return GameFinder;
}());
exports.GameFinder = GameFinder;
