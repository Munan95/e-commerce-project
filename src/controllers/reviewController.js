const reviewModel = require("../models/reviewModel");

//Create review
exports.create = async (req, res) => {
    try {
        const user_id = req.headers._id;
        const { product_id, invoice_id, des, rating } = req.body;

        //New review add
        const review = await reviewModel.findOneAndUpdate(
            { user_id, product_id, invoice_id },
            { user_id, product_id, invoice_id, des, rating },
            { returnDocument: "after", upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Review add successfully",
            review
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};