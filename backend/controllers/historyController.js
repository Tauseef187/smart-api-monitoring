const MonitoringHistory=require("../models/MonitoringHistory");

exports.getHistory=async(req,res)=>{

try{

const history=await MonitoringHistory.find({

api:req.params.apiId

}).sort({

checkedAt:-1

});

res.json(history);

}

catch(error){

res.status(500).json({

message:error.message

});

}

}