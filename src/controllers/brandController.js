const brandModel = require("../models/brandModel");
const productModel = require("../models/productModel");

//Create brand
exports.create = async (req, res) => {
    try {
        const { brand_name, brand_img } = req.body;

        //New brand add
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

//All brand
exports.allBrand = async (req, res) => {
    try {
        const page_no = Number(req.params.page_no);
        const per_page = Number(req.params.per_page);

        const skipRow = (page_no - 1) * per_page;
        const sortStage = { createAt: -1 };

        const joinWitProduct = {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "brand_id",
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

        //Fetch all brand
        const brand = await brandModel.aggregate([facetStage]);

        res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
            data: brand[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//Single brand
exports.singleBrand = async (req, res) => {
    try {
        const { id } = req.params;

        //Fetch single brand
        const brand = await brandModel.findById(id);

        res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
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

//Update brand
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand_name, brand_img } = req.body;

        //Update single brand info
        const brand = await brandModel.findByIdAndUpdate(
            id,
            { brand_name, brand_img },
            { returnDocument: "after" }
        );

        res.status(200).json({
            success: true,
            message: "Brand updated successfully",
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

//Delete brand
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        //Product exist
        const products = await productModel.find({ brand_id: id })
        if (products.leanth > 0) {
            return res.status(200).json({
                success: false,
                message: "Please delete all product with this brand first"
            });
        }

        //Delete single brand
        await brandModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};