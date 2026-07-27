const { MongoClient } = require("mongodb");

const uri =
"mongodb+srv://admin123:Tauseef%40187@cluster0.evlcpct.mongodb.net/?appName=Cluster0";

async function main() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("✅ Connected Successfully!");
        await client.db("admin").command({ ping: 1 });
        console.log("Ping successful!");
        await client.close();
    } catch (err) {
        console.error(err);
    }
}

main();