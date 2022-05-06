"use strict";
exports.__esModule = true;
exports.Rules = void 0;
var DbConnect_1 = require("../DbConnect");
var Rules = /** @class */ (function () {
    function Rules() {
        this.id = 0;
        this.text = '';
        this.gameId = 0;
    }
    Rules.prototype.getId = function () {
        return this.id;
    };
    Rules.prototype.setId = function (newId) {
        this.id = newId;
    };
    Rules.prototype.getText = function () {
        return this.text;
    };
    Rules.prototype.setText = function (newName) {
        this.text = newName;
    };
    Rules.prototype.getGameId = function () {
        return this.gameId;
    };
    Rules.prototype.setGameId = function (newId) {
        this.gameId = newId;
    };
    Rules.prototype.upsert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'upsert-rules',
            text: 'INSERT INTO bachelors_thesis.rules(text,game_id) VALUES($1,$2) ON CONFLICT(game_id) DO UPDATE SET text = EXCLUDED.text,game_id=EXCLUDED.game_id;',
            values: [this.text, this.gameId]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    // public update(){
    //             let client = DbConnect.get()
    //                 const query = {
    //                     name: 'update-rules',
    //                     text: 'UPDATE "bachelorsThesis"."Rules" SET text = $1 WHERE id = $2;',
    //                     values: [this.text,this.id],
    //                   }
    //                   client
    //                   .query(query)
    //                   .then((res:any) => console.log(res.rows[0]))
    //                   .catch((e:Error) => console.error(e.stack))}
    Rules.load = function (data) {
        var ret = new Rules();
        ret.setId(data.id);
        ret.setText(data.text);
        ret.setGameId(data.game_id);
        return ret;
    };
    return Rules;
}());
exports.Rules = Rules;
