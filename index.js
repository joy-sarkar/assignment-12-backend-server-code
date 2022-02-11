const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enn9t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    console.log("data base connected successfully second Time");
    // data base
    const database = client.db("allbikesdata");
    // data collection
    const bikesCollection = database.collection("allbikes");
    // data collection
    const usersCollection = database.collection("user");
    // data collection
    const emailNewsletterCollection = database.collection("newsletter");
    // review collection
    const reviewCollection = database.collection("reviews");

    // get api for send data in client site
    app.get("/bikedatas", async (req, res) => {
      const cursor = bikesCollection.find({});
      const bikes = await cursor.toArray();
      res.send(bikes);
    });

    app.post("/bikedatas", async (req, res) => {
      const newBike = req.body;
      console.log("data from fontent", newBike);
      const result = await bikesCollection.insertOne(newBike);
      res.json(result);
      console.log("from backend");
    });
    // get user all user email
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    // update data using put methode
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // get all reviews by using get method
    app.get("/bikedata", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    // delate a data from data collection
    app.delete("/cancelbikes/:id", async (req, res) => {
      const presentCollection = await bikesCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(presentCollection);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello BikeGate!");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
