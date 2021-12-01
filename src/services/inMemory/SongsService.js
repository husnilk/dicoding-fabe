const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    
    constructor (){
        this._songs = [];
    }
    
    addSong( {title, year, performer, genre, duration }) {
        
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        
        const song = {
            id, title, year, performer, genre, duration, insertedAt, updatedAt
        }
        
        this._songs.push(song);
        
        const isSuccess = this._songs.filter((m) => m.id === id).length > 0;
        
        if(!isSuccess) {
            throw new InvariantError('Song gagal ditambahkan');
        }
        
        return id;
        
    }
    
    getSongs() {
        return this._songs.map(({id, title, performer}) => ({id, title, performer}));
    }
    
    getSongById(id){
        const song = this._songs.filter((m) => m.id === id)[0];
        if(!song){
            throw new NotFoundError('Song tidak ditemukan');
        }
        return song;
    }
    
    editSongById(id, {title, year, performer, genre, duration }){
        const idx = this._songs.findIndex((m) => m.id === id);
        
        if(idx === -1){
            throw new NotFoundError('Gagal memperbaharui song. Id tidak ditemukan');
        }
        
        const updatedAt = new Date().toISOString();
        this._songs[idx] = {
            ...this._songs[idx],
            title,
            year,
            performer,
            genre,
            duration,
            updatedAt
        }
        
    }
    
    deleteSongById(id){
        const idx = this._songs.findIndex((m) => m.id === id);
        
        if(idx === -1){
            throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
        }
        
        this._songs.splice(idx, 1);
    }
}

module.exports = SongsService;