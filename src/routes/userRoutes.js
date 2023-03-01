const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { deleteUserById } = require("../controllers/userController");
const { getAllReviewsByUserId } = require("../controllers/reviewControllers");

//getUserById


//deleteUserById

router.delete("/:userId", isAuthenticated, deleteUserById);

//getAllUsers (endast admin)
//router.get("/users", isAuthenticated, getAllUsers);

//getAllReviewsByUserId
router.get("/:userId/reviews", getAllReviewsByUserId);

module.exports = router;
