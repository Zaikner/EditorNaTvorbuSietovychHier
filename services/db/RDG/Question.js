"use strict";
exports.__esModule = true;
exports.Question = void 0;
var DbConnect_1 = require("../DbConnect");
var Question = /** @class */ (function () {
    function Question() {
        this.id = 0;
        this.text = '';
        this.author = '';
    }
    Question.prototype.getId = function () {
        return this.id;
    };
    Question.prototype.setId = function (newId) {
        this.id = newId;
    };
    Question.prototype.getText = function () {
        return this.text;
    };
    Question.prototype.setText = function (newName) {
        this.text = newName;
    };
    Question.prototype.getAuthor = function () {
        return this.author;
    };
    Question.prototype.setAuthor = function (newAuthor) {
        this.author = newAuthor;
    };
    Question.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-question',
            text: 'INSERT INTO "bachelorsThesis"."Question"(id,text,author) VALUES($1,$2,$3);',
            values: [this.id, this.text, this.author]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Question.prototype.upsert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'upsert-question',
            text: 'INSERT INTO "bachelorsThesis"."Question"(id,text,author) VALUES($1,$2,$3)  ON CONFLICT(id) DO UPDATE SET id = EXCLUDED.id, text = EXCLUDED.text, author = EXCLUDED.author',
            values: [this.id, this.text, this.author]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Question.prototype.update = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'update-question',
            text: 'UPDATE "bachelorsThesis"."Question" SET text = $1 ,author = $2 WHERE id = $3;',
            values: [this.text, this.author, this.id]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Question.prototype["delete"] = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'delete-question',
            text: 'DELETE from "bachelorsThesis"."Question" WHERE id = $1;',
            values: [this.id]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Question.load = function (data) {
        var ret = new Question();
        ret.setId(data.id);
        ret.setText(data.text);
        ret.setAuthor(data.author);
        return ret;
    };
    return Question;
}());
exports.Question = Question;
