const { connect, JSONCodec, createInbox } = require('nats')
const { transport: constString } = require('../constants')
const sc = JSONCodec()

module.exports = class NatsTransport {
  constructor () {
    this._subscriptions = new Map()
  }

  /**
   * Создает подключение с NATS-сервером .
   * @param {object} transport - Экземпляр транспорта для взаимодействия с сервисом Writer.
   * @param {string} filePath - Абсолютный путь к файлу.
   * @param {string} fileName - Наименование файла.
   */
  async init () {
    this._nc = await connect()
    console.log(`NATS-client connected to ${this._nc.getServer()}`)
  }

  /**
   * Возвращает уникальную тему.
   * @return {string}
   */
  createInbox () {
    return createInbox()
  }

  /**
   * Отправляет сообщение с данными о наименовании файла, начале обработки и
   * наименовании темы для обработки данного файла и возвращает ответ.
   * @param {string} fileName - Наименование файла.
   * @param {string} fileSubject - Наименование темы для файла.
   * @return {Promise}
   */
  startTransfer ({ fileName, fileSubject }) {
    const data = {
      fileName,
      fileSubject,
      start: true
    }
    return new Promise((resolve, reject) => {
      const callback = (err, msg) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
      const inbox = createInbox()
      this._nc.subscribe(inbox, { callback })
      this._nc.publish(constString.BASE_SUBJECT, sc.encode(data), { reply: inbox })
    })
  }

  /**
   * Отправляет сообщение с данными о наименовании файла, окончании обработки и
   * наименовании темы для обработки данного файла.
   * @param {string} fileName - Наименование файла.
   * @param {string} fileSubject - Наименование темы для файла.
   */
  endTransfer ({ fileName, fileSubject }) {
    const data = {
      fileName,
      fileSubject,
      end: true
    }
    this._nc.publish(constString.BASE_SUBJECT, sc.encode(data))
  }

  /**
   * Отправляет данные с указанной темой.
   * @param {Uint8Array} data - Данные.
   * @param {string} subject - Наименование темы.
   */
  send ({ data, subject }) {
    this._nc.publish(subject, data)
  }

  /**
   * Подписывается на основную тему и тему файла и обрабатывает данные.
   * @param {Uint8Array} data - Данные.
   * @param {Object} fileProcessing - Объект для обработки данных файла.
   */
  listen (fileProcessing) {
    const writeCallback = (err, msg) => {
      if (err) {
        console.log('err: ', err)
      } else {
        fileProcessing.write({ data: msg.data, mapKey: msg.subject })
      }
    }

    const startEndCallback = (err, msg) => {
      if (err) {
        console.log('err: ', err)
      } else {
        const { fileName, fileSubject, start, end } = sc.decode(msg.data)
        if (start) {
          fileProcessing.createStream({ fileName, mapKey: fileSubject })
          const sub = this._nc.subscribe(fileSubject, { callback: writeCallback })
          this._subscriptions.set(fileSubject, { sub })
        } else if (end) {
          if (this._subscriptions.has(fileSubject)) {
            const { sub } = this._subscriptions.get(fileSubject)
            sub.drain()
          }
          fileProcessing.endStream({ fileName, mapKey: fileSubject })
        }
        msg.respond()
      }
    }

    this._nc.subscribe(constString.BASE_SUBJECT, { callback: startEndCallback })
  }

  /**
   * Закрывает соединения.
   */
  async close () {
    if (this._nc) {
      await this._nc.close()
      await this._nc.closed().then((err) => {
        let message = `connection to ${this._nc.getServer()} closed`
        if (err) {
          message = `${message} with an error: ${err.message}`
        }
        console.log(message)
      })
    }
  }
}
