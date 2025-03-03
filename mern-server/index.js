const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello MERN!')
})

// Mongo DB config


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-book-store:<Private Key>@book-store.cxqyd.mongodb.net/?retryWrites=true&w=majority&appName=Book-Store";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Create a Collection of Documents

    const bookCollections = client.db("BookInventory").collection("books");

    // Insert a Book into Database : Post Method

    app.post("/upload-book", async (req, res) =>{
      const data = req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    })


    // Get All Books from Database

    app.get("/all-books", async(req, res) =>{
      const books = bookCollections.find();
      const result = await books.toArray();
      res.send(result);

    })


    // Update A Book Data : Patch or Update Methods

    app.patch("/book/:id", async(req, res) =>{
      const id = req.params.id;
      //console.log(id);
      const updateBookData = req.body;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true};

      const updateDoc = {
        $set : {
          ...updateBookData
        }
      }


      // To Update 

      const result = await bookCollections.updateOne(filter, updateDoc, options);
      res.send(result);
      
    })


    // Delete a Book Data

    app.delete ("/book/:id", async(req, res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    })


    // Find By Category

    app.get ("/all-books", async(req, res) =>{
      let query = {};
      if (req.query?.category){
        query = {category : req.query.category}
      }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
