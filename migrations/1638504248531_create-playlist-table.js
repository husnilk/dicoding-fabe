/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(32)',
            primaryKey: true
        },
        name: {
            type: 'VARCHAR(255)',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(255)',
            notNull: true
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('playlists');
};
