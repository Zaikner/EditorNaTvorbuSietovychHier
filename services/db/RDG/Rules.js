"use strict";
exports.__esModule = true;
exports.Rules = void 0;
var DbConnect_1 = require("../DbConnect");
var Rules = /** @class */ (function () {
    function Rules() {
        this.id = 0;
        this.text = '';
        this.gameName = '';
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
    Rules.prototype.getGameName = function () {
        return this.gameName;
    };
    Rules.prototype.setGameName = function (newName) {
        this.gameName = newName;
    };
    Rules.prototype.upsert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'upsert-rules',
            text: 'INSERT INTO "bachelorsThesis"."Rule"(text,"gameName") VALUES($1,$2) ON CONFLICT("gameName") DO UPDATE SET text = EXCLUDED.text,"gameName"=EXCLUDED."gameName";',
            values: [this.text, this.gameName]
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
        ret.setGameName(data.gameName);
        return ret;
    };
    return Rules;
}());
exports.Rules = Rules;
