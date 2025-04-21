const User = require("../models/User");
const bcrypt = require("bcrypt");

//@description    Get user profile
//@route          GET api/user/profile/:id
//@access         Protected
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({
                message: "User not found"
            })
        const { token, _doc, ...other } = user;
        return res.status(200).json({
            message: "Get user profile successfully",
            data: _doc
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}

//@description    Update user profile
//@route          PUT api/user/:id
//@access         Protected
const updateProfile = async (req, res) => {
    if (req.params.id) {
        const userId = req.params.id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.body.password) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Wrong password!" });
            }
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json({ message: "error", error: error });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: req.body, 
        }, { new: true });
        return res.status(200).json({ message: "Updated user successfully", user: updatedUser });
    } else {
        return res.status(401).json({ message: "You can update your account only!" })
    }
}

module.exports = { getProfile, updateProfile }