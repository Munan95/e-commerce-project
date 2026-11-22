const brandModel = require("../models/brandModel");

//Create brand
exports.create = async (req, res) => {
    try {
        const { brand_name, brand_img } = req.body;

        //New category add
        const brand = await brandModel.create({ brand_name, brand_img });

        res.status(200).json({
            success: true,
            message: "Brand add successfully",
            brand
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};