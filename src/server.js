require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const users = require('./api/users');
const auth = require('./api/auth');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthService = require('./services/postgres/AuthService');
const SongValidator = require('./validator/songs');
const UserValidator = require('./validator/users');
const AuthValidator = require('./validator/auths');
const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authService = new AuthService();
  
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  
  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator
      }
    },
    {
      plugin: auth,
      options: {
        authsService: authService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthValidator
      }
    }
  ]);
  
  await server.start();
  
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
