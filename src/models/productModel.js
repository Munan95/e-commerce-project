const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        tittle: { type: String, unique: true, required: true },
        images: [String],
        sort_description: { type: String },
        price: { type: Number },
        is_discount: { type: Boolean },
        discount_price: { type: Number },
        remark: { type: String },
        stock: { type: Number },
        color: [String],
        size: [String],
        description: { type: String },

        category_id: { type: mongoose.Schema.Types.ObjectId, require: true },
        brand_id: { type: mongoose.Schema.Types.ObjectId, require: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const productModel = mongoose.model("products", DataSchema);

module.exports = productModel;