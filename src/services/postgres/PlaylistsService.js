const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const BadRequestError = require('../../exceptions/BadRequestError');

class PlaylistsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    await this._cacheService.delete(`playlists:${owner}`);

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const playlists = await this._cacheService.get(`playlists:${owner}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON users.id=playlists.owner WHERE owner=$1',
        values: [owner],
      };
      const playlists = await this._pool.query(query);

      const result = {
        status: 'success',
        data: {
          playlists: playlists.rows,
        },
      };
      await this._cacheService.set(`playlits:${owner}`, JSON.stringify(result));
      return result;
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const { playlistSongId } = await this._pool.query(query);
  }

  async getPlaylistSongById(id) {
    const query = {
      text: 'SELECT songs.id as id, title, performer FROM playlistsongs LEFT JOIN songs ON songs.id=playlistsongs.song_id WHERE playlist_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return {
      status: 'success',
      data: {
        songs: result.rows,
      },
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new BadRequestError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const playlists = await this._pool.query(query);

    if (!playlists.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = playlists.rows[0];

    if (playlist.owner != owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }
}

module.exports = PlaylistsService;
