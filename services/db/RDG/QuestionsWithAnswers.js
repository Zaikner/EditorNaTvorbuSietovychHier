"use strict";
exports.__esModule = true;
exports.QuestionWithAnswers = void 0;
var DbConnect_1 = require("../DbConnect");
var QuestionWithAnswers = /** @class */ (function () {
    function QuestionWithAnswers() {
        this.questionId = 0;
        this.optionId = 0;
        this.questionText = '';
        this.optionText = '';
        this.author = '';
        this.isAnswer = false;
    }
    QuestionWithAnswers.prototype.getQuestionId = function () {
        return this.questionId;
    };
    QuestionWithAnswers.prototype.setQuestionId = function (newId) {
        this.questionId = newId;
    };
    QuestionWithAnswers.prototype.getOptionId = function () {
        return this.optionId;
    };
    QuestionWithAnswers.prototype.setOptionId = function (newId) {
        this.optionId = newId;
    };
    QuestionWithAnswers.prototype.getOptionText = function () {
        return this.optionText;
    };
    QuestionWithAnswers.prototype.setOptionText = function (newText) {
        this.optionText = newText;
    };
    QuestionWithAnswers.prototype.getQuestionText = function () {
        return this.questionText;
    };
    QuestionWithAnswers.prototype.setQuestionText = function (newText) {
        this.questionText = newText;
    };
    QuestionWithAnswers.prototype.getAuthor = function () {
        return this.author;
    };
    QuestionWithAnswers.prototype.setAuthor = function (newAuthor) {
        this.author = newAuthor;
    };
    QuestionWithAnswers.prototype.getIsAnswer = function () {
        return this.isAnswer;
    };
    QuestionWithAnswers.prototype.setIsAnswer = function (newAnswer) {
        this.isAnswer = newAnswer;
    };
    QuestionWithAnswers.prototype.deleteOptionsByQuestionId = function (questionId) {
        var client = DbConnect_1.DbConnect.get();
        var query = {
            name: 'delete-option',
            text: 'DELETE FROM "bachelorsThesis"."Option" WHERE "questionId" = $1',
            values: [questionId]
        };
        client
            .query(query)
            .then(function (res) { return console.log(res.rows[0]); })["catch"](function (e) { return console.error(e.stack); });
    };
    QuestionWithAnswers.load = function (data) {
        console.log(data);
        var ret = new QuestionWithAnswers();
        ret.setQuestionId(data.questionId);
        ret.setOptionId(data.optionId);
        ret.setQuestionText(data.questionText);
        ret.setOptionText(data.optionText);
        ret.setAuthor(data.author);
        ret.setIsAnswer(data.isAnswer);
        return ret;
    };
    return QuestionWithAnswers;
}());
exports.QuestionWithAnswers = QuestionWithAnswers;
