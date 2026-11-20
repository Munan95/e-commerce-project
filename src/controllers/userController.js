const userModel = require("../models/userModel.js");
const { EncodeToken } = require("../utility/tokenHelper.js");
const bcrypt = require("bcrypt");

const options = {
    maxAge: process.env.COOKIE_EXPIRE_TIME,
    httpOnly: false,
    sameSite: "none",
    secure: true
};

//Create user
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Find existing user
        const ifUser = await userModel.find({ email });
        if (ifUser.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Email already registered"
            });
        }

        //New user registered
        const user = await userModel.create({ email, password });
        res.status(200).json({
            success: true,
            message: "User registered successfully"
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

        const user = await userModel.findOne({ email });
        const isMatch = user && (await bcrypt.compare(password, user.password));

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        //Create token
        let token = EncodeToken(user.email, user._id.toString());

        //Set cookies
        res.cookie("u_token", token, options);

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

//Get user
exports.user = async (req, res) => {
    try {
        const email = req.headers.email;

        const matchStage = {
            $match:{email}
        };

        const project = {
            $project:{
                password:0
            }
        };

        const data = await userModel.aggregate([matchStage,project]);

        if (!data.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: data[0]
        });
        console.log(data);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//Verify user
exports.userVerify = async (req, res) => {
    try {
        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//user logout
exports.logout = async (req, res) => {
    try {
        res.clearCookie("u_token");
        res.status(200).json({
            success: true,
            message: "Logout success"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//Update user password
exports.update = async (req, res) => {
    try {
        const email = req.headers.email;
        const _id = req.headers._id;

        const {
            password,
            cus_name,
            cus_add,
            cus_city,
            cus_country,
            cus_fax,
            cus_phone,
            cus_postcode,
            cus_state,
            ship_name,
            ship_add,
            ship_city,
            ship_country,
            ship_phone,
            ship_postcode,
            ship_state,
        } = req.body;

        const updateData = {
            email,
            password,
            cus_name,
            cus_add,
            cus_city,
            cus_country,
            cus_fax,
            cus_phone,
            cus_postcode,
            cus_state,
            ship_name,
            ship_add,
            ship_city,
            ship_country,
            ship_phone,
            ship_postcode,
            ship_state,
        };

        const user = await userModel.findOne({ email, _id });

        if (!user) {
            return res.status(200).json({ success: false, message: "Invalid email" });
        }

        //Password update before hash by bcrypt
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        //Update user 
        const updatedUser = await userModel.findByIdAndUpdate(_id, updateData, {
            new: true
        });

        //Update token
        const token = EncodeToken(updatedUser?.email, updatedUser?._id.toString());

        //Update cookies
        res.cookie("u_token", token, options);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                email: updatedUser.email,
                id: updatedUser._id
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};