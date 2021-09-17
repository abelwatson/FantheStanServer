const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const DefineUser = require('./usermodel');
const DefineAdmin = require('./adminmodel')
const DefineReviews = require('./reviewsmodel');
const DefineFavorites = require('./favoritesmodel');

const UserModel = DefineUser(sequelize, DataTypes);
const AdminModel = DefineAdmin(sequelize, DataTypes);
const ReviewsModel = DefineReviews(sequelize, DataTypes);
const FavoritesModel = DefineFavorites(sequelize, DataTypes);

UserModel.hasMany(ReviewsModel);
UserModel.hasMany(FavoritesModel);
AdminModel.hasMany(ReviewsModel);
AdminModel.hasMany(FavoritesModel);

ReviewsModel.belongsTo(UserModel);
ReviewsModel.belongsTo(AdminModel);
FavoritesModel.belongsTo(UserModel);
FavoritesModel.belongsTo(AdminModel);

module.exports = {
    UserModel,
    AdminModel,
    ReviewsModel,
    FavoritesModel
}