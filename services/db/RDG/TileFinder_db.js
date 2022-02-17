"use strict";
exports.__esModule = true;
exports.TileFinder = void 0;
var DbConnect_1 = require("../DbConnect");
var TileFinder = /** @class */ (function () {
    function TileFinder() {
    }
    TileFinder.getIntance = function () { return this.INSTANCE; };
    TileFinder.prototype.findTileByGameName = function (name) {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'select-gameTiles',
            text: 'SELECT * FROM "bachelorsThesis"."Game" as g INNER JOIN "bachelorsThesis"."Tile" as t on t."gameName" = g.name  WHERE g.name=$1;',
            values: [name]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    TileFinder.INSTANCE = new TileFinder();
    return TileFinder;
}());
exports.TileFinder = TileFinder;
