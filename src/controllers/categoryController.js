const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

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

//All category
exports.allCategory = async (req, res) => {
    try {
        const page_no = Number(req.params.page_no);
        const per_page = Number(req.params.per_page);

        const skipRow = (page_no - 1) * per_page;
        const sortStage = { createAt: -1 };

        const joinWitProduct = {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category_id",
                as: "products"
            }
        };

        const addProductCount = {
            $addFields: {
                totalProduct: { $size: "$products" }
            }
        };

        const facetStage = {
            $facet: {
                totalcount: [{ $count: "count" }],
                categories: [
                    { $sort: sortStage },
                    { $skip: skipRow },
                    { $limit: per_page },
                    joinWitProduct,
                    addProductCount,
                    {
                        $project: {
                            products: 0,
                            updatedAt: 0,
                        }
                    }
                ]
            }
        }

        //Fetch all category
        const categories = await categoryModel.aggregate([facetStage]);

        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//Single category
exports.singleCategory = async (req, res) => {
    try {
        const { id } = req.params;

        //Fetch single category
        const category = await categoryModel.findById(id);

        res.status(200).json({
            success: true,
            message: "Category fetched successfully1",
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

//Update category
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, category_img } = req.body;

        //Update single category info
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { category_name, category_img },
            { returnDocument: "after" }
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
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

//Delete category
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        //Product exist
        const products = await productModel.find({ category_id: id })
        if (products.leanth > 0) {
            return res.status(200).json({
                success: false,
                message: "Please delete all product with this category first"
            });
        }

        //Delete single category
        await categoryModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};