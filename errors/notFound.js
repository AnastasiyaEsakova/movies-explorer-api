const { notFoundMovieMessage } = require('../utils/constants');

class NotFound extends Error {
  constructor() {
    super();
    this.statusCode = 404;
    this.message = notFoundMovieMessage;
  }
}

module.exports = NotFound;
