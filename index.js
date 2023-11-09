const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

const jobsCollection = client.db('jobsDB').collection('job');
const myBidsCollection = client.db('jobsDB').collection('myBids');
const bidRequestsCollection = client
  .db('jobsDB')
  .collection('bidRequestsCollection');

app.get('/', (req, res) => {
  res.send('JobQuest is Here!');
});

// for all job data
app.get('/jobs', async (req, res) => {
  const cursor = jobsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

// for one job data with mongoDB id
app.get('/jobs/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await jobsCollection.findOne(query);
  res.send(result);
});

// for one posted job data w/ mongoDB id from jobsCollection
app.get('/update-job/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await jobsCollection.findOne(query);
  res.send(result);
});

// getting myBids data
app.get('/my-bids', async (req, res) => {
  const cursor = myBidsCollection.find();
  const cart = await cursor.toArray();
  res.send(cart);
});

// getting bidReq data
app.get('/bid-requests', async (req, res) => {
  const cursor = bidRequestsCollection.find();
  const cart = await cursor.toArray();
  res.send(cart);
});

//getting my posted jobs data

app.get('/my-posted-jobs', async (req, res) => {
  const cursor = jobsCollection.find();
  const cart = await cursor.toArray();
  res.send(cart);
});

// adding bid in my bids page with myBidsCollection
app.post('/my-bids', async (req, res) => {
  const bid = req.body;
  console.log(bid);
  const result = await myBidsCollection.insertOne(bid);
  res.send(result);
});

// adding bid in bidreq page with bidrequestcollection
app.post('/bid-reqs', async (req, res) => {
  const bidReq = req.body;
  console.log(bidReq);
  const result = await bidRequestsCollection.insertOne(bidReq);
  res.send(result);
});

// adding job in jobsCollection

app.post('/add-job', async (req, res) => {
  const addJob = req.body;
  console.log(addJob);
  const result = await jobsCollection.insertOne(addJob);
  res.send(result);
});

// for updating jobscollection

app.put('/my-posted-jobs/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateJob = req.body;
  const job = {
    $set: {
      employer_email: updateJob.employer_email,
      job_title: updateJob.job_title,
      description: updateJob.description,
      category: updateJob.category,
      deadline: updateJob.deadline,
      min_price: updateJob.min_price,
      max_price: updateJob.max_price,
    },
  };
  const result = await jobsCollection.updateOne(filter, job, options);
  res.send(result);
});

// delete from my posted jobs jobscollection

app.delete('/my-posted-jobs/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await jobsCollection.deleteOne(query);
  res.send(result);
});

app.listen(port, () => {
  console.log(`JobQuest is running on port:${port}`);
});
