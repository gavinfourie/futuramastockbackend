const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3030
const product = require('./models/stock')
const mongoose = require('mongoose')
const uri = "mongodb+srv://Bend:TA7tu6jU4p@bender.zavs7.mongodb.net/Inventory?retryWrites=true&w=majority"
let upload = require('./routes/upload')
let stockcheck = require('./routes/stockcheck')

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.on("error", err => {
  console.log("err", err)
})

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

app.use(cors())
app.use(express.json())
app.use('/upload', upload)
app.use('/stockcheck', stockcheck)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
