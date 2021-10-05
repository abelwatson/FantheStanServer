module.exports = (sequelize, DataTypes) => {
    const ReviewsModel = sequelize.define("review", {
        heroVillain: {
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
        like: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dislike: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ownerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
    return ReviewsModel
}