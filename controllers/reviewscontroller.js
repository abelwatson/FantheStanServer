const router = require('express').Router();
const ReviewsModel = require('../models');
let validateJWT = require('../middleware/validation');

//New Review
router.post('/create', validateJWT, async (req, res) => {
    const { heroVillain, review, imageURL, like, dislike } = req.body.review
    const { id } = req.user;
    const logReview = {
        heroVillain,
        review,
        imageURL,
        like,
        dislike,
        ownerID: id
    }
    try {
        const newReview = await ReviewsModel.create(logReview);
        res.status(200).json(newReview)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Review
router.put("/:id", validateJWT, async (req, res) => {
    const { review } = await req.body.review;
    const reviewId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: reviewId,
            ownerID: userId
        }
    };

    const updateReview = {
        review: review
    };

    try {
        const update = await ReviewsModel.update(updateReview, query);
        res.status(200).json({
            message: `Review has been updated.`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Review
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerID = req.user.id;
    const reviewId = req.params.id;

    try {
        const query = {
            where: {
                id: reviewId,
                ownerID: ownerID
            }
        };

        await ReviewsModel.destroy(query);
        res.status(200).json({ message: "Review Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

//GET All Reviews of User
router.get('/myReviews', validateJWT, async (req, res) => {
    const { id } = req.user

    try {
        const userReviews = await ReviewsModel.findAll({
            where: {
                ownerID: id
            }
        });

        res.status(200).json(userReviews)
    } catch (err) {
        res.status(500).json({
            error: `[error]: ${err}`
        });
    }
})

//GET All Reviews of a Hero/Villain based on the Name
router.get('/search/:value', validateJWT, async (req, res) => {//
    const value = req.params.value

    try {
        const allReviews = await ReviewsModel.findAll({
            where: {
                heroVillain: value
            }
        });

        res.status(200).json(allReviews)
    } catch (err) {
        res.status(500).json({
            error: `[error]: ${err}`
        });
    }
})

module.exports = router