const News = require("../models/News");

const getNewsByCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.pageSize) || 10;
        const category = req.query.category;
        const skip = (page - 1) * limit;
    
        const filter = category ? { category } : {};

        const [total, news] = await Promise.all([
        News.countDocuments(filter),
        News.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("author", "username avatar")
        ]);
    
        res.status(200).json({
            message: "Get news by category successfully",
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: news
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

const getFeaturedNews = async (req, res) => {
    try {
        const topNews = await News.find()
            .sort({ views: -1 })           
            .limit(4)                       
    
        res.status(200).json({ message: "Get featured news successfully", data: topNews });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate("author", "username avatar email")
            .populate({
                path: "comments",
                match: { replyTo: null },
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: "author", select: "username avatar" },
                    {
                        path: "replies",
                        populate: { path: "author", select: "username avatar" }
                    }
                    ]
                });
        
        if (!news) {
            return res.status(404).json({ message: "News not found." });
        }
        return res.status(200).json({ message: "Get news successfully", data: news });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}

const getNewsOfUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * limit;

        const total = await News.countDocuments({ author: userId });
        const news = await News.find({ author: userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) 
            .populate("author", "username email avatar");

        return res.status(200).json({
            message: "Get news by user successfully",
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: news
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

const searchNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * limit;
    
        const keyword = req.query.keyword || "";
    
        const query = {
            title: { $regex: keyword, $options: "i" }
          };
      
        const total = await News.countDocuments(query);
        const news = await News.find(query)
            .populate("author", "username avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Get news by categoey successfully",
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: news
            });      
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

const createNews = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { title, content, thumbnail, category } = req.body;
        if (!title || !content || !thumbnail || !category) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const newNews = new News({
            title,
            content,
            thumbnail,
            category,
            author: req.user._id
        });

        const savedNews = await newNews.save();

        res.status(201).json({ message: "News created successfully.", news: savedNews });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}

const updateNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
    
        if (!news) {
          return res.status(404).json({ message: "News not found." });
        }
    
        const updatedNews = await News.findByIdAndUpdate(req.params.id, {
            $set: req.body, 
        });
        return res.status(200).json({ message: "Updated news successfully", data: updatedNews });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}

const increaseView = async (req, res) => {
    try {
        const updated = await News.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
    
        if (!updated) {
          return res.status(404).json({ message: "News not found" });
        }
    
        res.status(200).json({
          message: "View count increased",
          views: updated.views
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
}

const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
    
        if (!news) {
          return res.status(404).json({ message: "News not found." });
        }
    
        if (news.author.toString() !== req.session.user._id) {
          return res.status(403).json({ message: "You are not allowed to delete this news." });
        }
    
        await News.findByIdAndDelete(req.params.id);
    
        return res.status(200).json({ message: "News deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = { getNewsByCategory, getFeaturedNews, getNewsById, getNewsOfUser, searchNews, createNews, updateNews, increaseView, deleteNews }