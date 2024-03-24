const bcrypt = require("bcrypt");
const collection = require("../db/db");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const isExists = await collection.findOne({ email: email });
    const salt = await bcrypt.genSalt(10);
    console.log("User exists: ", isExists);
    console.log("Request body: ", req.body);
    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new collection({
      fullName,
      email,
      password: hashedPassword,
    });

    const userData = await user.save();
    console.log("User ID: ", userData._id);
    console.log("User Registered Data: ", userData);

    return res.status(200).json({
      success: true,
      msg: "Registered successfully!",
      userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const generateAccessToken = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });
  return token;
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Email and password is invalid.",
      });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        msg: "Invalid password",
      });
    }
    const accessToken = await generateAccessToken({ user: user });
    return res.status(200).json({
      success: true,
      msg: "Logged in successfully!",
      user: user,
      accessToken: accessToken,
      tokenType: "Bearer",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { register, login };
