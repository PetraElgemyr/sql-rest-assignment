const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  addNewStore,
  deleteStoreById,
  createNewReviewForStoreById,
} = require("../controllers/storeControllers");

//getStoreById

//(getAllStores)

//addNewStore inloggad för
//   localhost:3000/api/v1/stores
router.post("/", isAuthenticated, addNewStore);

//hitta en store, lägg en review
//createNewReviewForStore   http://localhost:3000/api/v1/stores/:storeId/reviews
router.post("/:storeId/reviews", createNewReviewForStoreById);

//updateStoreById ägare för/admin

//deleteStoreById ägare för/admin
// localhost:3000/api/v1/stores/:storeId
router.delete("/:storeId", deleteStoreById);

module.exports = router;
