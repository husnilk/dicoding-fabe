const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'auth',
  version: '0.1.0',
  register: async (server, {
    authsService,
    usersService,
    tokenManager,
    validator,
  }) => {
    const authsHandler = new AuthHandler(
      authsService,
      usersService,
      tokenManager,
      validator,
    );

    server.route(routes(authsHandler));
  },

};
