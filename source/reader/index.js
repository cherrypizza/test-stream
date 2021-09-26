const Koa = require('koa')
const router = require('./router')
const Transport = require('../transport/nats')
const { reader: readerConst } = require('../constants')

const port = readerConst.PORT

const transport = new Transport()
transport.init()

const app = new Koa()
app.use(router({ transport }).routes())

if (!module.parent) {
  app.listen(port)
  console.log(`reader on port ${port}`)
}

module.exports = app
