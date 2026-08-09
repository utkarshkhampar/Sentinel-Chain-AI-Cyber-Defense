const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema(
{
    type:{
        type:String,
        required:true
    },

    severity:{
        type:String,
        required:true
    },

    source:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});


module.exports = mongoose.model("Event",eventSchema);