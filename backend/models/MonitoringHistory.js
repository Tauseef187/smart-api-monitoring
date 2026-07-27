const mongoose = require("mongoose");

const monitoringHistorySchema = new mongoose.Schema({

    api:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Api",
        required:true
    },

    status:{
        type:String,
        enum:["UP","DOWN"],
        required:true
    },

    statusCode:{
        type:Number,
        default:0
    },
    // Add inside your existing MonitoringHistorySchema fields:
isAnomaly:    { type: Boolean, default: false },
aiConfidence: { type: Number,  default: 0     },
aiSeverity:   { type: String,  default: 'normal', enum: ['normal','medium','high','critical'] },
zScore:       { type: Number,  default: 0     },
    responseTime:{
        type:Number,
        default:0
    },

    checkedAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "MonitoringHistory",
    monitoringHistorySchema
);