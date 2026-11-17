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

//Hash password before saving
DataSchema.pre("save", async (next) => {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

const adminModel = mongoose.model("admins",DataSchema);

module.exports = adminModel;