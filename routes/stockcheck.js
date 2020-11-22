let express = require('express')
let router = express.Router()
let formidable = require('formidable')
let _ = require('lodash')
const xtj = require('convert-excel-to-json')
const product = require('../models/stock')
const mongoose = require('mongoose')

router.post('/', async (req, res) => {
  const code = req.body.SKU
  const found = null
  try {
    const found = await product.findOne({ sku: code })
    res.json(found)
  } catch (e) {
    res.json(e)
  }
})

router.post('/single', async (req, res) => {
  const code = req.body.SKU
  const stock = req.body.stock
  const price = req.body.price
  const eta = req.body.eta
  const alt = req.body.alt
  let d = new Date()
  await product.updateOne({ sku: code }, {
    quantity: stock, price: price, eta: eta, alt: alt, lastupdate: d
  })
  res.send('done')
})

router.post('/addsingle', async (req, res) => {
  const code = req.body.sku
  let codeUse = _.toUpper(code)
  const description = req.body.description
  const stock = req.body.quantity
  const price = req.body.price
  const eta = req.body.eta
  const alt = req.body.alt
  let d = new Date()
  await product.update({ sku: codeUse }, {
    description: description, quantity: stock, price: price, eta: eta, alt: alt, lastupdate: d
  }, { upsert: true })
  res.send('done')
})

router.post('/multiple', async (req, res) => {
  let items = []
  const form = new formidable.IncomingForm()
  form.parse(req, async function(err, fields, files) {
    let sfile = files.file.path
    let jfile = xtj({
      sourceFile: sfile,
      columnToKey: {
        '*': '{{columnHeader}}'
      }
    })
    const returnedItems = await startFind(jfile)
    res.send(returnedItems)
  })
})

async function startFind (book) {
  let itemsFound = []
  for (var sheet in book) {
    for (var item in book[sheet]) {
      if (book[sheet][item]['sku'] !== 'sku') {
        try {
          const found = await product.findOne({ sku: book[sheet][item]['sku'] })
          if (found == null) {
            console.log('Not found')
          } else {
            itemsFound.push(found)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
  return itemsFound
}

module.exports = router
