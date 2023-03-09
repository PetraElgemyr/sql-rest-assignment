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
} = require("../controllers/storeControllers");
const { getAllReviewsByStoreId } = require("../controllers/reviewControllers");
const { validate } = require("../middleware/validation/validationMiddleware");
const {
  storeSchema,
  reviewSchema,
} = require("../middleware/validation/validationSchemas");

router.get("/", getAllStores);

router.get("/:storeId", getStoreById);

router.get("/:storeId/reviews", getAllReviewsByStoreId);

router.post("/", isAuthenticated, validate(storeSchema), addNewStore);

router.post(
  "/:storeId/reviews",
  isAuthenticated,
  validate(reviewSchema),
  createNewReviewForStoreById
);

router.put(
  "/:storeId",
  isAuthenticated,
  validate(storeSchema),
  updateStoreById
);

router.delete("/:storeId", isAuthenticated, deleteStoreById);

module.exports = router;
