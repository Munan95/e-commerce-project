const categoryModel = require("../models/categoryModel");

//Create category
exports.create = async (req, res) => {
    try {
        const { category_name, category_img } = req.body;

        //New category add
        const category = await categoryModel.create({ category_name, category_img });

        res.status(200).json({
            success: true,
            message: "Category add successfully",
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};