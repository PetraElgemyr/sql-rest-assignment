const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { deleteUserById } = require("../controllers/userController");

//getUserById

//deleteUserById

router.delete("/:userId", isAuthenticated, deleteUserById);

//getAllUsers (endast admin)
//router.get("/users", isAuthenticated, getAllUsers);


module.exports = router;
