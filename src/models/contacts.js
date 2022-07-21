const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    cname:{
        type:String,
        required:true
    },
    
    cemail:{
        type:String,
        required:true,    
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},
{timestamps:true}
);
// const Register = new mongoose.model("Register",userSchema)
const contactModel = new mongoose.model("contacts",contactSchema)
module.exports=contactModel;