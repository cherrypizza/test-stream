/* eslint-env mocha */
const app = require('../source/reader')
const server = app.listen()
const request = require('supertest').agent(server)
const { reader: errorString } = require('../source/constants')

const nonExistFileName = 'test'

describe('Reader', () => {
  after(() => {
    server.close()
  })

  it('POST /start without fileName', (done) => {
    request
      .post('/start')
      .expect(400, errorString.NO_FILENAME_MSG, done)
  })

  it('POST /start non-existent fileName', (done) => {
    request
      .post('/start')
      .query({ fileName: nonExistFileName })
      .expect(400, errorString.NO_FILENAME_MSG, done)
  })
})
