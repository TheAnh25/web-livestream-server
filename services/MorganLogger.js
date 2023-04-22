const morgan = require('morgan')
const json = require('morgan-json')
const loggerWinton = require('../middleware/loggerWinton.binh.dev.js')

const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time',
})

const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const { method, url, status, contentLength, responseTime } =
        JSON.parse(message)

      loggerWinton.info('HTTP Access Log', {
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime),
      })
    },
  },
})

module.exports = httpLogger
