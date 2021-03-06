const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5055
console.log(process.env.DB_USER)

app.use(cors());
app.use(bodyParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpmfy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const bookCollection = client.db("BooksValley").collection("books");

  app.get('/books', (req, res)=>{
    bookCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post('/addBook', (req, res) => {
      const newBook = req.body;
      console.log('Adding new book: ', newBook)
      bookCollection.insertOne(newBook)
      .then(result => {
        console.log('inserted count: ', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })
  
//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})