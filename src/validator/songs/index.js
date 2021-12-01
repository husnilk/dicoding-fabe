const InvariantError = require("../../exceptions/InvariantError");
const { MusicPayloadSchema: SongPayloadSchema } = require("./schema")

const SongValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload);
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = SongValidator;