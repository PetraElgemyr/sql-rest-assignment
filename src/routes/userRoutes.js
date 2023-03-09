const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllUsers,
  deleteUserById,
  getUserById,
} = require("../controllers/userController");
const { getAllReviewsByUserId } = require("../controllers/reviewControllers");

router.get("/", isAuthenticated, getAllUsers);

router.get("/:userId", getUserById);

router.delete("/:userId", isAuthenticated, deleteUserById);

router.get("/:userId/reviews", getAllReviewsByUserId);

module.exports = router;
