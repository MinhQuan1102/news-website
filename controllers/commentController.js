const News = require("../models/News");
const Comment = require("../models/Comment");

const createComment = async (req, res) => {
    try {
        const { content, replyTo } = req.body;
        const newsId = req.params.newsId;
    
        if (!content || content.trim() === "") {
          return res.status(400).json({ message: "Comment content is required." });
        }
    
        const news = await News.findById(newsId);
        if (!news) {
          return res.status(404).json({ message: "News not found." });
        }
    
        if (replyTo) {
            const parentComment = await Comment.findById(replyTo);
            if (!parentComment) {
              return res.status(400).json({ message: "Parent comment not found." });
            }
          }
      
        const newComment = new Comment({
            content,
            author: req.user._id,
            news: newsId,
            replyTo: replyTo || null
        });
    
        const savedComment = await newComment.save();
    
        news.comments.push(savedComment._id);
        await news.save();
    
        const populatedComment = await Comment.findById(savedComment._id).populate("author", "username avatar");
    
        res.status(201).json({ message: "Create comment successfully", comment: populatedComment });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
    
        if (!comment) {
          return res.status(404).json({ message: "Comment not found." });
        }
    
        if (comment.author.toString() !== req.session.user._id) {
            return res.status(403).json({ message: "You are not allowed to update this comment." });
        }
    
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
            $set: req.body, 
        });
        return res.status(200).json({ message: "Updated comment successfully", data: updatedComment });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
    
        if (!comment) {
          return res.status(404).json({ message: "Comment not found." });
        }
    
        if (comment.author.toString() !== req.session.user._id) {
          return res.status(403).json({ message: "You are not allowed to delete this comment." });
        }
    
        await Comment.findByIdAndDelete(req.params.id);
    
        return res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = { createComment, updateComment, deleteComment }