const router = require('express').Router();
const { ReviewsModel, UserModel, AdminModel } = require('../models');
let validateJWT = require('../middleware/validation');

//New Reviews
router.post('/create', validateJWT, async (req, res) => {
    const { heroVillain, review, imageURL, like, dislike } = req.body.review;
    const { id, role } = req.user;
    const logReview = {
        heroVillain,
        review,
        imageURL,
        like,
        dislike,
        ownerID: id
    }
    try {
        if (role === 'basic') {
            let User = await UserModel.findOne({ 
                where: { id: id } 
            });

            if (User) {
                let userReview = await ReviewsModel.create(logReview);
                await User.addReview(userReview)

                res.status(200).json({
                    message: "Review Successful"
                });
            } else if (role === 'Admin') {
                let User = await AdminModel.findOne({
                    where: { id: id }
                });

                if (User) {
                    let userReview = await ReviewsModel.create(logReview);
                    await User.addReview(userReview);

                    res.status(200).json({
                        message: "Admin Review Created"
                    })
                }
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Review
router.put("/update/:id", validateJWT, async (req, res) => {
    const { review } = await req.body.review;
    const reviewId = req.params.id;
    const { id, role } = req.user;

    try {
        if (role === 'basic') {
            let User = await UserModel.findOne({ where: { id: id } });

            if (User) {
                const updateReview = {
                    review: review
                }
                const query = {
                    where: {
                        id: reviewId,
                        ownerID: id
                    }
                }
                await ReviewsModel.update(updateReview, query);
                res.status(200).json({
                    message: `Review has been updated.`
                });
            } else if (role === 'Admin') {
                let User = await AdminModel.findOne({ where: { id: id }})

                if (User) {
                    const updateReview = {
                        review: review
                    }
                    const query = {
                        where: {
                            id: reviewId,
                            ownerID: id,
                        }
                    };
                    await ReviewsModel.update(updateReview, query);
                    res.status(200).json({
                        message: `Admin review has been updated.`
                    });
                }
            };
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Review
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const { id, role } = req.user;
    const reviewId = req.params.id;

    try {
        if (role === 'basic') {
            let User = await UserModel.findOne({
                where: { id: id }
            });

            if (User) {
                const query = {
                    where: {
                        id: reviewId,
                        ownerID: id
                    }
                };

                await ReviewsModel.destroy(query);
                res.status(200).json({ message: "Review Entry Removed" });
            }
        } else if (role === 'Admin') {
            let User = await AdminModel.findOne({
                where: { id: id }
            });

            if (User) {
                const query = {
                    where: {
                        id: reviewId,
                        ownerID: id,
                    }
                };

                await ReviewsModel.destroy(query);
                res.status(200).json({ message: "Review Entry Removed" });
            }
        }
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