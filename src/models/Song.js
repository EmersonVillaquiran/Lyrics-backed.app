const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Song = sequelize.define('song', {
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lyric: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Song;