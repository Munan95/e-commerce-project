const mongoose = require("mongoose")
const productModel = require("../models/productModel.js");
const ObjectId = mongoose.Types.ObjectId

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
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};

//All Products
exports.allProduct = async (req, res) => {
    try {
        const page_no = Number(req.params.page_no);
        const per_page = Number(req.params.per_page);
        const keyword = Number(req.params.keyword);
        const remark = Number(req.params.remark);
        const brand_id = Number(req.params.brand_id);
        const category_id = Number(req.params.category_id);

        const skipRow = (page_no - 1) * per_page;
        const sortStage = { createAt: -1 }

        let MachingStage;
        if (category_id != "0") {
            MachingStage = {
                $match: { category_id: new ObjectId(category_id) }
            }
        } else if (brand_id != "0") {
            MachingStage = {
                $match: { brand_id: new ObjectId(brand_id) }
            }
        } else if (remark != "0") {
            MachingStage = {
                $match: { remark: remark }
            }
        } else if (keyword != "0") {
            const searchRegex = {
                $regex: keyword,
                $options: "i"
            };
            const searchParams = { tittle: searchRegex };
            const searchStage = {
                $or: searchParams
            }
            MachingStage = {
                $match: searchStage
            };
        } else {
            MachingStage = {
                $match: {}
            };
        }

        const joinWitCategory = {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        }

        const facetStage = {
            $facet:{
                totalcount:[{$count:"count"}],
                products:[
                    {$sort:sortStage},
                    {$skip:skipRow},
                    {$limit:per_page},
                    joinWitCategory
                ]
            }
        }

        //Fetch all products
        const products = await productModel.aggregate([MachingStage,facetStage]);

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data:products[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong."
        });
    }
};