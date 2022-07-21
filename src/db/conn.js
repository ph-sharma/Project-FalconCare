module.exports.init=function()
{
    const mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://user1:1234567890@cluster0.tc8sf.mongodb.net/FalconCare?retryWrites=true&w=majority')
    .then(function(){
        console.log("DB is Live");
    })
    .catch(function(){
        console.log("error in DB Connection")
    })
}
