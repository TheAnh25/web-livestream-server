const winston = require('winston')
const { format } = require('winston')
const { consoleFormat } = require('winston-console-format')
const options = {
  file: {
    level: 'info',
    filename: './loggerWinston/app.log',
    handleExcreptions: true,
    json: true,
    maxSize: 5232880,
    maxFiles: 5,
    colorize: true,
    format: format.combine(
      format.colorize({ all: true }),
      format.padLevels(),
      consoleFormat({
        showMeta: true,
        metaStrip: ['timestamp', 'service'],
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
          compact: Infinity,
        },
      })
    ),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  error: {
    filename: './loggerError/app.log',
    level: 'error',
    maxFiles: 10,
    maxsize: 5232880,
    colorize: true,
  },
}

const loggerWinston = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    new winston.transports.File(options.error),
  ],
  exitOnError: false,
})

module.exports = loggerWinston
