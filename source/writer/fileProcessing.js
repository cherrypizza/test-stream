const fs = require('fs')
const path = require('path')
const { writer: writerConst } = require('../constants')

module.exports = class FileProcessing {
  constructor () {
    this._streams = new Map()
  }

  /**
   * Создает writable-поток для указанного файла и сохраняет в коллекции потоков.
   * @param {string} fileName - Наименование файла.
   * @param {string} mapKey - Ключ коллекции потоков.
   */
  createStream ({ fileName, mapKey }) {
    const filePath = path.join(__dirname, writerConst.FILE_STORAGE, fileName)
    const stream = fs.createWriteStream(filePath)
    stream.on('error', (err) => {
      console.log(err)
    })
    this._streams.set(mapKey, { stream })
  }

  /**
   * Находит поток в коллекции по указанному ключу и заканчивает запись.
   * @param {string} fileName - Наименование файла.
   * @param {string} mapKey - Ключ коллекции потоков.
   */
  endStream ({ fileName, mapKey }) {
    if (this._streams.has(mapKey)) {
      const { stream } = this._streams.get(mapKey)
      stream.end()
      console.log(`${fileName} recording end.`)
    }
  }

  /**
   * Находит поток в коллекции по указанному ключу и записывает данные.
   * @param {Uint8Array} data - Данные.
   * @param {string} mapKey - Ключ коллекции потоков.
   */
  write ({ data, mapKey }) {
    if (this._streams.has(mapKey)) {
      const { stream } = this._streams.get(mapKey)
      stream.write(data)
    }
  }
}
