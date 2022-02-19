const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.c1ygv.mongodb.net:27017,cluster0-shard-00-01.c1ygv.mongodb.net:27017,cluster0-shard-00-02.c1ygv.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-10o2xl-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function server() {
    try{
        await client.connect();
        const database = client.db('User_Collection');                         // Database Name 
        const usersCollection = database.collection('User_Ratings'); 
        console.log('Database Connected')

        app.get('/ratings', async (req, res) => {
            const cursor = usersCollection.find({})
            const ratings = await cursor.toArray()
            res.json(ratings)
          })

        app.post('/ratings', async(req, res) => {
            const cursor = await usersCollection.insertOne(req.body)
            res.json(cursor)
        })
    }
    finally{
        // await client.close();
    }
}

server().catch(console.dir)

app.get('/', (req, res) => {
  res.send(`API Rinning On Port : ${port}`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
