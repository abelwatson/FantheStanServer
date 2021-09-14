const router = require('express').Router();
const { FavoritesModel } = require('../models');
let validateJWT = require('../middleware/validation');

// New Favorite Item
router.post("/create", validateJWT, async (req, res) => {
    const { heroVillain, imageURL } = await req.body.favorites;
    const id = req.user.id;
    const addFavorite = {
        heroVillain,
        imageURL,
        ownerId: id
    }
    try {
        const newFavorite = await FavoritesModel.create(addFavorite);
        console.log(newFavorite);
        res.status(200).json(newFavorite)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Favorites
router.get("/mine", validateJWT, async (req, res) => {
    const id = req.user.id;
    try {
        const userFavorites = await FavoritesModel.findAll({
            where: {
                ownerId: id
            }
        });
        res.status(200).json(userFavorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Favorites Item
router.delete("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const favoritesId = req.params.id;

    try {
        const query = {
            where: {
                id: favoritesId,
                ownerId: ownerId
            }
        };

        await FavoritesModel.destroy(query);
        res.status(200).json({ message: "Character removed from your favorites!"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;