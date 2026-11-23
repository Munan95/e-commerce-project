const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const ObjectId = mongoose.Types.ObjectId;

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

//All review
exports.allReview = async (req, res) => {
    try {
        const page_no = Number(req.params.page_no);
        const per_page = Number(req.params.per_page);

        const skipRow = (page_no - 1) * per_page;
        const sortStage = { createAt: -1 };

        const joinWitUser = {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        };

        const joinWitProduct = {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product"
            }
        };

        const unwindStageUser = { $unwind: "$user" };
        const unwindStageProduct = { $unwind: "$product" };

        const projectStage = {
            $project: {
                _id: 1,
                invoice_id: 1,
                product_id: 1,
                user_id: 1,
                createdAt: 1,
                des: 1,
                rating:1,
                "user.cus_name": 1,
                "user.email": 1,
                "product.tittle": 1,
                "product.images": 1
            }
        };

        const facetStage = {
            $facet: {
                totalcount: [{ $count: "count" }],
                reviews: [
                    { $sort: sortStage },
                    { $skip: skipRow },
                    { $limit: per_page },
                    joinWitUser,
                    joinWitProduct,
                    unwindStageUser,
                    unwindStageProduct,
                    projectStage
                ]
            }
        }

        //Fetch all review
        const review = await reviewModel.aggregate([facetStage]);

        res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: review[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//All review by product
exports.allReviewByProduct = async (req, res) => {
    try {
        const product_id = new ObjectId(req.params.product_id);

        const matchingStage = {
            $match: {
                product_id
            }
        };

        const joinWitUser = {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        };

        const unwindStageUser = { $unwind: "$user" };

        const projectStage = {
            $project: {
                createdAt: 1,
                updatedAt: 1,
                des: 1,
                rating: 1,
                "user.cus_name": 1,
                "user.email": 1
            }
        };

        //Fetch all review
        const review = await reviewModel.aggregate([matchingStage, joinWitUser, unwindStageUser, projectStage]);

        res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            reviews: review
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};