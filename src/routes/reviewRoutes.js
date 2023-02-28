const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { createNewReview } = require("../controllers/reviewControllers");

//createNewReview (inloggning krävs) /api/v1/:storeId/reviews

//updateReviewById (inloggning krävs) /api/v1/reviews/:reviewId

//deleteReviewById (inloggning ) /api/v1/reviews/:reviewId
