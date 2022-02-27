const { forbiddenMovieMesaage } = require('../utils/constants');

class Forbidden extends Error {
  constructor() {
    super();
    this.statusCode = 403;
    this.message = forbiddenMovieMesaage;
  }
}

module.exports = Forbidden;
