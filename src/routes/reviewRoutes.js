const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { createNewReview } = require("../controllers/reviewControllers");


//deleteReviewById (inloggning ) /api/v1/reviews/:reviewId
router.delete("/:reviewId", isAuthenticated, deleteReviewById);

//getReviewById (för admin)
router.get("/:reviewId", getReviewById);


module.exports = router;
