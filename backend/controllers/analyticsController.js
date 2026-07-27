const MonitoringHistory=require("../models/MonitoringHistory");

exports.getAnalytics=async(req,res)=>{

try{

const history=await MonitoringHistory.find({

api:req.params.apiId

});

const totalChecks=history.length;

const successChecks=history.filter(

h=>h.status==="UP"

).length;

const failedChecks=history.filter(

h=>h.status==="DOWN"

).length;

const responseTimes=history

.filter(

h=>h.status==="UP"

)

.map(

h=>h.responseTime

);

const average=responseTimes.length?

responseTimes.reduce(

(a,b)=>a+b,

0

)/responseTimes.length:0;

const maximum=responseTimes.length?

Math.max(...responseTimes):0;

const minimum=responseTimes.length?

Math.min(...responseTimes):0;

const uptime=totalChecks?

(successChecks/totalChecks)*100:0;

res.json({

totalChecks,

successChecks,

failedChecks,

uptimePercentage:uptime.toFixed(2),

averageResponseTime:average.toFixed(2),

maximumResponseTime:maximum,

minimumResponseTime:minimum

});

}

catch(error){

res.status(500).json({

message:error.message

});

}

}