const BadRequestError = require('./BadRequestError');
 
class AuthorizationError extends BadRequestError {
  constructor(message) {
    super(message, 403);
    this.name = 'Forbidden';
  }
}
 
module.exports = AuthorizationError;