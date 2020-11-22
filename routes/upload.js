let express = require('express')
let router = express.Router()
let formidable = require('formidable')
let multer = require('multer')
let upload = multer({ dest: 'uploads/' })
let _ = require('lodash')
const xtj = require('convert-excel-to-json')
const product = require('../models/stock')
const mongoose = require('mongoose')
let items = []
let finalItems = []
let failedItems = []

router.post('/excel', upload.single('excelFile'), (req, res, next) => {
  items = []
  let sfile = req.file.path
  let jfile = xtj({
    sourceFile: sfile,
    columnToKey: {
      '*': '{{columnHeader}}'
    }
  })
  startProcess (jfile)
  res.send('done')
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
  console.log('Process done')
}

async function startDelete () {
  await product.deleteMany({ quantity: { $gte: 0 } }).then(function() {
    console.log('item deleted')
  }).catch(function(error) {
    console.log(error)
  })
}

module.exports = router
