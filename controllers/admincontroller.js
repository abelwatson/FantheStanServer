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
        message: "Admin successfully registered",
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
                message: "Failed to register Admin",
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
                    message: "Admin successfully logged in!",
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
            message: "Failed to log Admin in",
        })
    }
});

// //GET All Users
// router.get('/users', async (req, res) => {
//     const { id, role } = req.user.id;

//     try {
//         if (role === 'basic') {
//             let User = await UserModel.findOne({
//                 where: { id: id}
//             })

//             if (User) {
//                 res.status(400).json({
//                     message: `Not Authorized to View Users`
//                 })
//             }
//         } else if (role === 'Admin') {
//             let User = await AdminModel.findone({
//                 where: { id: id }
//             })
//         }
//         const userReviews = await ReviewsModel.findAll({
//             where: {
//                 ownerID: id
//             }
//         });

//         res.status(200).json(userReviews)
//     } catch (err) {
//         res.status(500).json({
//             error: `[error]: ${err}`
//         });
//     }
// })

// // Delete Review
// router.delete("/delete/:id", async (req, res) => {
//     const { id, role } = req.user.id;

//     try {
//         if (role === 'basic') {
//             let User = await UserModel.findOne({
//                 where: { id: id }
//             });
            
//             if (User) {
//                 res.status(400).json({
//                     message: `Not Authorized to Remove Users`
//                 })
//                 };
//         } else if (role === 'Admin') {
//             let User = await AdminModel.findOne({
//                 where: { id: id }
//             });

//             if (User) {
//                 const query = {
//                     where: { id: id }
//                 };

//                 await UserModel.destroy(query);
//                 res.status(200).json({ message: "User/Admin Removed" });
//             }
//         }
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
// })

module.exports = router;