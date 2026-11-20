const productModel = require("../models/productModel.js");

//Create product
exports.create = async (req, res) => {
    try {
        const {
            tittle,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category_id,
            brand_id
        } = req.body;

        if (is_discount > price) {
            return res.status(200).json({
                success: false,
                message: "Discount price must be smaller than main price"
            })
        }

        //New product add
        const product = await productModel.create({
            tittle,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category_id,
            brand_id
        });
        res.status(200).json({
            success: true,
            message: "Product add successfully",
            data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};