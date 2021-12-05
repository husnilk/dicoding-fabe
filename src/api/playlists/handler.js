const BadRequestError = require('../../exceptions/BadRequestError');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }
  
  async postPlaylistsHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      
      const { name } = request.payload;
      
      const playlistId = await this._service.addPlaylist({ name });
      
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
      
    } catch (error) {
      if (error instanceof BadRequestError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      
      // TODO: Mungkinkah?
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  
  async getPlaylistsHandler() {
    const playlists = await this._service.getPlaylists();
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }
  
  async deletePlaylistsHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deletePlaylistById(id);
      return {
        status: 'success',
        message: 'Palylist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        const response = h.response({
          status: 'fail',
          message: 'Playlist gagal dihapus. Id tidak ditemukan',
        });
        response.code(error.statusCode);
        return response;
      }
      
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  
  async postPlaylistsSongsHandler(request, h){
    try{
      
      this._validator.validatePlaylistSongPayload(request.payload);
      
      const { songId } = request.payload;
      const {playlistId } = request.params;
      
      const playlistSongId = await this._service.addSongToPlaylist(playlistId, songId);
      
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke dalam playlist',
        data: {
          playlistSongId
        }
      });
      response.code(201);
      return response;
      
    }catch(error) {
      
      if(error instanceof BadRequestError){
        const response = h.response({
          status: 'fail',
          message: error.message
        });
        response.code(error.statusCode);
        return response;
      }
      
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }    
  }
  
  async getPlaylistSongByIdHandler(){
    try{
      const { playlistId } = request.params;
      
      const songs = await this._service.getPlaylistSongById(playlistId);
      
      return {
        status: 'success',
        data: songs
      }
    }catch(error){
      if (error instanceof BadRequestError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongByIdHandler(){
    try{
      const { playlistId } = request.params;
      const {songId} = request.payload;
      
      await this._service.deleteSongFromPlaylist(playlistId, songId);

    }catch (error) {
      if (error instanceof BadRequestError) {
        const response = h.response({
          status: 'fail',
          message: 'Song gagal dihapus. Id tidak ditemukan',
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistHandler;
