const cron = require("node-cron");

const checkApis = require("./monitorService");

cron.schedule("* * * * *", async () => {

    console.log("Checking APIs...");

    await checkApis();

});