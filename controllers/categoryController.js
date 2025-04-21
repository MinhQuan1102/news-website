//@description    Get all news categories
//@route          POST /api/news/category
//@access         Public
const getAllCategories = async (req, res) => {
    try {
        const categories = [
            "technology",
            "politics",
            "corporate",
            "sports",
            "health",
            "education",
            "science",
            "business",
            "foods",
            "entertainment",
            "travel",
            "lifestyle"
        ]
        return res.status(200).json({
            message: "Get all categories successfully",
            data: categories
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}

module.exports = { getAllCategories }