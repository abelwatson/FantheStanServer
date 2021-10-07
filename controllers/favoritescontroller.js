const router = require('express').Router();
const { FavoritesModel, UserModel, AdminModel } = require('../models');
let validateJWT = require('../middleware/validation');

//Add to Favorites
router.post("/create", validateJWT, async (req, res) => {
    const { heroVillain, imageURL } = await req.body.favorites;
    const { id, role } = req.user;
    const logFavorite = {
        heroVillain,
        imageURL,
        ownerID: id
    }
    try {
        if (role === 'basic') {
            let User = await UserModel.findOne({ where: { id: id } });

            if (User) {
                let userFavorite = await FavoritesModel.create(logFavorite);
                await User.addFavorite(userFavorite)

                res.status(200).json({
                    message: "User Favorite Successful"
                });
            } else if (role === 'Admin') {
                let User = await AdminModel.findOne({
                    where: { id: id }
                });

                if (User) {
                    let userFavorite = await FavoritesModel.create(logFavorite);
                    await User.addFav(userFavorite);

                    res.status(200).json({
                        message: "Admin Favorite Created"
                    })
                }
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Favorites
router.get("/mine", validateJWT, async (req, res) => {
    const { id, role } = req.user;
    try {
        if (role === 'basic') {
            let User = await UserModel.findOne({
                where: { id: id }
            })

            if (User) {
                const userFavorite = await FavoritesModel.findAll({
                    where: {
                        ownerID: id
                    }
                });
                res.status(200).json({
                    message: "Retrieved User Favorites",
                    userFavorite
                });
            }
        } else if (role === 'Admin') {
            let User = await AdminModel.findOne({
                where: { id: id }
            })

            if (User) {
                const userFavorite = await FavoritesModel.findAll({
                    where: {
                        ownerID: id
                    }
                });

                res.status(200).json({
                    message: "Retrieved Admin Favorites",
                    userFavorite
                });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Favorites Item
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const { id, role } = req.user;
    const favoritesId = req.params.id;

    try {
        if (role === 'basic') {
            let User = await UserModel.findOne({
                where: { id: id }
            });
            if (User) {
                const query = {
                    where: {
                        id: favoritesId,
                        ownerID: id
                    }
                };

                await FavoritesModel.destroy(query);
                res.status(200).json({ message: "User Favorites Removed!" });
            }
        } else if (role === 'Admin') {
            let User = await AdminModel.findOne({
                where: { id: id }
            });

            if (User) {
                const query = {
                    where: {
                        id: favoritesId,
                        ownerID: id
                    }
                };
                await FavoritesModel.destroy(query);
                res.status(200).json({ message: "Favorites Removed!" });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;