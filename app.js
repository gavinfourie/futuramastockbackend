const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3030
const product = require('./models/stock')
const mongoose = require('mongoose')
const uri = process.env.DATABASE_URL

let corsOptions = {
  origin: ['https://futuramastock.herokuapp.com', 'http://futuramastock.herokuapp.com'],
  methods: ['GET', 'DELETE', 'POST', 'HEAD', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type', 'Origin', 'X-Requested-With']
}

app.options('*', cors())
app.use(cors(corsOptions))

let upload = require('./routes/upload')
let stockcheck = require('./routes/stockcheck')

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.on("error", err => {
  console.log("err", err)
})

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

app.use(express.json())
app.use('/upload', upload)
app.use('/stockcheck', stockcheck)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
