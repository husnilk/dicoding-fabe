require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

const songs = require('./api/songs');
const users = require('./api/users');
const auth = require('./api/auth');
const playlists = require('./api/playlists');
const _exports = require('./api/exports');
const uploads = require('./api/uploads');

const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthService = require('./services/postgres/AuthService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const ProducerService = require('./services/rabbitmq/ProducerService');
const StorageService = require('./services/storage/StorageService');
const CacheService = require('./services/redis/CacheService');

const SongValidator = require('./validator/songs');
const UserValidator = require('./validator/users');
const AuthValidator = require('./validator/auths');
const PlaylistValidator = require('./validator/playlists');
const ExportValidator = require('./validator/exports');
const UploadsValidator = require('./validator/uploads');

const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authService = new AuthService();
  const playlistsService = new PlaylistsService(cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/pictures'));

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
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
        validator: UserValidator,
      },
    },
    {
      plugin: auth,
      options: {
        authsService: authService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistsService,
        validator: ExportValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
