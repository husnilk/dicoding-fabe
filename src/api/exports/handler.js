const BadRequestError = require('../../exceptions/BadRequestError');

class ExportsHandler {
  constructor(service, playlitsService, validator) {
    this._service = service;
    this._playlistsService = playlitsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    try {
      this._validator.validateExportPlaylistPayload(request.payload);

      const userId = request.auth.credentials.id;
      const { targetEmail } = request.payload;
      const { playlistId } = request.params;

      console.log(userId, playlistId, targetEmail);
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

      const message = {
        userId,
        playlistId,
        targetEmail,
      };
      await this._service.sendMessage('export:playlist', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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

module.exports = ExportsHandler;
