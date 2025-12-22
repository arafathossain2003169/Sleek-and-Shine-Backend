// src/controllers/qnaController.js
const { QnA, Product } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createQuestion = async (req, res) => {
  try {
    const { productId, question, askedBy } = req.body;

    const qna = await QnA.create({ productId, question, askedBy });
    return successResponse(res, qna, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const qna = await QnA.findByPk(id);
    if (!qna) {
      return errorResponse(res, 'Question not found', 404);
    }

    await qna.update({ answer, answeredAt: new Date() });
    return successResponse(res, qna);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const qna = await QnA.findByPk(id);
    if (!qna) {
      return errorResponse(res, 'Question not found', 404);
    }

    await qna.destroy();
    return successResponse(res, { message: 'Question deleted' });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};