const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllUsers,
  deleteUserById,
  getUserById,
} = require("../controllers/userController");
const { getAllReviewsByUserId } = require("../controllers/reviewControllers");

//getAllUsers (inloggning krävs, samt bara admin kan se alla användare)
router.get("/", isAuthenticated, getAllUsers);

//getUserById
router.get("/:userId", getUserById);

//deleteUserById
router.delete("/:userId", isAuthenticated, deleteUserById);

//getAllReviewsByUserId
router.get("/:userId/reviews", getAllReviewsByUserId);

module.exports = router;
