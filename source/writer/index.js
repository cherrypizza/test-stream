const Koa = require('koa')
const Transport = require('../transport/nats')
const FileProcessing = require('./fileProcessing')
const { writer: writerConst } = require('../constants')

const port = writerConst.PORT

const fileProcessing = new FileProcessing()
const transport = new Transport()
transport.init().then(() => {
  transport.listen(fileProcessing)
})

const app = new Koa()

if (!module.parent) {
  app.listen(port)
  console.log(`writer on port ${port}`)
}

module.exports = app
