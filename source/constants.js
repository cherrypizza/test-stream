module.exports = {
  reader: {
    NO_FILENAME_MSG: 'Файл не найден или не указано имя.',
    PORT: 3000,
    FILE_STORAGE: '../../fileStorage/readerStorage'
  },
  writer: {
    PORT: 4000,
    FILE_STORAGE: '../../fileStorage/writerStorage'
  },
  transport: {
    BASE_SUBJECT: 'main'
  }
}
