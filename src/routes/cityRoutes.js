//Borttaget och flyttat till storeroutes.

const express = require("express");
const router = express.Router();
const { getAllStoresByCityId } = require("../controllers/storeControllers");

//getAllStoresByCityId  /api/v1/citys/stores/:cityId
router.get("/:cityId/stores", getAllStoresByCityId);

module.exports = router;
