const fs = require('fs')
const path = require('path')
const { writer: writerConst } = require('../constants')

module.exports = class FileProcessing {
  constructor () {
    this._streams = new Map()
  }

  /**
   * Проверяет существование директории для записи файлов.
   * Если ее нет, то создает.
   */
  initStorage () {
    const dirPath = path.join(__dirname, writerConst.FILE_STORAGE)
    return new Promise((resolve, reject) => {
      fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
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
   * @return {Promise}
   */
  write ({ data, mapKey }) {
    return new Promise(resolve => {
      const { stream } = this._streams.get(mapKey)
      const next = stream.write(data)
      if (!next) {
        stream.once('drain', resolve)
      } else {
        resolve()
      }
    })
  }

  magic (data) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data)
      }, 0)
    })
  }
}
