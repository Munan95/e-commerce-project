const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        user_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        product_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        product_name:{type:String,require:true},
        color:{type:String,require:true},
        size:{type:String,require:true},
        qnt:{type:Number,require:true},
        price:{type:Number}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const cartModel = mongoose.model("carts",DataSchema);

module.exports = cartModel;