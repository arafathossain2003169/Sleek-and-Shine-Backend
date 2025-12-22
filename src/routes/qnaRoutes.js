// src/routes/qnaRoutes.js
const express = require('express');
const router = express.Router();
const qnaController = require('../controllers/qnaController');

router.post('/', qnaController.createQuestion);
router.patch('/:id/answer', qnaController.answerQuestion);
router.delete('/:id', qnaController.deleteQuestion);

module.exports = router;
