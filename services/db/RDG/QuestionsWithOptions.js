"use strict";
exports.__esModule = true;
exports.QuestionWithOptions = void 0;
var QuestionWithOptions = /** @class */ (function () {
    function QuestionWithOptions() {
        this.questionId = 0;
        this.optionId = 0;
        this.questionText = '';
        this.optionText = '';
        this.authorId = 0;
        this.isAnswer = false;
    }
    QuestionWithOptions.prototype.getQuestionId = function () {
        return this.questionId;
    };
    QuestionWithOptions.prototype.setQuestionId = function (newId) {
        this.questionId = newId;
    };
    QuestionWithOptions.prototype.getOptionId = function () {
        return this.optionId;
    };
    QuestionWithOptions.prototype.setOptionId = function (newId) {
        this.optionId = newId;
    };
    QuestionWithOptions.prototype.getOptionText = function () {
        return this.optionText;
    };
    QuestionWithOptions.prototype.setOptionText = function (newText) {
        this.optionText = newText;
    };
    QuestionWithOptions.prototype.getQuestionText = function () {
        return this.questionText;
    };
    QuestionWithOptions.prototype.setQuestionText = function (newText) {
        this.questionText = newText;
    };
    QuestionWithOptions.prototype.getAuthorId = function () {
        return this.authorId;
    };
    QuestionWithOptions.prototype.setAuthorId = function (newAuthor) {
        this.authorId = newAuthor;
    };
    QuestionWithOptions.prototype.getIsAnswer = function () {
        return this.isAnswer;
    };
    QuestionWithOptions.prototype.setIsAnswer = function (newAnswer) {
        this.isAnswer = newAnswer;
    };
    QuestionWithOptions.load = function (data) {
        var ret = new QuestionWithOptions();
        ret.setQuestionId(data.question_id);
        ret.setOptionId(data.option_id);
        ret.setQuestionText(data.question_text);
        ret.setOptionText(data.option_text);
        ret.setAuthorId(data.author_id);
        ret.setIsAnswer(data.is_answer);
        return ret;
    };
    return QuestionWithOptions;
}());
exports.QuestionWithOptions = QuestionWithOptions;
