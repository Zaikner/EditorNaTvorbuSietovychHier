"use strict";
exports.__esModule = true;
exports.QuestionWithAnswers = void 0;
var QuestionWithAnswers = /** @class */ (function () {
    function QuestionWithAnswers() {
        this.questionId = 0;
        this.optionId = 0;
        this.questionText = '';
        this.optionText = '';
        this.authorId = 0;
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
    QuestionWithAnswers.prototype.getAuthorId = function () {
        return this.authorId;
    };
    QuestionWithAnswers.prototype.setAuthorId = function (newAuthor) {
        this.authorId = newAuthor;
    };
    QuestionWithAnswers.prototype.getIsAnswer = function () {
        return this.isAnswer;
    };
    QuestionWithAnswers.prototype.setIsAnswer = function (newAnswer) {
        this.isAnswer = newAnswer;
    };
    QuestionWithAnswers.load = function (data) {
        var ret = new QuestionWithAnswers();
        ret.setQuestionId(data.questionId);
        ret.setOptionId(data.optionId);
        ret.setQuestionText(data.questionText);
        ret.setOptionText(data.optionText);
        ret.setAuthorId(data.authorId);
        ret.setIsAnswer(data.isAnswer);
        return ret;
    };
    return QuestionWithAnswers;
}());
exports.QuestionWithAnswers = QuestionWithAnswers;
