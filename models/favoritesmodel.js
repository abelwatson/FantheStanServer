const { DataTypes } = require('sequelize');
const db = require('../db');

const FavoritesModel = db.define('favorites', {
    heroVillain: {
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
});

module.exports = FavoritesModel;