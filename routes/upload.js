let express = require('express')
const cors = require('cors')
let router = express.Router()
let formidable = require('formidable')
let _ = require('lodash')
const xtj = require('convert-excel-to-json')
const product = require('../models/stock')
const mongoose = require('mongoose')
let items = []
let finalItems = []
let failedItems = []

let corsOptions = {
  origin: ['https://futuramastock.herokuapp.com', 'http://futuramastock.herokuapp.com'],
  methods: ['GET', 'DELETE', 'POST', 'HEAD', 'OPTIONS', 'PUT']
}

router.use(cors(corsOptions))
router.options('/excel', cors(corsOptions))

router.post('/excel', cors(corsOptions), async (req, res) => {
  items = []
  const form = new formidable.IncomingForm()
  try {
    form.parse(req, async function(err, fields, files) {
      let sfile = files.file.path
      let jfile = xtj({
        sourceFile: sfile,
        columnToKey: {
          '*': '{{columnHeader}}'
        }
      })
      await startProcess (jfile)
      console.log('process done')
    })
    res.send('done')
  } catch (e) {
    res.send(e)
  }
})

router.get('/', (req, res) => {
  startDelete ()
  res.send('Done')
})

async function startProcess (file) {
  let count = 0
  for (var sheet in file) {
    for (var item in file[sheet]) {
      if (file[sheet][item]['sku'] !== 'undefined' || file[sheet][item]['price'] !== 0) {
        let d = new Date()
        let codeUse = file[sheet][item]
        codeUse['sku'] = _.toUpper(codeUse['sku'])
        codeUse['date'] = d
        console.log('start item: ' + count + ' = ' + codeUse['sku'])
        await product.updateOne({ sku: codeUse['sku'] }, {
          description: codeUse['description'], quantity: codeUse['quantity'],
          price: codeUse['price'], lastupdate: codeUse['date']
        }, { upsert: true })
        count += 1
      }
    }
  }
}

async function startDelete () {
  await product.deleteMany({ quantity: { $gte: 0 } }).then(function() {
    console.log('item deleted')
  }).catch(function(error) {
    console.log(error)
  })
}

module.exports = router
