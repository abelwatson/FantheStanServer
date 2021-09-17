module.exports = (sequelize, DataTypes) => {
    const AdminModel = sequelize.define("admin", {
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
    return AdminModel
}