const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllStores,
  getStoreById,
  addNewStore,
  createNewReviewForStoreById,
  updateStoreById,
  deleteStoreById,
  getAllStoresByCityId,
} = require("../controllers/storeControllers");

//(getAllStores)
router.get("/", getAllStores);

//getStoreById
router.get("/:storeId", getStoreById);

//addNewStore inloggad för
router.post("/", isAuthenticated, addNewStore);

//createNewReviewForStore   http://localhost:3000/api/v1/stores/:storeId/reviews
router.post("/:storeId/reviews", isAuthenticated, createNewReviewForStoreById);

//updateStoreById ägare/admin
router.put("/:storeId", isAuthenticated, updateStoreById);

//deleteStoreById ägare /admin
router.delete("/:storeId", isAuthenticated, deleteStoreById);

module.exports = router;
