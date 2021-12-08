const BadRequestError = require('./BadRequestError');
 
class AuthError extends BadRequestError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}
 
module.exports = AuthError;