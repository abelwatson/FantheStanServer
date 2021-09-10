const { DataTypes } = require('sequelize');
const db = require('../db');

const FavoritesModel = db.define('favorites', {
    HeroVillain: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    review: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    like: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    dislike: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = FavoritesModel;