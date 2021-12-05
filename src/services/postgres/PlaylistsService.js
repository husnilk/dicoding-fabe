const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }
    
    async addPlaylist({name}) {
        //TODO: get owner
        const owner = 1;
        const id = `playlist-${nanoid(16)}`;
        
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };
        
        const result = await this._pool.query(query);
        
        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }
        
        return result.rows[0].id;
    }
    
    async getPlaylists() {
        //TODO: get owner 
        const owner = 1;
        const query = {
            text: 'SELECT id, name, owner FROM playlists WHERE owner=$1',
            values: [owner]
        }
        const playlists = await this._pool.query(query);
        
        return {
            status: 'success',
            data: {
                playlists
            }
        }
    }
    
    
    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlits WHERE id=$1 RETURNING id',
            values: [id],
        };
        
        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }
    
    async addSongToPlaylist(playlistId, songId){
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO playlistsong VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId]
        };
        
        return { id } = await this._pool.query(query);
    }

    async getPlaylistSongById(id) {
        const query = {
            text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
        return result;
    }

    async deleteSongFromPlaylist(playlistId, songId){
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId]
        }
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = PlaylistsService;
