const adminModel = require("../models/adminModels.js");
const { EncodeToken } = require("../utility/tokenHelper.js");
const bcrypt = require("bcrypt");

const options = {
    maxAge: process.env.COOKIE_EXPIRE_TIME,
    httpOnly: false,
    sameSite: "none",
    secure: true
};

//Create admin
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        await adminModel.create({ email, password });
        res.status(200).json({
            success: true,
            message: "Admin create successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await adminModel.findOne({ email });
        const isMatch = user && (await bcrypt.compare(password, user.password));

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        //Create token
        let token = EncodeToken(user.email, user._id.toString());

        //Set cookies
        res.cookie("a_token", token, options);

        res.status(200).json({
            success: true,
            message: "Login successfully",
            user: {
                id: user._id,
                email: user.email
            },
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};