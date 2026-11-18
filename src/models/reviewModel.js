const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        user_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        product_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        invoice_id:{type:mongoose.Schema.Types.ObjectId,require: true},

        des:{type:String,require:true},
        rating:{type:Number,require:true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const reviewModel = mongoose.model("reviews",DataSchema);

module.exports = reviewModel;