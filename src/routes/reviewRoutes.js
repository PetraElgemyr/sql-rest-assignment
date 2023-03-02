const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getReviewById,
  getAllReviewsByUserId,
  deleteReviewById,
} = require("../controllers/reviewControllers");

router.get("/:reviewId", isAuthenticated, getReviewById);

router.get("/:userId", getAllReviewsByUserId);

router.delete("/:reviewId", isAuthenticated, deleteReviewById);

//updateReviewById (inloggning krävs) /api/v1/reviews/:reviewId

module.exports = router;
