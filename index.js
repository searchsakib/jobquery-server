const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER, process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.j32tjfb.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Database Connected!');
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();
const productCollection = client.db('productDB').collection('product');

app.get('/', (req, res) => {
  res.send('TechNest server is LOL!');
});
app.get('/products', async (req, res) => {
  res.send('Getting Product');
});

// app.post('/products', async (req, res) => {
//   const newProduct = req.body;
//   console.log(newProduct);
//   const result = await productCollection.insertOne(newProduct);
//   res.send(result);
// });

app.listen(port, () => {
  console.log(`TechNest is running on port:${port}`);
});
