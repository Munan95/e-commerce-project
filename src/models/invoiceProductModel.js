const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        user_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        product_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        invoice_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        product_name:{type:String,require:true},
        qty:{type:Number,require:true},
        price:{type:Number,require:true},
        color:{type:String,require:true},
        size:{type:String,require:true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const invoiceProductModel = mongoose.model("invoiceProducts",DataSchema);

module.exports = invoiceProductModel;