require('dotenv').config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const URI = process.env.DATABASE_URL;
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async () => {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
})();

let db = client.db();
module.exports = db;
