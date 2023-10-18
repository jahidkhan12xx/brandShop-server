const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// MiddleWare
app.use(cors());
app.use(express.json());


// MongoDB



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f3op28d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const database = client.db("AddProducts").collection("Products");
    const database2 = client.db("AddToCart").collection("Device");

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      
      console.log(id);
      const query = {
        "_id" : new ObjectId(id)
      };
      const result = await database.findOne(query);
      console.log(result);
      res.send(result);
    });
    

    app.get("/products", async (req, res) => {
      const result = await database.find().toArray();
      res.send(result);
    });
    

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await database.insertOne(product);
      console.log(result);
      res.send(result);
    });
    
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("id", id, data);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
          brand_name: data.brand_name,
          product_name: data.product_name,
          product_img: data.product_img,
          product_price: data.product_price,
          product_rating: data.product_rating,
          product_type: data.product_type,
          product_des: data.product_des,
        },
      };
      const result = await database.updateOne(
        filter,
        updatedUSer,
        options
      );
      res.send(result);
    });


    app.get("/cart", async (req, res) => {
      const result = await database2.find().toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const product = req.body;
      const result = await database2.insertOne(product);
      console.log(result);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await database2.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})