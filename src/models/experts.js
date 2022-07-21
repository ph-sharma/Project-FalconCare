const mongoose = require('mongoose');
const expertSchema =mongoose.Schema({
    docname:{
        type:String
    },
    docemail:{
        type:String
    },
    docpass:{
        type:String
    },
    speciality:{
        type:String
    },
    experience:{
        type:String
    }
},
{timestamps:true}

);
const expertModel = new mongoose.model("experts",expertSchema)
module.exports=expertModel;