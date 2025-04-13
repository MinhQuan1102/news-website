const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");

//@description    Register new user
//@route          POST /api/auth/register
//@access         Public
const register = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !email || !password || !avatar) {
      return res.status(400).json({ message: "Please enter all fields!" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email has already been taken!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      email,
      avatar,
      password: hashedPassword,
    });
    const newUser = await user.save();
    return res
      .status(201)
      .json({ message: "Register successfully!", data: newUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

//@description    Login
//@route          POST /api/auth/login
//@access         Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: true, message: "Wrong email or password!" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Wrong email or password!" });
    const token = generateToken(user._id)
    const { password: userPass, ...other } = user._doc;

    req.session.user = {...other, token}
    return res
      .status(200)
      .json({ message: "Login successfully!", data: {...other, token} });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { register, login }