const BadRequest = require('./BadRequestError');

class NotFoundError extends BadRequest {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
