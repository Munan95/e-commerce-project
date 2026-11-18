const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        user_id:{type:mongoose.Schema.Types.ObjectId,require: true},
        payable:{type:Number,require: true},
        cus_details:{type:Array,require:true},
        ship_details:{type:Array,require:true},
        tran_id:{type:String,require:true},
        val_id:{type:String,require:true},
        deliver_status:{
            type:String,
            require:true,
            enum:["pending","delivered","cancel"],
            default:"pending"
        },
        payment_status:{
            type:String,
            require:true,
            enum:["pending","success","cancel","fail"],
            default:"pending"
        },
        vat:{type:Number,require: true},
        total:{type:Number,require: true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const invoiceModel = mongoose.model("invoices",DataSchema);

module.exports = invoiceModel;