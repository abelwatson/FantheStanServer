module.exports = (sequelize, DataTypes) => {
    const FavoritesModel = sequelize.define("favorites", {
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
        }
    })
    return FavoritesModel
}