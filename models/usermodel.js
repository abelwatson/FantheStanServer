module.exports = (sequelize, DataTypes) => {
    const UserModel = sequelize.define('user', {
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    return UserModel
}