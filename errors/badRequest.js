class BadRequest extends Error {
  constructor(message) {
    super();
    this.statusCode = 400;
    this.message = message;
  }
}

module.exports = BadRequest;
