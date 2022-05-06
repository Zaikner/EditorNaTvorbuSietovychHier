"use strict";
exports.__esModule = true;
exports.Question = void 0;
var DbConnect_1 = require("../DbConnect");
var Question = /** @class */ (function () {
    function Question() {
        this.id = 0;
        this.text = '';
        this.authorId = 0;
    }
    ;
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
    Question.prototype.getAuthorId = function () {
        return this.authorId;
    };
    Question.prototype.setAuthorId = function (newAuthor) {
        this.authorId = newAuthor;
    };
    Question.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-question',
            text: 'INSERT INTO bachelors_thesis.questions(id,text,author_id) VALUES($1,$2,$3);',
            values: [this.id, this.text, this.authorId]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Question.prototype.upsert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'upsert-question',
            text: 'INSERT INTO bachelors_thesis.questions(id,text,author_id) VALUES($1,$2,$3)  ON CONFLICT(id) DO UPDATE SET id = EXCLUDED.id, text = EXCLUDED.text, author_id = EXCLUDED.author_id',
            values: [this.id, this.text, this.authorId]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Question.prototype.update = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'update-question',
            text: 'UPDATE bachelors_thesis.questions SET text = $1 ,author_id = $2 WHERE id = $3;',
            values: [this.text, this.authorId, this.id]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    Question.prototype["delete"] = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'delete-question',
            text: 'DELETE from bachelors_thesis.questions WHERE id = $1;',
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
        ret.setAuthorId(data.author_id);
        return ret;
    };
    return Question;
}());
exports.Question = Question;
