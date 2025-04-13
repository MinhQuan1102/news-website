const express = require('express');
const router = express.Router();

const { getProfile, updateProfile } = require('../controllers/userController');

router.get("/profile/:id", getProfile);
router.put("/:id", updateProfile);

module.exports = router;