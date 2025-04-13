const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

const { createComment, updateComment, deleteComment } = require('../controllers/commentController');

router.post("/:newsId", verifyToken, createComment);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;