const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./db/connect');
const createUser = require('./routes/createUser')
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api', createUser)

app.get('*', function (req, res) {
  res.send(
    '<pre>not found</pre>' +
    `<style>
      body {background-color: #121212;
      color: #fff;
    }</style>`
  );
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);//check what these as: URI_var, { useNewUrlParser: true, useUnifiedTopology: true }
    app.listen(port, () =>
      console.log(`Listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();