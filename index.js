const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u3yaa.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("Places");
    const servicesCollection = database.collection("place");
    const bookingCollection = database.collection("booking");
    const galleryCollection = database.collection("gallery");

    // GET API
    app.get("/places", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // GET SINGLE API
    app.get("/places/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("getting specific tours", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    //GET Booking API
    app.get("/booking", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });
    // GET GALLERY API
    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //Delete Booking Single API
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const bookings = await bookingCollection.deleteOne(query);
      res.send(bookings);
    });
    // POST API
    app.post("/places", async (req, res) => {
      const top_place = req.body;
      //   console.log("Hit the post", top_place);
      const result = await servicesCollection.insertOne(top_place);
      res.json(result);
    });
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.json(result);
    });
    // DELETE OPERATION API
    app.delete("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Wander Travel Server");
});
app.listen(port, () => {
  console.log("Running Wander Travel Server On Port", port);
});
