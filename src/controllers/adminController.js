const adminModel = require("../models/adminModels.js");

//Create admin
exports.register = async (req,res) => {
    try{
        const { email, password } = req.body;
        await adminModel.create({ email, password });
        res.status(200).json({
            success: true,
            message: "Admin create successfully"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};