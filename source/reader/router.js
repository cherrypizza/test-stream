const Router = require('@koa/router')
const fs = require('fs')
const path = require('path')
const fileProcessing = require('./fileProcessing')
const { reader: readerConst } = require('../constants')

const getStat = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        reject(err)
      } else {
        resolve(stat)
      }
    })
  })
}

module.exports = ({ transport }) => {
  const router = new Router()

  router.post('/start', async (ctx) => {
    const { query: { fileName } = {} } = ctx.request

    let filePath
    let fileStat
    try {
      filePath = path.join(__dirname, readerConst.FILE_STORAGE, fileName)
      fileStat = await getStat(filePath)
    } catch (err) {
      ctx.throw(400, readerConst.NO_FILENAME_MSG)
    }

    if (!fileStat.isFile()) {
      ctx.throw(400, readerConst.NO_FILENAME_MSG)
    }

    fileProcessing.start({ transport, filePath, fileName })

    ctx.body = ''
    ctx.status = 200
  })

  return router
}
