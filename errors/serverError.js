const { serverError } = require('../utils/constants');

class ServerError extends Error {
  constructor() {
    super();
    this.statusCode = 404;
    this.message = serverError;
  }
}

module.exports = ServerError;
