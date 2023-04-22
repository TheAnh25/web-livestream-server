class ErrorHandler extends Error {
  code
  constructor(message, code) {
    super(message)
    this.code = code

    Error.captureStackTrace(this, this.message)
  }
}

module.exports = ErrorHandler
