const express = require('express');
const router = express.Router();

const { getNewsByCategory, getFeaturedNews, getLatestNews, getNewsById, getNewsOfUser, createNews, updateNews, deleteNews, increaseView, searchNews } = require('../controllers/newsController');
const { getAllCategories } = require('../controllers/categoryController');
const verifyToken = require('../middlewares/verifyToken');

router.get("/", getNewsByCategory);
router.get("/featured", getFeaturedNews);
router.get("/latest", getLatestNews);
router.get("/category", getAllCategories);
router.get("/user/:id", getNewsOfUser);
router.get("/search", searchNews);
router.get("/:id", getNewsById);
router.post("/", verifyToken, createNews);
router.put("/:id/view", increaseView);
router.put("/:id", verifyToken, updateNews);
router.delete("/:id", verifyToken, deleteNews);

module.exports = router;