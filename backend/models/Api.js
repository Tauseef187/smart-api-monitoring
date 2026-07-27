const mongoose = require("mongoose");

const apiSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
        },

        method: {
            type: String,
            enum: ["GET", "POST", "PUT", "DELETE"],
            default: "GET",
        },

        interval: {
            type: Number,
            default: 5,
        },

        status: {
            type: String,
            default: "Unknown",
        },

        lastChecked: {
            type: Date,
        },

        averageResponseTime: {
            type: Number,
            default: 0,
        },
        lastStatusCode:{
    type:Number,
    default:0
},

lastResponseTime:{
    type:Number,
    default:0
},

lastChecked:{
    type:Date
},

uptimePercentage:{
    type:Number,
    default:100
}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Api", apiSchema);