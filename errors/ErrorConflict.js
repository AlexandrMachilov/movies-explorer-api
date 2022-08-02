class ErrorConflict extends Error {
  constructor(message = 'Произошёл конфликт') {
    super(message);
    this.errorMessage = message;
    this.statusCode = 409;
  }
}

module.exports = ErrorConflict;
