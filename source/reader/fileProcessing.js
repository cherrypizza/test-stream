const fs = require('fs')

/**
   * Запускает процесс обработки файла с созданием новой отдельной темы
   * для взаимодействия сервисов.
   * @param {object} transport - Экземпляр транспорта для взаимодействия с сервисом Writer.
   * @param {string} filePath - Абсолютный путь к файлу.
   * @param {string} fileName - Наименование файла.
   */
module.exports.start = async ({ transport, filePath, fileName }) => {
  const fileSubject = transport.createInbox()

  try {
    await transport.startTransfer({ fileName, fileSubject })
    const stream = fs.createReadStream(filePath)

    let next = false
    const sendData = () => {
      setTimeout(() => {
        if (next) {
          next = false
          const chunk = stream.read()
          if (chunk) {
            transport.send({ data: chunk, subject: fileSubject })
              .then(() => { sendData() })
              .catch(err => console.log(err))
          } else {
            console.log(`${fileName} reading end.`)
            transport.endTransfer({ fileName, fileSubject })
          }
        } else {
          sendData()
        }
      }, 0)
    }
    stream.on('readable', () => {
      next = true
    })

    stream.on('end', () => {
      next = true
    })

    stream.on('error', (err) => {
      console.log(err)
    })

    sendData()
  } catch (err) {
    console.log(err)
  }
}
