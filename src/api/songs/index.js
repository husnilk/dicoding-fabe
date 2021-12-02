const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'song',
  version: '0.1.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  },
};
