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
  let counter = 0

  try {
    await transport.startTransfer({ fileName, fileSubject })
    const stream = fs.createReadStream(filePath)

    stream.on('data', (chunk) => {
      counter++
      transport.send({ data: chunk, subject: fileSubject })
        .then(() => { counter-- })
        .catch(err => console.log(err))
    })

    stream.on('end', () => {
      console.log(`${fileName} reading end.`)
      const checkProgress = () => {
        setTimeout(() => {
          if (counter > 0) {
            checkProgress()
          } else {
            transport.endTransfer({ fileName, fileSubject })
          }
        }, 0)
      }
      checkProgress()
    })

    stream.on('error', (err) => {
      console.log(err)
    })
  } catch (err) {
    console.log(err)
  }
}
