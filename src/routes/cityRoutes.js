const express = require("express");
const router = express.Router();
const { getAllStoresByCityId } = require("../controllers/storeControllers");

router.get("/:cityId/stores", getAllStoresByCityId);

module.exports = router;
