"use strict";
// import { Game_db } from "./Game_db";
// import { DbConnect } from "../DbConnect";
// import { Tile_db } from "./Tile_db";
// export class TileFinder{
//     private static INSTANCE:TileFinder = new TileFinder()
//     public static getIntance():TileFinder{return this.INSTANCE}
exports.__esModule = true;
exports.TileFinder = void 0;
var TileFinder = /** @class */ (function () {
    function TileFinder() {
    }
    TileFinder.getIntance = function () { return this.INSTANCE; };
    TileFinder.INSTANCE = new TileFinder();
    return TileFinder;
}());
exports.TileFinder = TileFinder;
