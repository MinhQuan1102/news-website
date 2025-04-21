const express = require('express');
const router = express.Router();

const { getProfile, updateProfile } = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

router.get("/profile/:id", verifyToken, getProfile);
router.put("/:id", verifyToken, updateProfile);

module.exports = router;