const jwt = require('jsonwebtoken');
const { UserModel, AdminModel } = require('../models')

const validateJWT = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();

    } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
        const { authorization } = req.headers;

        const payload = authorization ?
            jwt.verify(authorization.includes('Bearer') ?
                authorization.split(" ")[1] :
                authorization, process.env.JWT_SECRET) : undefined;

        if (payload) {
            if (payload.role === 'basic') {
                let foundUser = await UserModel.findOne({
                    where: { id: payload.id }
                });

                if (foundUser) {
                    req.user = foundUser;
                    next();

                } else {
                    res.status(400).json({
                        message: 'Not Authorized-Basic.',
                    });
                }

            } else if (payload.role === 'Admin') {
                let foundUser = await AdminModel.findOne({
                    where: { id: payload.id } });

                if (foundUser) {
                    req.user = foundUser;
                    next();

                } else {
                    res.status(400).json({ message: 'Not Authorized-Admin.', });
                }

            } else {
                res.status(400).json({
                    message: 'Not Authorized-No Payload.',
                });
            }

        } else {
            res.status(400).json({ message: 'Invalid Token.' });
        }

    } else {
        res.status(400).json({ message: 'Not Authorized-Not Valid JWT.', });
    }
}

module.exports = validateJWT;