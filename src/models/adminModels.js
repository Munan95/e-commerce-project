const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{type:String,required:true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const adminModel = mongoose.model("admins",DataSchema);

module.exports = adminModel;