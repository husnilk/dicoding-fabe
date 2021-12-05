require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const users = require('./api/users');
const auth = require('./api/auth');
const playlists = require('./api/playlists');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthService = require('./services/postgres/AuthService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const SongValidator = require('./validator/songs');
const UserValidator = require('./validator/users');
const AuthValidator = require('./validator/auths');
const PlaylistValidator = require('./validator/playlists');
const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authService = new AuthService();
  const playlistsService = new PlaylistsService();
  
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
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistValidator
      }
    }
  ]);
  
  await server.start();
  
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
