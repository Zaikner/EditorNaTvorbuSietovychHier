"use strict";
exports.__esModule = true;
exports.QuestionOption = void 0;
var DbConnect_1 = require("../DbConnect");
var QuestionOption = /** @class */ (function () {
    function QuestionOption() {
        this.id = 0;
        this.text = '';
        this.questionId = 0;
        this.isAnswer = true;
    }
    QuestionOption.prototype.getId = function () {
        return this.id;
    };
    QuestionOption.prototype.setId = function (newId) {
        this.id = newId;
    };
    QuestionOption.prototype.getQuestionId = function () {
        return this.questionId;
    };
    QuestionOption.prototype.setQuestionId = function (newId) {
        this.questionId = newId;
    };
    QuestionOption.prototype.getText = function () {
        return this.text;
    };
    QuestionOption.prototype.setText = function (newName) {
        this.text = newName;
    };
    QuestionOption.prototype.getIsAnswer = function () {
        return this.isAnswer;
    };
    QuestionOption.prototype.setIsAnswer = function (newAnswer) {
        this.isAnswer = newAnswer;
    };
    QuestionOption.prototype.insert = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'insert-option',
            text: 'INSERT INTO "bachelorsThesis"."Option"(text,"questionId","isAnswer") VALUES($1,$2,$3);',
            values: [this.text, this.questionId, this.isAnswer]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    QuestionOption.prototype.update = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'update-option',
            text: 'UPDATE "bachelorsThesis"."Option" SET text = $1, "isAnswer" = $2 WHERE id = $3;',
            values: [this.text, this.isAnswer, this.id]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    QuestionOption.prototype["delete"] = function () {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'delete-option',
            text: 'DELETE FROM "bachelorsThesis"."Option" WHERE id = $1;',
            values: [this.id]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    QuestionOption.load = function (data) {
        var ret = new QuestionOption();
        ret.setId(data.id);
        ret.setQuestionId(data.questionId);
        ret.setText(data.text);
        ret.setIsAnswer(data.isAnswer);
        return ret;
    };
    return QuestionOption;
}());
exports.QuestionOption = QuestionOption;
