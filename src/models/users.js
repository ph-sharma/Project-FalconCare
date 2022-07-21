const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    ct:Number,
    tri:Number,
    hdl:Number,
    ldl:Number,
    vldl:Number,
    nhdl:Number,
    sugg:Array
},
{timestamps:true}
);

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    phn:{
        type:Number,
        unique:true,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    confirmpass:{
        type:String,
        required:true
    },
    reports:[reportSchema]
    
},
{timestamps:true}
);
const userModel = new mongoose.model("users",userSchema)
// const reports = new mongoose.model("reports",reportSchema)
// const reportModel = new mongoose.model("reports",reportSchema)
module.exports=userModel;
// module.exports=reportModel;
// const User =mongoose.model('User',userSchema);