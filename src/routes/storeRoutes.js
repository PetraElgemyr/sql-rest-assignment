const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  addNewStore,
  deleteStoreById,
  createNewReviewForStoreById,
  getAllStores,
  getStoreById,
  updateStoreById
} = require("../controllers/storeControllers");

const {
  getAllReviewsForStore
} = require("../controllers/reviewControllers");


//getStoreById
//localhost:3000/api/v1/stores/:storedId
router.get("/:storeId", getStoreById);

//(getAllStores)
router.get("/", getAllStores);

//addNewStore inloggad för
//   localhost:3000/api/v1/stores
router.post("/", isAuthenticated, addNewStore);

//hitta en store, lägg en review
//createNewReviewForStore   http://localhost:3000/api/v1/stores/:storeId/reviews
router.post("/:storeId/reviews", isAuthenticated, createNewReviewForStoreById);

//updateStoreById ägare för/admin
router.put("/:storeId", isAuthenticated, updateStoreById);

//deleteStoreById ägare för/admin
// localhost:3000/api/v1/stores/:storeId
router.delete("/:storeId", deleteStoreById);


//getAllReviewsForStore (inloggning krävs ej)/api/v1/:storeId/reviews
router.get("/stores/:storeId/reviews", getAllReviewsForStore);

module.exports = router;
