const mongoose = require('mongoose');
const suggestSchema = new mongoose.Schema({
    SERIAL_NUMBER:{
        type:Array
    },
    ATTRIBUTES:{
        type:Array
    },
    MIN_VALUE:{
        type:Array
    },
    MAX_VALUE:{
        type:Array
    },
    SUGGESTIONS:{
        type:Array
    }
},
{timestamps:true}
);
const suggestModel = new mongoose.model("suggestions",suggestSchema)
module.exports=suggestModel;