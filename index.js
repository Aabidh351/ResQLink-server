import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

await connectToMongoDB();


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send("Welcome to ResQLink server!");
})

app.listen(port, ()=>{
    console.log(`ResQLink app listening to port ${port}...`);
})

export default app;