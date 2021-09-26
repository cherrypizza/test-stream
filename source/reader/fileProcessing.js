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

    stream.on('data', (chunk) => {
      transport.send({ data: chunk, subject: fileSubject })
    })

    stream.on('end', () => {
      console.log(`${fileName} reading end.`)
      transport.endTransfer({ fileName, fileSubject })
    })

    stream.on('error', (err) => {
      console.log(err)
    })
  } catch (err) {
    console.log(err)
  }
}
