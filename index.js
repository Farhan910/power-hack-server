const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zwl4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)



async function run() {
    try {
        await client.connect();
        console.log('connected')
        const usersCollection = await client
        .db("power-hack")
        .collection("users");

        app.get("/billing-list", async (req, res) => {
            const query = {};
          const cursor = usersCollection.find(query);
          const users = await cursor.toArray();

            res.send(users);
        })

        app.post("/billing-list", async (req, res) => {
            const bills = req.body;
            await usersCollection.insertOne(bills);
            res.send(bills);
        })

        app.delete("/billing-list/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            await usersCollection.deleteOne(query);
            res.send(id);
        })

        app.put("/billing-list/:id", async (req, res) => {
            const id = req.params.id;
            const bills = req.body;
            const query = { _id: ObjectId(id) };
            await usersCollection.updateOne(query, { $set: bills });
            res.send(bills);
        })
  
      
    }
    finally {
    }
  }
  run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Power-Hack is running ");
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port`, port);
  });
