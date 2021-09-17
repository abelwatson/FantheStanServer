const router = require("express").Router();
const { AdminModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    const { email, password } = req.body.user;
    const userRole = 'Admin';
    try{
        const User = await AdminModel.create({
            email,
            password: bcrypt.hashSync(password, 13),
            role: userRole
    });

    let token = jwt.sign({ id: User.id, role: userRole }, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(201).json({
        message: "User successfully registered",
        user: User,
        sessionToken: token,
    });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }   
    }
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;
    try {
        const loginUser = await AdminModel.findOne({
            where: {
                email: email,
            },
        });
        if (loginUser) {
            const passwordComparison = await bcrypt.compare(password, loginUser.password);
            if (passwordComparison) {
                let token = jwt.sign({id: loginUser.id, role: loginUser.role}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token,
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({    
                message: "Incorrect email or password",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in",
        })
    }
});

module.exports = router;