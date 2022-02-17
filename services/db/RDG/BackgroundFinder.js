"use strict";
exports.__esModule = true;
exports.BackgroundFinder = void 0;
var DbConnect_1 = require("../DbConnect");
var BackgroundFinder = /** @class */ (function () {
    function BackgroundFinder() {
    }
    BackgroundFinder.getIntance = function () { return this.INSTANCE; };
    BackgroundFinder.prototype.findBackgroundByGameName = function (name) {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'select-gameTiles',
            text: 'SELECT * FROM "bachelorsThesis"."Game" as g INNER JOIN "bachelorsThesis"."Background" as t on t."gameName" = g.name  WHERE g.name=$1;',
            values: [name]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    BackgroundFinder.INSTANCE = new BackgroundFinder();
    return BackgroundFinder;
}());
exports.BackgroundFinder = BackgroundFinder;
