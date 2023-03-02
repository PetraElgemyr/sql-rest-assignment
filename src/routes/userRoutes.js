const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  deleteUserById,
  getAllUsers,
} = require("../controllers/userController");
const { getAllReviewsByUserId } = require("../controllers/reviewControllers");

//getAllUsers (inloggning krävs, samt bara admin kan se alla användare)
router.get("/", isAuthenticated, getAllUsers);

//getUserById
router.get("/:userId", isAuthenticated, getAllUsers);

//deleteUserById

router.delete("/:userId", isAuthenticated, deleteUserById);

//getAllReviewsByUserId
router.get("/:userId/reviews", getAllReviewsByUserId);

module.exports = router;
