class Conflict extends Error {
  constructor(message) {
    super();
    this.statusCode = 409;
    this.message = message;
  }
}

module.exports = Conflict;
